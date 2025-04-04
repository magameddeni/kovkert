export const userStateQueries: Record<string, boolean> = {
  view: true,
  joinProducts: true,
  categoryName: true
}

export const notQueryKeysForRequest: Record<string, boolean> = {
  ...userStateQueries,
  id: true,
  slug: true,
  category: true
}

export const notTriggerPageQueries: Record<string, boolean> = {
  ...notQueryKeysForRequest,
  page: true,
  limit: true
}

export const LIMIT_ITEMS_ON_PAGE = 20

export const baseQuery = {
  limit: LIMIT_ITEMS_ON_PAGE.toString()
}
