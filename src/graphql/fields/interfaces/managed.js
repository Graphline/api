const map = {
  'users':    'User',
  'themes':   'Theme',
  'sessions': 'Session',
  'ratings':  'Rating',
}

export default {
  'name': 'Managed',

  'Managed': {
    __resolveType (root) {
      return map[root.collection.name]
    },
  },
}
