import {ForbiddenError,} from 'apollo-server-express'

export const name = 'createEntry'
export const mutate = async (root, {data,}, {prisma, viewer,}) => {
  if (!viewer) {
    throw new ForbiddenError('Authorization required')
  }

  const permissions = await viewer.permissions()

  if (!permissions.includes('CREATE_ENTRY')) {
    throw new ForbiddenError('Permission denied')
  }

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

  return prisma.createEntry(data)
}
