import {reader,} from '~/graphql/helpers/read-crud'
import {fields as crud,} from '~/graphql/types/interfaces/crud'

export const fields = crud('entry')

export const name = 'Entry'
export const query = 'entry'

export const root = async (parent, {where,}, context) => reader({
  'method': 'entry',
  context,
  where,

  'requiredPermissions': {
    'own':   'READ_ENTRY_OWN',
    'other': 'READ_ENTRY_OTHER',
  },
})
