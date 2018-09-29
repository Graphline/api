import {reader,} from '~/graphql/helpers/read-crud'

import {fields as crud,} from '~/graphql/types/interfaces/crud'
import {fields as routable,} from '~/graphql/types/interfaces/routable'

export const fields = {
  ...crud('category'),
  ...routable('category'),
}

export const name = 'Category'
export const query = 'category'

export const root = async (parent, {where,}, context) => reader({
  'method': 'category',
  context,
  where,

  'requiredPermissions': {
    'own':   'READ_CATEGORY_OWN',
    'other': 'READ_CATEGORY_OTHER',
  },
})
