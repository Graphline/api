import log from 'chalk-console'
import signals from 'lib/express/signal-handler'
import express from 'express'
import http from 'http'
import {handler,} from '.'

let server = null

const init = async () => {
  const app = express()

  log.info(`API environment: ${app.get('env')}`)

  await handler({
    app,
    'mode': 'api',
  })

  server = http.createServer(app)

  server.listen(process.env.PORT)
  log.info(`mirror-backend started (http): ${process.env.PORT}`)
}

init().catch((error) => log.error(error.stack))

signals({
  'name':   'mirror-backend',
  'thread': process,
  cleanup () {
    if (server) {
      server.close()
    }
  },
})
