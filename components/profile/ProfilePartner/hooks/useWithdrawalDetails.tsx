import $api from '@/components/Http/axios'
import { useQuery } from '@tanstack/react-query'
import { useMessage } from 'hooks'

interface IUseWithdrawalDetails {
  withdrawalId: string
}

export const useWithdrawalDetails = ({ withdrawalId }: IUseWithdrawalDetails) => {
  const {
    data: withdrawalData = [],
    isError,
    isLoading
  } = useQuery({
    queryKey: ['getStatistics', withdrawalId],
    queryFn: async () => {
      const { data, status } = await $api.get(`/api/affiliate/withdrawals/withdrawalId/${withdrawalId}`)
      if (status !== 200) return useMessage('Ошибка получения информацию о выплате!', 'error')
      return data || []
    },
    retry: 2
  })

  return {
    withdrawalData,
    isError,
    isLoading
  }
}
