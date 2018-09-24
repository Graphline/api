export default {
  'name': 'deleteTheme',

  async resolver (root, {id,}, {Session, Theme, token, viewer,}) {
    const theme = await Theme.findById(id)
    let userOwnsTheme = false

    if (theme) {
      userOwnsTheme = theme.createdBy.equals(viewer.id)
    }

    if (!theme || !userOwnsTheme) {
      return false
    }

    return theme.remove()
  },
}
