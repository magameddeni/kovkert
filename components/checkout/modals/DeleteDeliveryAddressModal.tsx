import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { TUserAddress } from '@/models'
import { useMessage } from '@/hooks'
import { Button, Text } from '@/components/UI'
import $api from '@/components/Http/axios'
import s from './checkout-modals.module.scss'

interface IDeleteDeliveryAddressModalProps {
  data: TUserAddress | null
  onCloseModal: VoidFunction
  onSuccessRemove: VoidFunction
}

const DeleteDeliveryAddressModal: React.FC<IDeleteDeliveryAddressModalProps> = ({
  data,
  onCloseModal,
  onSuccessRemove
}) => {
  const { mutate } = useMutation({
    mutationFn: async () => {
      if (data?._id) {
        const { data: responseData, status } = await $api.delete(`/api/v1.0/users/addresses/${data._id}`)

        if (status === 200) return responseData

        return useMessage(responseData?.error ?? 'Ошибка удаления адреса!', 'error')
      }
    },
    onSuccess: () => onSuccessRemove()
  })

  if (!data?._id) return null

  return (
    <div className={s.delete}>
      <Text as='h3'>Удаление адреса</Text>
      <div className={s.delete__recipient}>
        <Text as='div' className={s.delete__recipient_name}>
          {data.fullname}
        </Text>
      </div>
      <div className={s.delete__buttons}>
        <Button onClick={onCloseModal} color='extra-light-blue' view='link'>
          Отмена
        </Button>
        <Button onClick={mutate}>Удалить</Button>
      </div>
    </div>
  )
}

export default DeleteDeliveryAddressModal
