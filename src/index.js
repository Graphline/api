import express from 'express'
import http from 'http'
import routes from '~/express/routes'
import cors from 'lib/cors'
import {log,} from 'lib/logger'

let server = null

const init = async () => {
  log.info('beginning startup')

  const app = express()

  await cors({app,})
  await routes({app,})

  server = http.createServer(app)
  server.listen(process.env.PORT)

  log.info('startup complete')
}

init().catch(log.error)
