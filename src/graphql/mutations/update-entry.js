import {ForbiddenError,} from 'apollo-server-express'
import {log,} from 'lib/logger'

export const name = 'updateEntry'
export const mutate = async (root, {data,}, {prisma, viewer,}) => {
  log.debug('creating new entry')

  if (!viewer) {
    log.silly('no viewer, sending ForbiddenError')
    throw new ForbiddenError('Authentication required')
  }

  log.debug('checking permissions')
  const permissions = await viewer.permissions()

  if (permissions.includes('UPDATE_ENTRY_OTHERS')) {
    return prisma.updateEntry({
      'where': {
        'id': data.id,
      },
      'data': {
        'content':   data.content,
        'display':   data.display,
        'published': data.published,
      },
    })
  }

  if (permissions.includes('UPDATE_ENTRY_OWN')) {
    const user = await viewer.user()
    const createdBy = await prisma.entry({'id': data.id,}).createdBy()

    if (createdBy.id !== user.id) {
      throw new ForbiddenError('Permission denied')
    }

    return prisma.updateEntry({
      'where': {
        'id': data.id,
      },
      'data': {
        'content':   data.content,
        'display':   data.display,
        'published': data.published,
      },
    })
  }

  // log.debug('checks complete, creating new entry')
  // const user = await viewer.user()
  //
  // data.updatedBy = {
  //   'connect': {
  //     'id': user.id,
  //   },
  // }
  //
  // return prisma.updateEntry({where, data,})
  log.silly('no permissions, sending ForbiddenError')
  throw new ForbiddenError('Permission denied')
}
