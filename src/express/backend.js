import schema from '~/graphql'
import MatomoApi from 'matomo-reporting-js'
import fetch from 'node-fetch'
import raven from 'raven'
import {Agent,} from 'https'

// import pify from 'pify'
// import staticConfig from 'lib/config'
// import jwt from 'jsonwebtoken'

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
  'endpoint': 'https://pwk.decentm.com/index.php',
  'idSite':   10,
})

// const getViewer = async (token, {User,}) => {
//   const config = await staticConfig()
//   let viewer = null
//
//   if (!token) {
//     return null
//   }
//
//   try {
//     const decoded = await pify(jwt.verify)(token, config.get('keypair.clientprivate'))
//
//     viewer = User.findById(decoded.userId)
//   } catch (error) {
//     return null
//   }
//
//   return viewer
// }

export default async (req, res, next) => {
  const token = req.headers.authorization
  // const viewer = await getViewer(token, model)

  return {
    'tracing': process.env.NODE_ENV === 'development',
    'context': {
      token,
      matomo,
      // viewer,
      req,
      // ...model,
    },
    schema,
  }
}
