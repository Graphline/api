const map = {
  'users':    'User',
  'themes':   'Theme',
  'sessions': 'Session',
  'ratings':  'Rating',
}

export default {
  'name': 'Node',

  'Node': {
    __resolveType (root) {
      return map[root.collection.name]
    },

    _id ({id, _id,}) {
      return id || _id
    },
  },
}
