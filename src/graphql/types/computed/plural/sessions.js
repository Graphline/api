import {log,} from 'lib/logger'

export const query = 'sessions'

export const root = async (parent, data, {prisma, viewer,}) => {
  log.debug('getting sessions')

  if (!viewer) {
    log.silly('no viewer, sending empty list')
    return []
  }

  const user = await viewer.user()
  const sessions = await prisma.sessions({
    'where': {
      'user': {
        'id': user.id,
      },
    },
  })

  return sessions
}
