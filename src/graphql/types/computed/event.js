import {log,} from 'lib/logger'

export const name = 'Event'
export const query = 'event'

export const root = (parent, {where,}, {prisma,}) => {
  log.warn('UNFINISHED FUNCTION RUNNING: src/graphql/types/crud/singular/event.js')
  return prisma.event(where)
}
