import moment from 'moment'
import jwt from 'jsonwebtoken'
import pify from 'pify'
import bcryptjs from 'bcryptjs'
import {AuthenticationError,} from 'apollo-server-express'

const bcrypt = pify(bcryptjs)

/*
 * This mutation signals a login
 */

export const name = 'createSession'
export const mutate = async (root, {data,}, {prisma, headers, connection, ip, url,}) => {
  const {email, password,} = data
  const [ user, ] = await prisma.users({
    'where': {
      'email': {
        'address': email,
      },
    },
  })

  if (!user || !user.enabled) {
    throw new AuthenticationError('Authentication required')
  }

  const result = await bcrypt.compare(password, user.password)

  if (!result) {
    throw new AuthenticationError('Authentication required')
  }

  const ua = headers['user-agent']
  const expires = moment().add(parseInt(process.env.SESSION_EXPIRY_MINUTES, 10), 'minutes')
  const expiresAt = expires.toISOString()
  const expiresUnix = expires.unix()

  const token = jwt.sign({
    'exp': expiresUnix,
    'iss': url,
    'sub': {
      '__typename': 'User',
      'id':         user.id,
    },
    'data': {
      'user': {
        '__typename': 'User',
        'id':         user.id,
        'display':    user.display,
      },
    },
  }, process.env.SECRET)

  return prisma.createSession({
    expiresAt,
    ip,
    ua,
    token,

    'user': {
      'connect': {
        'id': user.id,
      },
    },
  })
}
