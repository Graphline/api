export const query = 'viewer'
export const root = (parent, data, {viewer,}) => {
  if (!viewer) {
    return null
  }

  return viewer.user()
}
