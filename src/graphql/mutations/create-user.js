export const name = 'createUser'
export const mutate = (root, {data,}, {prisma,}) => {
  const {display, password,} = data

  return prisma.createUser({
    display,
    password,
  })
}
