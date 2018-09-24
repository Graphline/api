import bcrypt from 'bcryptjs'
import raven from 'raven'
import jwt from 'jsonwebtoken'
import {cloneDeep,} from 'lodash'
import {
  sendEmail as transportEmail,
} from 'api/email/mailer'
import staticConfig from 'lib/config'

const sendEmail = async (locals, {template,}) => {
  if (!locals.email) {
    throw new Error('locals-no-email')
  }
  if (!locals.user || !locals.oldUser) {
    throw new Error('locals-no-oldUser-object')
  }

  const config = await staticConfig()
  const token = jwt.sign({
    'email': locals.email,
  }, config.get('keypair.clientprivate'), {
    'expiresIn': '1d',
    'issuer':    config.get('domain'),
    'algorithm': 'HS256',
  })
  const link = `https://${config.get('domain')}/account/verify-email/${token}`

  const result = await transportEmail({
    'to':     locals.email,
    'locals': {
      ...locals,
      link,
    },
    template,
  })

  return result
}

const resolver = async (root, {input,}, {User, Session, token, viewer,}) => {
  if (!viewer) {
    throw new Error('authorisation-required')
  }

  const {email, password, display, bio, donationUrl,} = input
  const config = await staticConfig()
  const saltRounds = parseInt(config.get('saltrounds'), 10)
  const user = viewer
  const oldUser = cloneDeep(viewer)
  let link = null

  // Password resets
  if (password) {
    raven.captureBreadcrumb({
      'message': 'Changing password',
    })
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(password, salt)

    user.password = hash
  }

  // Username changing
  if (display) {
    if (user.display === display) {
      throw new Error('cannot-change-to-same-display')
    }
    raven.captureBreadcrumb({
      'message': 'Changing display',
    })

    user.display = display
  }

  // E-mail address changing
  if (email) {
    if (user.email === email) {
      throw new Error('cannot-change-to-same-email')
    }
    raven.captureBreadcrumb({
      'message': 'Changing email',
    })

    user.pendingEmail = email
    user.emailVerified = false

    const verificationToken = jwt.sign({
      email,
    }, config.get('keypair.clientprivate'), {
      'expiresIn': '1d',
      'issuer':    config.get('domain'),
      'algorithm': 'HS256',
    })

    link = `https://${config.get('domain')}/verify-email/${verificationToken}`
  }

  if (bio) {
    raven.captureBreadcrumb({
      'message': 'Changing bio',
    })
    user.bio = decodeURIComponent(bio)
  }

  if (donationUrl || donationUrl === '') {
    raven.captureBreadcrumb({
      'message': 'Changing donationUrl',
    })
    user.donationUrl = donationUrl
  }

  user.lastSeenAt = new Date()
  user.lastSeenReason = 'changing account details'

  // Try to save the user object
  const savedUser = await user.save()

  // Only send notification emails if saving was successful
  if (password) {
    await sendEmail({
      user,
      oldUser,
      'email': user.email,
    }, {
      'template': 'password-changed',
    })
  }

  if (display) {
    await sendEmail({
      user,
      oldUser,
      'newDisplayname': display,
      'email':          user.email,
    }, {
      'template': 'username-changed',
    })
  }

  if (email) {
    await sendEmail({
      'email': user.email,
      user,
      oldUser,
    }, {
      'template': 'email-reverification-previous',
    })

    await sendEmail({
      user,
      oldUser,
      email,
      link,
    }, {
      'template': 'email-reverification-next',
    })
  }

  if (donationUrl) {
    await sendEmail({
      'email': user.email,
      user,
      oldUser,
    }, {
      'template': 'donation-link-changed',
    })
  }

  return savedUser
}

export default {
  'name': 'account',

  resolver,
}
