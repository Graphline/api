export default {
  'query': 'search',

  async root (root, {input,}, {User, Theme,}) {
    const {terms, limit = {
      'user':  50,
      'theme': 50,
    }, skip = {
      'user':  0,
      'theme': 0,
    },} = input

    const [themes, users,] = await Promise.all([
      Theme.find({
        '$text': {
          '$search': terms,
        },
      }, null, {
        'skip':  Math.min(skip.theme, 50),
        'limit': Math.max(limit.theme, 0),
      }),

      User.find({
        '$text': {
          '$search': terms,
        },
      }, null, {
        'skip':  Math.min(skip.user, 50),
        'limit': Math.max(limit.user, 0),
      }),
    ])

    const results = [
      ...themes,
      ...users,
    ]

    return {results,}
  },
}
