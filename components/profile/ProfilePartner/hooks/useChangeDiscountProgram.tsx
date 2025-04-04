import $api from '@/components/Http/axios'
import { useMutation } from '@tanstack/react-query'
import { useMessage } from 'hooks'
import { TRestErrorType } from '../../types'

interface IFormData {
  linkId: string
  discountForBuyer: number
  discountForPartner: number
}
interface IUseChangeDiscountProgram {
  closeChangeDiscountModal: () => void
}

export const useChangeDiscountProgram = ({ closeChangeDiscountModal }: IUseChangeDiscountProgram) => {
  const { mutate } = useMutation({
    mutationFn: async (formData: IFormData) => {
      await $api.put(`/api/affiliate/links/discounts`, formData)
    },
    onSuccess: () => {
      closeChangeDiscountModal()
    },
    onError: ({ response }: TRestErrorType) =>
      useMessage(response?.data?.message || 'Ошибка изменение скидок в партнёрской ссылке!', 'error')
  })

  return { mutate }
}
