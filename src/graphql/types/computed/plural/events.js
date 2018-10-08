import {log,} from 'lib/logger'

export const query = 'events'

export const root = async (parent, data, {prisma, viewer,}) => {
  if (!viewer) {
    log.silly('guests cannot read any events')
    return []
  }

  log.debug('getting events')

  const permissions = await viewer.permissions()

  if (!permissions.includes('READ_EVENTS')) {
    log.silly('no permission to list events')
    return []
  }

  log.debug('checks passed, returning events')
  return prisma.events(data)
}
