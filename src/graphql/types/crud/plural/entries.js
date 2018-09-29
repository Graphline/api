export const query = 'entries'

export const root = (parent, data, {prisma,}) => {
  return prisma.entries(data)
}
