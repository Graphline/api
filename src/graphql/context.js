import schema from '~/graphql'
import MatomoApi from 'matomo-reporting-js'
import fetch from 'node-fetch'
import {Agent,} from 'https'
import client from '@/prisma/client'

import {log,} from 'lib/logger'

const agent = new Agent({
  'rejectUnauthorized': process.env.MATOMO_ACCEPT_INVALID_TLS === 'false',
})

const matomo = new MatomoApi({
  fetch,
  agent,
  handler (error) {
    log.warn(error.stack)
  },
}, {
  'endpoint': process.env.MATOMO_URL,
  'idSite':   parseInt(process.env.MATOMO_SITE_ID, 10),
})

export default (req, res, next) => ({
  'tracing': process.env.NODE_ENV === 'development',
  'context': {
    matomo,
    req,
    client,
  },
  schema,
})
