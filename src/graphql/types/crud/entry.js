export {fields,} from '../interfaces/crud'

export const name = 'Entry'
export const query = 'entry'

export const root = (parent, {id,}, {prisma,}) => {
  return prisma.entry({id,})
}
