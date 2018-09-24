import schema from '~/graphql'
import MatomoApi from 'matomo-reporting-js'
import fetch from 'node-fetch'
import raven from 'raven'
import {Agent,} from 'https'

const agent = new Agent({
  'rejectUnauthorized': false,
})
const matomo = new MatomoApi({
  fetch,
  agent,
  'handler': (error) => {
    raven.captureException(error)
    /* eslint-disable-next-line no-console */
    console.error(error)
  },
}, {
  'endpoint': process.env.MATOMO_URL,
  'idSite':   parseInt(process.env.MATOMO_SITE_ID, 10),
})

export default (req, res, next) => {
  return {
    'tracing': process.env.NODE_ENV === 'development',
    'context': {
      matomo,
      req,
    },
    schema,
  }
}
