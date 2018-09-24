import moment from 'moment'
import matomoTransformer from 'api/lib/matomo-to-graphql'

export default {
  'name':  'Theme',
  'query': 'theme',

  root (root, {id,}, {Theme,}) {
    return Theme.findById(id)
  },

  'Theme': {
    createdBy ({createdBy,}, data, {User,}) {
      return User.findById(createdBy)
    },

    updatedBy ({updatedBy,}, data, {User,}) {
      return User.findById(updatedBy)
    },

    screenshots ({screenshots,}) {
      return screenshots.map((item) => item.url)
    },

    async rating ({id,}, data, {Rating,}) {
      const ratings = await Rating.find({
        'theme': id,
      })

      const reducer = (acc, curr) => {
        const result = acc + curr

        return result
      }

      let value = 0

      if (ratings.length !== 0) {
        value = ratings.map((item) => item.value).reduce(reducer)
      }

      return {
        value,
        'count': ratings.length,
      }
    },

    async stats ({id,}, data, {matomo,}) {
      const stats = await matomo.query({
        'method':  'Actions.getPageUrl',
        'pageUrl': `/theme/${id}`,
        'period':  'range',
        'date':    `${moment().subtract(1, 'months').format('YYYY-MM-DD')},today`,
        'flat':    1,
        'segment': 'pageUrl!@viewingSource;pageUrl!@edit;pageUrl=@%2Ftheme%2F',
      })

      return matomoTransformer(stats)
    },

    // DEPRECATED:
    title ({display, title,}, data, {User,}) {
      return display || title
    },

    user ({createdBy, user,}, data, {User,}) {
      return User.findById(createdBy || user)
    },

    lastUpdate ({updatedAt, lastUpdate,}) {
      return updatedAt || lastUpdate
    },
  },
}
