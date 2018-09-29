export const name = 'Crud'

export const resolvers = {
  __resolveType ({id,}, data, {prisma,}, info) {
    const method = info.path.prev.key

    return prisma[method]({id,}).$fragment(`
      fragment Typename on Crud {
        __typename
      }
    `)
  },
}

export const fields = (method) => ({
  createdBy ({id,}, data, {prisma,}, info) {
    return prisma[method]({id,}).createdBy()
  },

  updatedBy ({id,}, data, {prisma,}, info) {
    return prisma[method]({id,}).updatedBy()
  },
})
