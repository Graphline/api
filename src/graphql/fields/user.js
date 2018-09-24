import moment from 'moment'
import matomoTransformer from 'api/lib/matomo-to-graphql'
import gravatar from 'gravatar-url'

export default {
  'name':  'User',
  'query': 'user',

  root (root, {id,}, {User,}) {
    return User.findById(id)
  },

  'User': {
    createdBy ({createdBy,}, data, {User,}) {
      return User.findById(createdBy)
    },

    updatedBy ({updatedBy,}, data, {User,}) {
      return User.findById(updatedBy)
    },

    themes ({id,}, data, {Theme,}) {
      return Theme.find({
        'createdBy': id,
      })
    },

    avatarUrl ({email,}, {size = 256, 'default': def = 'mp', rating = 'g',}) {
      return gravatar(email, {size, 'default': def, rating,})
    },

    async stats ({id,}, data, {matomo,}) {
      const stats = await matomo.query({
        'method':  'Actions.getPageUrl',
        'pageUrl': `/profile/${id}`,
        'period':  'range',
        'date':    `${moment().subtract(1, 'months').format('YYYY-MM-DD')},today`,
        'flat':    1,
        'segment': 'pageUrl!@edit',
      })

      return matomoTransformer(stats)
    },

    // DEPRECATED:
    username ({display, username,}) {
      return display.toLowerCase() || username
    },

    displayname ({display, displayname,}) {
      return display || displayname
    },

    smallAvatarUrl ({email,}) {
      return gravatar(email, {
        'size': 128,
      })
    },
  },
}
