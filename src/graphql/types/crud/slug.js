export {fields,} from '../interfaces/crud'

export const name = 'Slug'
export const query = 'slug'

export const root = (parent, {where,}, {prisma,}) => {
  return prisma.slug(where)
}
