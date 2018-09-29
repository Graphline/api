import {reader,} from '~/graphql/helpers/read-crud'
import {fields as crud,} from '~/graphql/types/interfaces/crud'

export const fields = crud('role')

export const name = 'Role'
export const query = 'role'

export const root = (parent, {where,}, context) => reader({
  'method': 'role',
  context,
  where,

  'requiredPermissions': {
    'own':   'READ_ROLE_OWN',
    'other': 'READ_ROLE_OTHER',
  },
})
