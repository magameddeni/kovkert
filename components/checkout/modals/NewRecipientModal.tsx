import React, { useState } from 'react'
import cx from 'classnames'
import { Controller, useForm } from 'react-hook-form'
import { useAppSelector } from '@/redux/hook'
import { AppState } from '@/redux/store'
import { TUserRecipient } from '@/models'
import { useMessage } from '@/hooks'
import { Button, Input, Text } from '@/components/UI'
import $api from '@/components/Http/axios'
import s from './checkout-modals.module.scss'

type TFormData = Omit<TUserRecipient, '_id'>

interface INewRecipientModalModalProps {
  onSuccessNewRecipient: (userId: string) => void
  prefill?: boolean
}

const NewRecipientModal = ({ onSuccessNewRecipient, prefill }: INewRecipientModalModalProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { data: authData } = useAppSelector(({ beru }: AppState) => beru.user)

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<TFormData>({
    defaultValues: {
      phone: prefill && authData?.phoneNumber ? authData.phoneNumber : ''
    }
  })

  const onSubmit = async (data: TFormData) => {
    try {
      setIsLoading(true)
      if (!data.email) delete data.email

      const response = await $api.post('/api/v1.0/users/recipients', { ...data, phone: data.phone.replace(/ /g, '') })
      const responseData: TUserRecipient = response.data
      onSuccessNewRecipient(responseData._id)
    } catch (err: any) {
      if (err?.response?.data?.error === 'Ошибка валидации данных!') {
        err.response.data.errors.forEach((v: any) => useMessage(`Ошибка в поле ${v.param}`, 'error'))
      } else {
        console.error(err)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cx(s.modal, s.new)}>
      <Text as='h3' align='center'>
        Новый получатель
      </Text>
      <form onSubmit={handleSubmit(onSubmit)} className='offset-top-40'>
        <Controller
          name='firstName'
          control={control}
          rules={{ required: { value: true, message: 'Обязательное поле' } }}
          render={({ field: { value, ...rest } }) => (
            <Input view='base' label='Имя' value={value ?? ''} errors={errors} fluid required {...rest} />
          )}
        />
        <Controller
          name='lastName'
          control={control}
          render={({ field: { value, ...rest } }) => (
            <Input
              view='base'
              label='Фамилия'
              classNameInputWrapper='offset-top-8'
              value={value ?? ''}
              errors={errors}
              fluid
              {...rest}
            />
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
              value={value ?? ''}
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
          render={({ field: { value, ...rest } }) => (
            <Input
              type='email'
              view='base'
              label='Электронная почта'
              classNameInputWrapper='offset-top-8'
              value={value ?? ''}
              errors={errors}
              fluid
              {...rest}
            />
          )}
        />
        <Button type='submit' className={s.modal__button} disabled={isLoading} fluid>
          Сохранить
        </Button>
      </form>
    </div>
  )
}

export default NewRecipientModal
