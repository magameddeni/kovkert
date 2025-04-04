import React from 'react'
import { TUserRecipient } from '@/models'
import { useForm, Controller } from 'react-hook-form'
import { useMessage } from '@/hooks'
import { useMutation } from '@tanstack/react-query'
import { Button, Input, Text } from '@/components/UI'
import cx from 'classnames'
import $api from '@/components/Http/axios'
import useMediaQuery from '@/components/Hooks/useMediaQuery'
import s from './checkout-modals.module.scss'

type TFormData = Omit<TUserRecipient, '_id'>

interface IEditRecipientProps {
  closeModal: VoidFunction
  recipient: TUserRecipient
  getUserData: VoidFunction
}

const EditRecipientModal: React.FC<IEditRecipientProps> = ({ recipient, closeModal, getUserData }) => {
  const isTablet = useMediaQuery('(max-width:767px)')

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: TFormData) => {
      if (!data.email) data.email = ''

      const { data: responseData, status } = await $api.patch(`/api/v1.0/users/recipients/${recipient._id}`, {
        ...data,
        phone: data.phone.replace(/ /g, '')
      })
      if (status === 200) return responseData

      useMessage(responseData?.error ?? 'Не удалось обновить данные получателя!')
      return null
    },
    onSuccess: () => {
      getUserData()
      closeModal()
    }
  })

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<TFormData>({ defaultValues: recipient })

  return (
    <div className={cx(s.edit)}>
      <Text as='h3' align={!isTablet ? 'center' : 'justify'}>
        Редактирование получателя
      </Text>
      <form onSubmit={handleSubmit((e) => mutate(e))} className='offset-top-40'>
        <Controller
          name='firstName'
          control={control}
          rules={{ required: { value: true, message: 'Не заполнено поле Имя' } }}
          render={({ field }) => <Input view='base' label='Имя' errors={errors} fluid required {...field} />}
        />
        <Controller
          name='lastName'
          control={control}
          render={({ field }) => (
            <Input view='base' label='Фамилия' classNameInputWrapper='offset-top-8' errors={errors} fluid {...field} />
          )}
        />
        <Controller
          name='phone'
          control={control}
          rules={{
            required: { value: true, message: 'Не заполнено поле Номер телефона' },
            pattern: { value: /\+\d{1}\s?\d{3}\s?\d{3}\s?\d{2}\s?\d{2}/, message: 'Неверный номер телефона' }
          }}
          render={({ field: { name, value, onChange } }) => (
            <Input
              name={name}
              type='tel'
              view='base'
              value={value}
              onChange={onChange}
              label='Номер телефона'
              classNameInputWrapper='offset-top-8'
              errors={errors}
              fluid
              required
              isActive
            />
          )}
        />
        <Controller
          name='email'
          control={control}
          render={({ field }) => (
            <Input
              type='email'
              view='base'
              label='Электронная почта'
              classNameInputWrapper='offset-top-8'
              errors={errors}
              fluid
              {...field}
            />
          )}
        />
        <div className={s.edit__buttons}>
          {isTablet && (
            <Button color='extra-light-blue' type='button' view='link' className={s.modal__button} fluid>
              Назад
            </Button>
          )}
          <Button type='submit' className={s.modal__button} disabled={isPending} fluid>
            Сохранить
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditRecipientModal
