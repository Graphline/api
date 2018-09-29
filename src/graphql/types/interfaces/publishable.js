export const name = 'Publishable'

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
  publishedBy ({publishedBy,}, data, {prisma,}) {
    return prisma.user({
      'id': publishedBy,
    })
  },
})
