import {ObjectID,} from 'mongodb'
import matomoTransformer from 'api/lib/matomo-to-graphql'
import moment from 'moment'

export default async (root, {id,}, {User, Theme, matomo,}) => {
  const result = await Theme.find({
    'user': new ObjectID(id),
  }, {
    'populate': true,
  })

  if (!result || result.length === 0) {
    throw new Error('no-such-theme')
  }

  const gets = []

  result.forEach((theme) => {
    gets.push(matomo.query({
      'method':  'Actions.getPageUrl',
      'pageUrl': `/theme/${theme._id}`,
      'period':  'range',
      'date':    `${moment().subtract(1, 'months').format('YYYY-MM-DD')},today`,
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
