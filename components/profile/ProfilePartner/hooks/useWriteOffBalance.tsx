import $api from '@/components/Http/axios'
import { useMutation } from '@tanstack/react-query'
import { useMessage } from 'hooks'
import { TRestErrorType } from '../../types'

interface IFormData {
  shopId: string
  programId: string
  affiliateLink: {
    linkId: string
    amount: number
  }
}
interface IUseWriteOffBalance {
  callBackFunc: () => void
}

export const useWriteOffBalance = ({ callBackFunc }: IUseWriteOffBalance) => {
  const { mutate, isSuccess } = useMutation({
    mutationFn: async (formData: IFormData) => {
      await $api.post(`/api/affiliate/withdrawals`, formData)
    },
    onSuccess: () => {
      callBackFunc?.()
    },
    onError: ({ response }: TRestErrorType) =>
      useMessage(response?.data?.message || 'Ошибка вывода заработанных средств!', 'error')
  })

  return { mutate, isSuccess }
}
