export default {
  'name': 'Rating',

  'Rating': {
    createdBy ({createdBy,}, data, {User,}) {
      return User.findById(createdBy)
    },

    updatedBy ({updatedBy,}, data, {User,}) {
      return User.findById(updatedBy)
    },

    theme ({theme,}, data, {Theme,}) {
      return Theme.findById(theme)
    },
  },
}
