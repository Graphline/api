import matomoTransformer from 'api/lib/matomo-to-graphql'
import moment from 'moment'

export default async (root, {limit,}, {User, Theme, Rating, matomo,}) => {
  const upperLimit = 25
  const lowerLimit = 1

  if (limit > upperLimit || limit < lowerLimit) {
    throw new Error(`limit must be at most ${upperLimit} and at least ${lowerLimit}`)
  }

  const matomoStats = await matomo.query({
    'method':            'Actions.getPageUrls',
    'period':            'range',
    'date':              `${moment().subtract(1, 'months').format('YYYY-MM-DD')},today`,
    'flat':              1,
    'segment':           'pageUrl!@viewingSource;pageUrl!@edit;pageUrl=@%2Ftheme%2F',
    'filter_limit':      limit,
    'filter_sort_order': 'nb_visits',
  })

  const gets = []

  matomoStats.forEach((stat) => {
    const themeId = stat.label.substring(1).split('/')[1]

    gets.push(Theme.findOne({
      '_id': themeId,
    }).then((theme) => {
      if (!theme) {
        return null
      }

      return {
        ...theme,
        'stats': matomoTransformer(stat),
      }
    }))
  })

  const results = await Promise.all(gets)

  return results.filter(Boolean)
}
