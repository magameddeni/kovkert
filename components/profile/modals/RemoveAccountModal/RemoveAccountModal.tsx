import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useLogoutUserMutation } from '@/redux/auth/authApi'
import { routes } from '@/constants'
import { useMessage } from '@/hooks'
import { Button, ButtonGroup, Text } from '@/components/UI'
import $api from '@/components/Http/axios'
import s from './remove-account-modal.module.scss'

interface IRemoveAccountModalProps {
  onClose: VoidFunction
}

const RemoveAccountModal = ({ onClose }: IRemoveAccountModalProps) => {
  const { push } = useRouter()

  const [logout] = useLogoutUserMutation()

  const { mutate } = useMutation({
    mutationFn: async () => {
      const { data, status } = await $api.delete('/api/v1.0/users/deleteMe')

      if (status === 200) return data

      return useMessage(data?.error ?? 'Ошибка удаления пользователя!', 'error')
    },
    onSuccess: () => {
      onClose()
      logout().unwrap()
      void push(routes.MAIN)
    }
  })

  return (
    <div className={s['remove-account']}>
      <Text as='h3' align='center'>
        Удаление аккаунта
      </Text>
      <Text as='p' size='lg' align='center' className='offset-top-32 offset-lg-top-40'>
        Вы уверены что хотите удалить аккаунт?
      </Text>
      <ButtonGroup className='offset-top-40' gap={4}>
        <Button color='extra-light-blue' onClick={onClose} fluid>
          Отмена
        </Button>
        <Button onClick={mutate} fluid>
          Да, удалить
        </Button>
      </ButtonGroup>
    </div>
  )
}

export default RemoveAccountModal
