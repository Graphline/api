export {fields,} from '../interfaces/crud'

export const name = 'Role'
export const query = 'role'

export const root = (parent, {where,}, {prisma,}) => {
  return prisma.role(where)
}
