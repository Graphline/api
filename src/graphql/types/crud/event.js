export const name = 'Event'
export const query = 'event'

export const root = (parent, {where,}, {prisma,}) => {
  return prisma.event(where)
}
