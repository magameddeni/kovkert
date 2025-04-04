import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { getQueryWithoutCurrentKeys } from '@/components/category/utils'
import { userStateQueries } from '@/components/category/const'

export const useQueryParams = () => {
  const router = useRouter()

  const filteredQuery = useMemo(() => getQueryWithoutCurrentKeys(router.query, userStateQueries), [router.query])

  const setQuery = (query: { [key: string]: string }) =>
    router.replace({ query: { ...router.query, ...query } }, undefined, { shallow: true })

  const deleteQuery = (key: string) => {
    if (!key) return

    delete router.query[key]
    return router.replace({ query: { ...router.query } }, undefined, { shallow: true })
  }

  return { query: filteredQuery, fullQuery: router.query, setQuery, deleteQuery }
}
