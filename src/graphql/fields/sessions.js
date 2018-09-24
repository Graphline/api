export default {
  'name':  'Session',
  'query': 'sessions',

  root (root, data, {Session, viewer,}) {
    return Session.find({
      'createdBy': viewer.id,
    })
  },
}
