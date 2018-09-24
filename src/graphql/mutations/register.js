import bcrypt from 'bcryptjs'
import log from 'chalk-console'
import raven from 'raven'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import {sendEmail,} from 'api/email/mailer'

import staticConfig from 'lib/config'

const createSendEmail = async ({email, display,}) => {
  const config = await staticConfig()
  const token = jwt.sign({
    email,
  }, config.get('keypair.clientprivate'), {
    'expiresIn': '1d',
    'issuer':    config.get('domain'),
    'algorithm': 'HS256',
  })

  let link = `https://${config.get('domain')}/verify-email/${token}`

  if (process.env.NODE_ENV === 'development') {
    link = `http://${config.get('domain')}/verify-email/${token}`
  }

  const expires = moment().add(1, 'days').format('MMMM Do, HH:mm ZZ')

  const result = await sendEmail({
    'to':       email,
    'template': 'email-verification-initial',
    'locals':   {
      display,
      link,
      expires,
    },
  })

  return result
}

export default {
  'name': 'register',

  async resolver (root, {input,}, {User, token,}) {
    const {display, email, password, bio, donationUrl,} = input
    const config = await staticConfig()
    const salt = await bcrypt.genSalt(parseInt(config.get('saltrounds'), 10))
    const hash = await bcrypt.hash(password, salt)
    const newUser = new User({
      'createdAt':     new Date(),
      'updatedAt':     new Date(),
      'password':      hash,
      'emailVerified': false,
      'lastSeenAt':    new Date(),
      display,
      email,
      bio,
      donationUrl,
    })

    newUser.createdBy = newUser.id
    newUser.updatedBy = newUser.id

    const savedUser = await newUser.save()

    createSendEmail(newUser)
    .catch((error) => {
      log.error(error.stack)
      raven.captureException(error)
    })

    return savedUser
  },
}
