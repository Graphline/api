/* eslint-disable unicorn/no-process-exit */

import assert from 'assert'
import {log,} from 'lib/logger'

const helpers = {
  combine (...validators) {
    return ({name, value,}) => {
      log.silly(`running combined validator for ${name}`)
      validators.forEach((validator) => validator({name, value,}))
    }
  },

  boolean ({name, value,}) {
    log.silly(`running boolean validator for ${name}`)
    assert(
      value === 'true' || value === 'false',
      `${name} must be "true" or "false", it's currently "${value}"`,
    )
  },

  number ({min = -Infinity, max = Infinity,} = {}) {
    assert(typeof min === 'number')
    assert(typeof max === 'number')

    return ({name, value,}) => {
      log.silly(`running number validator for ${name}`)
      const numValue = parseInt(value, 10)

      assert(!isNaN(numValue), `${name} is not a number`)
      assert(numValue >= min, `${name}: ${numValue} is below than the minimum (${min})`)
      assert(numValue <= max, `${name}: ${numValue} is above the maximum (${max})`)
    }
  },

  string ({min = -Infinity, max = Infinity,} = {}) {
    assert(typeof min === 'number')
    assert(typeof max === 'number')

    return ({name, value,}) => {
      log.silly(`running string validator for ${name}`)
      assert(
        isNaN(parseInt(value, 10)) === true,
        `${name} must be a string, but it's a number`
      )
      assert(
        value.length >= min,
        `${name} is shorter than the minimum (${min}), it's ${value.length} characters long`
      )
      assert(
        value.length <= max,
        `${name} is longer the maximum (${max}), it's ${value.length} characters long`
      )
    }
  },

  oneOf (array) {
    return ({name, value,}) => {
      log.silly(`running oneOf validator for ${name}`)
      assert(
        array.includes(value),
        `${name} must be one of the following: ${array.join(', ')} - it's currently ${value}`
      )
    }
  },

  commaSeparated ({min = -Infinity, max = Infinity,} = {}) {
    assert(typeof min === 'number')
    assert(typeof max === 'number')

    return ({name, value,}) => {
      const arr = value.split(',')

      assert(arr.length >= min, `${name} has less items than the minimum (${min}), it has ${arr.length} values`)
      assert(arr.length <= max, `${name} has more items than the maximum (${max}), it has ${arr.length} values`)
    }
  },

  optional (helper) {
    assert(typeof helper === 'function')

    return ({name, value,}) => {
      log.silly(`running optional validator for ${name}`)
      if (value) {
        return helper({name, value,})
      }
    }
  },

  requiredBy (field, helper) {
    assert(typeof field === 'string')
    assert(typeof helper === 'function')

    return ({name, value,}) => {
      log.silly(`running requiredBy validator for ${name}`)
      if (process.env[field] || process.env[field] === 'true') {
        assert(value, `${name} must be set because ${field} is set`)
        return helper({name, value,})
      }
    }
  },
}

const vars = {
  'NODE_ENV':   helpers.oneOf(['development', 'production',]),
  'LOG_FORMAT': helpers.oneOf(['json', 'simple',]),
  'LOG_LEVEL':  helpers.oneOf(['silly', 'debug', 'info', 'warn', 'error',]),

  // Features
  'ENABLE_REGISTRATION': helpers.boolean,

  // Security
  'SESSION_EXPIRY_MINUTES': helpers.number({'min': 1,}),
  'SECRET':                 helpers.string({'min': 24,}),
  'TRUST_PROXY':            helpers.boolean,

  // Keys
  'SENTRY_DSN': helpers.optional(
    helpers.string({'min': 46,})
  ),
  'PRISMA_TOKEN': helpers.string({'min': 128, 'max': 128,}),

  // HTTP
  'PROTOCOL':  helpers.oneOf(['http', 'https',]),
  'FQDN':      helpers.string({'min': 4,}),
  'PORT':      helpers.number({'min': 9, 'max': 65535,}),
  'FRONTENDS': helpers.combine(
    helpers.string({'min': 0,}),
    helpers.commaSeparated({'min': 1,}),
  ),

  // Matomo
  'MATOMO_URL': helpers.optional(
    helpers.string({'min': 10,})
  ),
  'MATOMO_ACCEPT_INVALID_TLS': helpers.requiredBy(
    'MATOMO_URL',
    helpers.boolean,
  ),
  'MATOMO_SITE_ID': helpers.requiredBy(
    'MATOMO_URL',
    helpers.number({'min': 0,})
  ),
}

export const check = () => {
  log.info('running sanity checks against environment variables')

  try {
    Object.keys(vars).forEach((name) => {
      const value = process.env[name]
      const validate = vars[name]

      return validate({name, value,})
    })
  } catch (error) {
    log.error(error.message)

    process.exit(1)
  }
}
