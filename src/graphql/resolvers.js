import {
  DateTime,
} from '@okgrow/graphql-scalars'

import fields from './fields/**/*.js'
import mutations from './mutations/**/*.js'
import subscriptions from './subscriptions/**/*.js'

const Fields = {}
const Query = {}
const Mutation = {}
const Subscription = {}

fields.forEach((field) => {
  const {name,} = field.default

  if (name) {
    Fields[name] = {}
  }

  if (field.default.query) {
    Query[field.default.query] = field.default.root
  }

  if (field.default[name]) {
    Object.keys(field.default[name]).forEach((resolver) => {
      Fields[name][resolver] = field.default[name][resolver]
    })
  }
})

mutations.forEach((item) => {
  const {mutation,} = item.default

  Mutation[mutation] = item.default.run
})

subscriptions.forEach((item) => {
  const {subscription,} = item.default

  Subscription[subscription] = item.default.subscribe
})

export default {
  DateTime,

  ...Fields,
  Query,
  Mutation,
  Subscription,
}
