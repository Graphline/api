export {fields,} from '../interfaces/crud'

export const name = 'Permission'
export const query = 'permission'

export const root = (parent, {where,}, {prisma,}) => {
  return prisma.permission(where)
}
