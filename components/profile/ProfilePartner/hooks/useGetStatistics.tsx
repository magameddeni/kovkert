import $api from '@/components/Http/axios'
import { useQuery } from '@tanstack/react-query'
import { useMessage } from 'hooks'
import moment from 'moment'
import { transformDataForPartners } from 'utils/transformDataForPartners'

interface IUseGetStatistics {
  programId: string
  startDate?: string
  endDate?: string
}

export const useGetStatistics = ({
  programId,
  startDate = moment().subtract(7, 'days').format('YYYY-MM-DD'),
  endDate = moment().format('YYYY-MM-DD')
}: IUseGetStatistics) => {
  const {
    data: statistics = [],
    isError,
    isLoading
  } = useQuery({
    queryKey: ['getStatistics', startDate, endDate],
    queryFn: async () => {
      const adjustedEndDate = moment(endDate).add(1, 'days').format('YYYY-MM-DD')
      const { data, status } = await $api.get(
        `/api/affiliate/links/statistics/partner?programId=${programId}&startDate=${startDate}&endDate=${adjustedEndDate}`
      )
      if (status !== 200) return useMessage('Ошибка получения статики!', 'error')
      return data || []
    },
    retry: 2
  })

  return {
    statistics: transformDataForPartners({ formattedStatistics: statistics }),
    isError,
    isLoading
  }
}
