import {ForbiddenError,} from 'apollo-server-express'
import {log,} from 'lib/logger'

export const name = 'deleteSession'
export const mutate = async (root, {data,}, {prisma, viewer, token,}) => {
  log.debug('deleting session')

  if (!viewer) {
    log.silly('no viewer, sending ForbiddenError')
    throw new ForbiddenError('Authentication required')
  }

  let result = false
  const permissions = await viewer.permissions()

  if (!data) {
    /*
     * If no input is provided, we need to delete the current session
     * of the current user
     */

    result = await prisma.deleteSession({token,})
  } else {
    /*
     * If data is provided, that means that the current user wants to delete a
     * session that's in their possession (e.g. A login from another device)
     *
     * We need to check if the session they want to delete is actually theirs
     */

    const user = await viewer.user()
    const ownedSessions = await prisma.sessions({
      'where': {
        'user': {
          'id': user.id,
        },
      },
    })

    const owns = ownedSessions.some((session) => session.id === data.id)

    if (!owns || !permissions.includes('DELETE_SESSION_OWN')) {
      throw new ForbiddenError('Permission denied')
    }

    result = await prisma.deleteSession({
      'id': data.id,
    })
  }

  return result
}
