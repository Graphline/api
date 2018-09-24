import matomoTransformer from 'api/lib/matomo-to-graphql'
import moment from 'moment'

export default async (root, {limit,}, {User, Theme, Rating, matomo,}, {fieldNodes,}) => {
  const upperLimit = 25
  const lowerLimit = 1

  if (limit > upperLimit || limit < lowerLimit) {
    throw new Error(`limit must be at most ${upperLimit} and at least ${lowerLimit}`)
  }

  let result = null

  try {
    result = await Theme.find({}, {
      limit,
      'populate': true,
      'sort':     '-createdAt',
    })
  } catch (error) {
    result = []
  }

  if (!result || result.length === 0) {
    throw new Error('no-such-theme')
  }

  if (JSON.stringify(fieldNodes).includes('stats')) {
    const gets = []

    result.forEach((theme) => {
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

    return Promise.all(gets)
  }

  return result
}
