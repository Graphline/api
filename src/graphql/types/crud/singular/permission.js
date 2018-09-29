import {reader,} from '~/graphql/helpers/read-crud'
import {fields as crud,} from '~/graphql/types/interfaces/crud'

export const fields = crud('permission')

export const name = 'Permission'
export const query = 'permission'

export const root = (parent, {where,}, context) => reader({
  'method': 'permission',
  context,
  where,

  'requiredPermissions': {
    'own':   'READ_PERMISSION_OWN',
    'other': 'READ_PERMISSION_OTHER',
  },
})
