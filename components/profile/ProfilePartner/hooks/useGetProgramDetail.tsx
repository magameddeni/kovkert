import { useQuery } from '@tanstack/react-query'
import { useMessage } from 'hooks'
import $api from '@/components/Http/axios'

interface IUseGetProgramDetail {
  programId: string
  affiliateLinkId: string
  shopId: string
}

export const useGetProgramDetail = ({ programId, affiliateLinkId, shopId }: IUseGetProgramDetail) => {
  const {
    data: resData,
    refetch: refetchDetails,
    isError,
    isLoading
  } = useQuery({
    queryKey: ['getProgramDetail'],
    queryFn: async () => {
      const { data, status } = await $api.get(
        `/api/affiliate/withdrawals/details/partner/shopId/${shopId}/programId/${programId}/affiliateLinkId/${affiliateLinkId}`
      )
      if (status !== 200) return useMessage('Ошибка получения деталей партнёрских ссылок программы!', 'error')
      return data
    },
    retry: 2,
    enabled: true
  })

  return {
    headerData: {
      productName: resData?.program?.name,
      productImage: resData?.program?.image?.link,
      discountForBuyer: resData?.program?.discountForBuyer,
      discountForPartner: resData?.program?.discountForPartner,
      earnings: resData?.program?.earnings,
      discountPercentage: resData?.program?.discountPercentage,
      reward: resData?.program?.reward,
      price: resData?.program?.price,
      shopId: resData?.program?.shopId,
      shortLinkCode: resData?.program?.shortLinkCode
    },
    withdrawals: resData?.withdrawals || [],
    isError,
    isLoading,
    refetchDetails
  }
}
