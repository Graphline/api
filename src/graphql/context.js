import fetch from 'node-fetch'
import {Agent,} from 'https'
import MatomoApi from 'matomo-reporting-js'
import jwt from 'jsonwebtoken'
import {flattenDeep, uniq,} from 'lodash'

import {prisma,} from '@/prisma/generated/javascript'
import {log,} from 'lib/logger'

const agent = new Agent({
  'rejectUnauthorized': process.env.MATOMO_ACCEPT_INVALID_TLS === 'false',
})

const matomo = new MatomoApi({
  fetch,
  agent,
  handler (error) {
    log.warn(error.stack)
  },
}, {
  'endpoint': process.env.MATOMO_URL,
  'idSite':   parseInt(process.env.MATOMO_SITE_ID, 10),
})

const getRolePermissions = async ({id,}) => {
  const role = await prisma.role({
    id,
  }).$fragment(`
    fragment PermissionFragment on Role {
      id
      permissions {
        value
      }
      children {
        id
      }
    }
  `)

  const permissions = role.permissions.map((permission) => permission.value)

  if (role.children) {
    const gets = []

    role.children.forEach((child) => {
      gets.push(getRolePermissions({'id': child.id, prisma,}))
    })

    const children = await Promise.all(gets)

    children.forEach((child) => {
      permissions.push(child)
    })
  }

  return permissions
}

const getPermissions = async ({id,}) => {
  const user = await prisma.user({
    id,
  }).$fragment(`
    fragment UserSessionFragment on User {
      id
      password
      roles {
        id
      }
    }
  `)

  const roles = await Promise.all(user.roles.map((role) => {
    return getRolePermissions({
      'id': role.id,
      prisma,
    })
  }))

  return uniq(flattenDeep(roles))
}

const getViewer = ({token,}) => {
  if (!token) {
    return null
  }

  let claim = null

  try {
    claim = jwt.verify(token, process.env.SECRET, {
      'issuer': `${process.env.PROTOCOL}://${process.env.FQDN}`,
    })
  } catch (error) {
    log.warn(error)
  }

  if (!claim) {
    return null
  }

  /* eslint-disable-next-line accessor-pairs */
  return {
    'user': () => prisma.user({
      'id': claim.data.user.id,
    }),

    'permissions': () => getPermissions({
      'id': claim.data.user.id,
    }),
  }
}

export default ({req,}) => {
  return {
    matomo,
    prisma,
    'viewer': getViewer({
      'token': req.headers.authorization,
    }),
    'headers':    req.headers,
    'connection': req.connection,
    'cookies':    req.cookies,
    'ip':         process.env.TRUST_PROXY === 'true'
      ? req.headers['x-forwarded-for'] || req.connection.remoteAddress
      : req.connection.remoteAddress,

    'url': `${process.env.PROTOCOL}://${process.env.FQDN}`,
  }
}
