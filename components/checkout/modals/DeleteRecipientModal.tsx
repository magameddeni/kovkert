import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { TUserRecipient } from '@/models'
import { useMessage } from '@/hooks'
import { Button, Text } from '@/components/UI'
import $api from '@/components/Http/axios'
import s from './checkout-modals.module.scss'

interface IDeleteRecipientProps {
  recipient: TUserRecipient
  closeModal: VoidFunction
  onSuccessRemoveRecipient: (useId: string) => void
}

const DeleteRecipient: React.FC<IDeleteRecipientProps> = ({ recipient, closeModal, onSuccessRemoveRecipient }) => {
  const { mutate } = useMutation({
    mutationFn: async () => {
      const { data, status } = await $api.delete(`/api/v1.0/users/recipients/${recipient._id}`)

      if (status === 200) return data

      return useMessage(data?.error ?? 'Ошибка удаления получателя!', 'error')
    },
    onSuccess: () => onSuccessRemoveRecipient(recipient._id)
  })

  return (
    <div className={s.delete}>
      <Text as='h3'>Удаление получателя</Text>
      <div className={s.delete__recipient}>
        <Text as='div' className={s.delete__recipient_name}>
          {recipient.lastName} {recipient.firstName}
        </Text>
        <Text as='div' className={s.delete__recipient_phone}>
          {recipient.phone}
        </Text>
        <Text as='div' className={s.delete__recipient_email}>
          {recipient.email}
        </Text>
      </div>
      <div className={s.delete__buttons}>
        <Button onClick={closeModal} color='extra-light-blue' view='link'>
          Отмена
        </Button>
        <Button onClick={mutate}>Удалить</Button>
      </div>
    </div>
  )
}

export default DeleteRecipient
