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

const exceptionHandlerArray = [
  new transports.Console(),

  new transports.File({
    'filename': 'logs/exceptions.log',
  }),
]

const log = createLogger({
  'format': process.env.LOG_FORMAT
    ? format[process.env.LOG_FORMAT]()
    : format.simple(),

  'transports':  transportArray,
  'level':       process.env.LOG_LEVEL,
  'exitOnError': true,

  'exceptionHandlers': exceptionHandlerArray,
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
