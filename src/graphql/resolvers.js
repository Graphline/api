import {
  DateTime,
  URL,
  EmailAddress,
} from '@okgrow/graphql-scalars'

import types from './types/**/*.js'
import mutations from './mutations/**/*.js'
import subscriptions from './subscriptions/**/*.js'

const Fields = {}
const Query = {}
const Mutation = {}
const Subscription = {}

types.forEach((type) => {
  const {
    name,
    query,
    root,
    fields,
  } = type

  if (name) {
    Fields[name] = {}
  }

  if (query && root) {
    Query[query] = root
  }

  if (name && fields) {
    Object.keys(fields).forEach((field) => {
      Fields[name][field] = fields[field]
    })
  }

  if (name && type.resolvers) {
    Object.keys(type.resolvers).forEach((field) => {
      Fields[name][field] = type.resolvers[field]
    })
  }
})

mutations.forEach((item) => {
  const {name, mutate,} = item

  Mutation[name] = mutate
})

subscriptions.forEach((item) => {
  const {subscription,} = item

  Subscription[subscription] = item.subscribe
})

export default {
  DateTime,
  URL,
  EmailAddress,

  ...Fields,
  Query,
  Mutation,
  Subscription,
}
