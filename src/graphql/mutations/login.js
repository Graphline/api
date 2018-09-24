import staticConfig from 'lib/config'
import {expected,} from 'api/lib/custom-errors'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import bcrypt from 'bcryptjs'

const {AuthenticationError,} = expected
const invalidCreds = 'authorisation-required'

const resolver = async (root, {input,}, {User, Session, Theme, headers, connection,}) => {
  const {email, password,} = input
  const config = await staticConfig()
  const requestedUser = await User.findOne({
    email,
  })

  let authResult = null

  try {
    authResult = await bcrypt.compare(password, requestedUser.password)
  } catch (error) {
    throw new AuthenticationError(invalidCreds)
  }

  if (!authResult) {
    throw new AuthenticationError(invalidCreds)
  }

  const token = jwt.sign({
    'userId': requestedUser._id,
  }, config.get('keypair.clientprivate'), {
    'expiresIn': '60d',
    'issuer':    config.get('domain'),
    'algorithm': 'HS256',
  })

  const newSession = new Session({
    'createdBy': requestedUser,
    'updatedBy': requestedUser,
    'expiresAt': moment().add(60, 'days').toJSON(),
    'createdAt': moment().toJSON(),
    'updatedAt': moment().toJSON(),
    'display':   'A Session',
    'ua':        headers['user-agent'],
    'ip':        headers['x-forwarded-for'] || connection.remoteAddress,
    token,
  })

  requestedUser.lastSeen = moment().toJSON()
  requestedUser.lastSeenReason = 'logging in'

  const [ session, ] = await Promise.all([
    await newSession.save(),
    await requestedUser.save(),
  ])

  return session
}

export default {
  'name': 'login',

  resolver,
}
