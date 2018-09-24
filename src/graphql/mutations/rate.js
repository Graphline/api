const resolver = async (root, {input,}, {Session, Theme, Rating, User, token, viewer,}) => {
  const {theme, value,} = input
  const foundTheme = await Theme.findById(theme)

  // Sanity checks
  if (!foundTheme) {
    throw new Error('no-such-theme')
  }

  if (foundTheme.createdBy.equals(viewer.id)) {
    throw new Error('cannot-rate-own-theme')
  }

  // Load the existing rating object
  let existing = await Rating.findOne({
    theme,
    'user': viewer.id,
  })

  if (existing) {
    // If we found an existing rating, update it
    existing.updatedAt = new Date()
    existing.updatedBy = viewer.id
    existing.value = value
    existing.theme = theme
  } else {
    // Otherwise, create a new one
    existing = new Rating({
      'createdAt': new Date(),
      'updatedAt': new Date(),
      'createdBy': viewer.id,
      'updatedBy': viewer.id,
      'display':   'A Rating',
      theme,
      value,
    })
  }

  return existing.save()
}

export default {
  'name': 'rate',

  resolver,
}
