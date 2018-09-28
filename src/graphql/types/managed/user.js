import {fields as crud,} from '../interfaces/managed'

export const name = 'User'
export const query = 'user'

export const root = (parent, {where,}, {prisma,}) => {
  return prisma.user(where)
}

export const fields = {
  ...crud,

  async avatarUrl ({id,}, {where,}, {prisma,}) {
    return 'http://placeholder.local/avatar.jpg'
  },

  roles ({id,}, data, {prisma,}) {
    return prisma.roles({
      'where': {
        'users_some': {
          id,
        },
      },
    })
  },

  createdEntries ({id,}, data, {prisma,}) {
    return prisma.entries({
      'where': {
        'createdBy': {
          id,
        },
      },
    })
  },

  updatedEntries ({id,}, data, {prisma,}) {
    return prisma.entries({
      'where': {
        'updatedBy': {
          id,
        },
      },
    })
  },

  publishedEntries ({id,}, data, {prisma,}) {
    return prisma.entries({
      'where': {
        'publishedBy': {
          id,
        },
      },
    })
  },
}
