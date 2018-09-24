import {pick,} from 'lodash'

export default {
  'query': 'themeList',

  async root (root, {input,}, {Theme, Rating,}) {
    const {sort = {}, limit = 50, skip = 0,} = input
    const themes = await Theme.find({}, null, {
      'limit': Math.min(limit, 50),
      'skip':  Math.max(skip, 0),
    }).sort(pick(sort, 'createdAt', 'updatedAt', 'display'))

    if (typeof sort.ratings === 'number') {
      const ratings = await Rating.find({
        'theme': {
          '$in': themes,
        },
      })

      themes.sort((a, b) => {
        const aRatingList = ratings
        .filter((item) => item.theme.toString() === a.id)

        const aRatings = aRatingList
        .reduce((acc, curr) => {
          return acc + curr.value
        }, 0)

        const bRatingList = ratings
        .filter((item) => item.theme.toString() === b.id)

        const bRatings = bRatingList
        .reduce((acc, curr) => {
          return acc + curr.value
        }, 0)

        if (aRatings * aRatingList.length > bRatings * bRatingList.length) {
          return 0 + sort.ratings
        }

        return 0 - sort.ratings
      })
    }

    return themes
  },
}
