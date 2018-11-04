import {reader,} from '~/graphql/helpers/read-crud'
import {fields as crud,} from '~/graphql/types/interfaces/crud'

export const fields = {
  ...crud('slug'),

  entry ({id,}, data, {prisma,}) {
    return prisma.slug({id,}).entry()
  },
}

export const name = 'Slug'
export const query = 'slug'

export const root = (parent, {where,}, context) => reader({
  'method': 'slug',
  context,
  where,

  'requiredPermissions': {
    'own':   'READ_SLUG_OWN',
    'other': 'READ_SLUG_OTHER',
  },
})
