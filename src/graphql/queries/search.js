import raven from 'raven'
import matomoTransformer from 'api/lib/matomo-to-graphql'
import moment from 'moment'

export default async (root, {terms, limit = 10, skip = 0,}, {Theme, User, matomo,}, {fieldNodes,}) => {
  if (limit > 25 || limit < 1) {
    throw new Error(`limit must be at least 1 and at most 25, got ${limit}`)
  }

  try {
    const themeResults = await Theme.find({
      '$text': {
        '$search': terms,
      },
    }, {
      'populate': true,
      'sort':     '-score',
      limit,
      skip,
    })
    const userResults = await User.find({
      '$text': {
        '$search': terms,
      },
    }, {
      'populate': true,
      'sort':     '-score',
      limit,
      skip,
    })

    if (JSON.stringify(fieldNodes).includes('stats')) {
      const gets = []

      themeResults.forEach((theme) => {
        gets.push(matomo.query({
          'method':  'Actions.getPageUrl',
          'pageUrl': `/theme/${theme._id}`,
          'period':  'range',
          'date':    `${moment().subtract(1, 'months').format('YYYY-MM-DD')},today`,
          'flat':    1,
          'segment': 'pageUrl!@viewingSource;pageUrl!@edit;pageUrl=@%2Ftheme%2F',
        }).then((stats) => {
          return {
            ...theme,
            'stats': matomoTransformer(stats),
          }
        }))
      })

      return {
        'users':  userResults,
        'themes': await Promise.all(gets),
      }
    }

    return {
      'users':  userResults,
      'themes': themeResults,
    }
  } catch (error) {
    raven.captureException(error)
  }
}
