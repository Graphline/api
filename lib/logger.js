import {createLogger, transports, format,} from 'winston'
import Sentry from 'winston-transport-sentry'

const transportArray = [
  new transports.Console(),

  new transports.File({
    'filename': 'logs/combined.log',
  }),
  new transports.File({
    'filename': 'logs/debug.log',
    'level':    'debug',
  }),
  new transports.File({
    'filename': 'logs/info.log',
    'level':    'info',
  }),
  new transports.File({
    'filename': 'logs/error.log',
    'level':    'error',
  }),
]

const log = createLogger({
  'format':     format.json(),
  'transports': transportArray,
})

if (process.env.SENTRY_DSN) {
  log.add(
    new Sentry({
      'level':       'warn',
      'dsn':         process.env.SENTRY_DSN,
      'patchGlobal': false,
    }),
  )
}

export {log,}
