export const name = 'Routable'

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

export const fields = {
  slug ({slug,}, data, {prisma,}) {
    return prisma.slug({
      'id': slug,
    })
  },
}
