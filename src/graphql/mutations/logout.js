import mustAuthenticate from 'api/lib/enforce-session'

export default {
  'name': 'logout',

  async resolver (root, options, {Session, token,}) {
    const session = await mustAuthenticate(token, Session)

    return session.remove()
  },
}
