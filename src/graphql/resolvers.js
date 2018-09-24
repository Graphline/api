import {DateTime, EmailAddress, URL,} from '@okgrow/graphql-scalars'

import fields from './fields/**/*.js'
import mutations from './mutations/**/*.js'

const Fields = {}
const Query = {}
const Mutation = {}

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

mutations.forEach((mutation) => {
  const {name,} = mutation.default

  Mutation[name] = mutation.default.resolver
})

export default {
  DateTime,
  EmailAddress,
  URL,

  ...Fields,
  Query,
  Mutation,
}
