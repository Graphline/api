import express from 'express'
import http from 'http'
import routes from '~/express/routes'
import cors from 'lib/cors'
import {log,} from 'lib/logger'
import {check,} from 'lib/environment-checks'

check()

let server = null

const launch = (app) => new Promise((resolve, reject) => {
  server.listen(process.env.PORT, (error) => {
    if (error) {
      return reject(error)
    }

    log.debug(`express server listening on port ${process.env.PORT}`)
    return resolve()
  })
})

const init = async () => {
  log.info('beginning startup')

  const app = express()

  server = http.createServer(app)
  log.debug('attaching routes')
  await cors({app, server,})
  await routes({app, server,})

  log.debug('launching server')
  await launch()

  log.info('startup complete')
}

init().catch((error) => {
  log.error(error.stack)
  log.info('shutting down')

  if (server) {
    server.close()
  }

  log.info('shutdown complete')
  throw error
})

process.on('unhandledRejection', (error) => {
  throw error
})
