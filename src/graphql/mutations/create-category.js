import {ForbiddenError,} from 'apollo-server-express'
import {log,} from 'lib/logger'

export const name = 'createCategory'
export const mutate = async (root, {data,}, {prisma, viewer,}) => {
  log.debug('creating new category')

  if (!viewer) {
    log.silly('no viewer, sending ForbiddenError')
    throw new ForbiddenError('Authentication required')
  }

  log.debug('checking permissions')
  const permissions = await viewer.permissions()

  if (!permissions.includes('CREATE_CATEGORY')) {
    log.silly('no permissions, sending ForbiddenError')
    throw new ForbiddenError('Permission denied')
  }

  log.debug('checks complete, creating new category')
  const user = await viewer.user()

  data.createdBy = {
    'connect': {
      'id': user.id,
    },
  }

  data.updatedBy = {
    'connect': {
      'id': user.id,
    },
  }

  data.publishedBy = {
    'connect': {
      'id': user.id,
    },
  }

  return prisma.createCategory(data)
}
