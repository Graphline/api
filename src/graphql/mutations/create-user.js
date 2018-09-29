import pify from 'pify'
import bcryptjs from 'bcryptjs'
import {ForbiddenError,} from 'apollo-server-express'

const bcrypt = pify(bcryptjs)

/*
 * This mutation signals a registration
 */

const saltRounds = process.env.NODE_ENV === 'production'
  ? 14
  : 12

export const name = 'createUser'
export const mutate = async (root, {data,}, {prisma, viewer,}) => {
  const {display, password, email,} = data

  const salt = await bcrypt.genSalt(saltRounds)
  const hash = await bcrypt.hash(password, salt)

  /*
   * If viewer exists, then this signals that an existing user is creating
   * a new user.
   * Otherwise, this means that a new user is registering by themselves.
   */

  if (viewer) {
    const permissions = viewer.permissions()

    if (!permissions.includes('CREATE_USER')) {
      throw new ForbiddenError('Permission denied')
    }
  } else if (process.env.ENABLE_REGISTRATION !== 'true') {
    throw new ForbiddenError('Permission denied')
  }

  return prisma.createUser({
    display,
    'password': hash,
    'email':    {
      'create': {
        'address': email,
      },
    },
  })
}
