import fetch from 'node-fetch'
import {Agent,} from 'https'
import MatomoApi from 'matomo-reporting-js'

import {prisma,} from '@/prisma/client'
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

export default ({req,}) => {
  return {
    matomo,
    prisma,
    'headers': req.headers,
    'cookies': req.cookies,
  }
}
