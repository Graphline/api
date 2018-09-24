const resolver = async (root, {input,}, {Session, Theme, User, Rating, Option, viewer,}) => {
  if (!viewer) {
    throw new Error('autorisation-required')
  }

  const user = viewer

  if (!user.emailVerified) {
    throw new Error('email-not-verified')
  }

  const {display, description, content, version, id, screenshots, variables, license,} = input
  let theme = null

  theme = await Theme.findById(id)

  if (theme) {
    const userOwnsTheme = theme.createdBy.equals(user.id)

    if (!userOwnsTheme) {
      throw new Error('autorisation-required')
    }

    theme.updatedAt = new Date()
    theme.updatedBy = user.id
    theme.display = display
    theme.description = description
    theme.version = version
    theme.content = content
    theme.screenshots = screenshots
    theme.variables = variables
    theme.license = license

    user.lastSeenReason = 'updating a theme'
  } else {
    theme = new Theme({
      'createdAt': new Date(),
      'updatedAt': new Date(),
      'createdBy': user.id,
      'updatedBy': user.id,
      content,
      description,
      variables,
      display,
      version,
      screenshots,
      license,
    })

    user.lastSeenReason = 'uploading a new theme'
  }

  const saved = await theme.save()

  user.lastSeenAt = new Date()
  await user.save()

  return saved
}

export default {
  'name': 'theme',

  resolver,
}
