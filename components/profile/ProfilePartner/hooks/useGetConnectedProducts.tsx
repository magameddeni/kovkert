import { useQuery } from '@tanstack/react-query'
import { useMessage, useQueryParams } from 'hooks'
import { SearchQuery } from '@/components/category/model'
import { getQueryWithoutCurrentKeys, replaceSeparatorInSearchParams } from '@/components/category/utils'
import $api from '@/components/Http/axios'

interface UseGetConnectedProductsProps {
  onSuccess?: (num: number) => void
  initQuery?: SearchQuery
  enabled?: boolean
}

export const useGetConnectedProducts = ({
  onSuccess,
  initQuery = {},
  enabled = true
}: UseGetConnectedProductsProps) => {
  const { query } = useQueryParams()

  const correctQuery = getQueryWithoutCurrentKeys(query)

  const {
    data: mainPrograms = [],
    isError: isMainProgramsError,
    isLoading: isMainProgramsLoading,
    refetch
  } = useQuery({
    queryKey: ['getMainPrograms', correctQuery.filter, correctQuery.text],
    queryFn: async () => {
      const { data, status } = await $api.get(
        `/api/affiliate/links?${replaceSeparatorInSearchParams(new URLSearchParams(correctQuery as unknown as string).size ? correctQuery : (initQuery as SearchQuery))}`
      )
      if (status !== 200) return useMessage('Ошибка получения программ!', 'error')
      onSuccess?.(data?.totalCount || 0)
      return data?.links || []
    },
    retry: 2,
    enabled
  })

  return {
    programs: mainPrograms,
    isError: isMainProgramsError,
    isLoading: isMainProgramsLoading,
    refetch
  }
}
