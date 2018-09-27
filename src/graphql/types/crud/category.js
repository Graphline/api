import {fields as crud,} from '../interfaces/crud'
import {fields as routable,} from '../interfaces/routable'

export const fields = {
  ...crud,
  ...routable,
}

export const name = 'Category'
export const query = 'category'

export const root = (parent, {where,}, {prisma,}) => {
  return prisma.category(where)
}
