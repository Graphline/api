export default {
  'name':  'Entry',
  'query': 'entry',

  root (root, {id,}, {prisma,}) {
    return prisma.entry({id,})
  },
}
