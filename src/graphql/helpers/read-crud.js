import assert from 'assert'
import {log,} from 'lib/logger'

export const reader = async ({
  method,
  context,
  where,
  requiredPermissions,
}) => {
  log.silly('checking crud reader arguments')

  assert(method, '"method" must be provided to crud reader')
  assert(context, '"context" must be provided to crud reader')
  assert(where, '"where" must be provided to crud reader')
  assert(requiredPermissions, '"requiredPermissions" must be provided to crud reader')
  assert(
    requiredPermissions.own && requiredPermissions.other,
    '"requiredPermissions.own" and "requiredPermissions.other" must be provided to crud reader'
  )

  log.debug(`getting ${method} from Prisma`)
  const {prisma, viewer,} = context
  const item = await prisma[method](where)
  const {own, other,} = requiredPermissions

  if (!item) {
    log.silly('item not found or is falsy')
    return null
  }

  // If the item is trashed and we're not logged in, it's as good as deleted
  if (item.trashed && !viewer) {
    log.silly('item is trashed and there\'s no viewer')
    return null
  }

  // At this point, we are either
  //  - Not logged in and the item is published
  //  - The item is trashed and we are logged in
  //  - The item is not trashed and we are logged in

  if (viewer && item.trashed) {
    log.silly('viewer exists, checking user permissions')

    // If we're logged in, that means the item is trashed so we need to check
    // for permission
    const owns = await viewer.owns(item, method)
    const permissions = await viewer.permissions()

    const canReadOwn = owns && permissions.includes(own)
    const canReadOther = !owns && permissions.includes(other)

    log.silly(`owns: ${owns}, canReadOwn: ${canReadOwn}, canReadOther: ${canReadOther}`)

    if (!canReadOwn || !canReadOther) {
      return null
    }
  }

  log.debug(`checks complete, returning ${method}`)

  return item
}
