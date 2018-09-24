export default {
  'query': 'viewer',

  async root (root, data, {viewer,}) {
    return viewer
  },
}
