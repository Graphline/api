export const query = 'categories'

export const root = (parent, data, {prisma,}) => {
  return prisma.categories(data)
}
