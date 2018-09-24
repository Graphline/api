// import matomoTransformer from 'api/lib/matomo-to-graphql'
// import moment from 'moment'

export default (root, {id,}, {Theme,}) => {
  return Theme.findById(id)
}
