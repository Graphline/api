export const query = 'slugs'

export const root = (parent, data, {prisma,}) => {
  return prisma.slugs(data)
}
