import moment from 'moment'
import jwt from 'jsonwebtoken'
import pify from 'pify'
import bcryptjs from 'bcryptjs'
import {AuthenticationError,} from 'apollo-server-express'
import {log,} from 'lib/logger'

const bcrypt = pify(bcryptjs)

/*
 * This mutation signals a login
 */

export const name = 'createSession'
export const mutate = async (root, {data,}, {prisma, headers, connection, ip, url,}) => {
  log.debug('creating new session')

  const {email, password,} = data

  log.silly(`finding user by e-mail: ${email}`)
  const [ user, ] = await prisma.users({
    'where': {
      'email': {
        'address': email,
      },
    },
  })

  if (!user || !user.enabled) {
    log.silly(`user not found or is not enabled - user: ${JSON.stringify(user)}, sending AuthenticationError`)
    throw new AuthenticationError('Authentication required')
  }

  log.silly('checking password against hash')
  const result = await bcrypt.compare(password, user.password)

  log.debug(`password check result: ${result}`)

  if (!result) {
    log.silly('passwords don\'t match, sending AuthenticationError')
    throw new AuthenticationError('Authentication required')
  }

  const ua = headers['user-agent']
  const expires = moment().add(parseInt(process.env.SESSION_EXPIRY_MINUTES, 10), 'minutes')
  const expiresAt = expires.toISOString()
  const expiresUnix = expires.unix()

  log.silly('generating session token')
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

  log.debug('checks passed, creating new session')
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
