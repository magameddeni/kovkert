import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { useForm } from 'react-hook-form'
import { useAppSelector } from '@/redux/hook'
import { useConfirmEmailUpdateMutation, useUpdateEmailMutation, useVerifyEmailMutation } from '@/redux/user/userApi'
import { useMessage } from '@/hooks'
import { Button, Input, Text } from '@/components/UI'
import Timer from '@/components/Timer'
import s from './edit-email-modal.module.scss'

interface IFormData {
  email: string
  phoneOtp: string
  emailOtp: string
}

enum EmailUpdateStep {
  NewEmail,
  ConfirmUpdate,
  VerifyEmail
}

type Props = {
  onClose: VoidFunction
}

const EditEmailModal = ({ onClose }: Props) => {
  const user = useAppSelector(({ beru }) => beru.user.data)
  const [timeEnd, setTimeEnd] = useState(false)
  const [updateEmailStep, setUpdateEmailStep] = useState<EmailUpdateStep>(EmailUpdateStep.NewEmail)

  const [updateEmail, { data: updateEmailData }] = useUpdateEmailMutation()
  const [confirmEmailUpdate, { data: confirmEmailUpdateData }] = useConfirmEmailUpdateMutation()
  const [verifyEmail] = useVerifyEmailMutation()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch
  } = useForm<IFormData>({ defaultValues: { phoneOtp: '', emailOtp: '', email: '' } })

  const handleEmailUpdateSubmit = () => {
    updateEmail({ email: watch('email'), phoneNumber: user?.phoneNumber as string })
      .unwrap()
      .then(() => {
        setTimeEnd(false)
        setUpdateEmailStep(EmailUpdateStep.ConfirmUpdate)
      })
      .catch((error: any) => useMessage(error.data.message, 'error'))
  }

  const handleConfirmEmailUpdateSubmit = () => {
    confirmEmailUpdate({ email: watch('email'), phoneNumber: user?.phoneNumber as string, otp: watch('phoneOtp') })
      .unwrap()
      .then(() => {
        setTimeEnd(false)
        setUpdateEmailStep(EmailUpdateStep.VerifyEmail)
      })
      .catch((error: any) => useMessage(error.data.message, 'error'))
  }

  const handleVerifyEmail = () => {
    verifyEmail({ email: watch('email'), otp: watch('emailOtp') })
      .unwrap()
      .catch((error: any) => useMessage(error.data.message, 'error'))
    onClose()
  }

  const handleBack = () => {
    handleEmailUpdateSubmit()
    setValue('phoneOtp', '')
  }

  useEffect(() => {
    if (watch('phoneOtp')?.length === 5) {
      handleConfirmEmailUpdateSubmit()
    }
  }, [watch('phoneOtp')])

  useEffect(() => {
    if (watch('emailOtp')?.length === 5) {
      handleVerifyEmail()
    }
  }, [watch('emailOtp')])

  if (updateEmailStep === EmailUpdateStep.NewEmail) {
    return (
      <div className={s.email}>
        <form onSubmit={handleSubmit(() => handleEmailUpdateSubmit())}>
          <Text family='secondary' className={s.email__title} align='center' as='div'>
            Изменение почты
          </Text>
          <Text as='div' color='gray' className='offset-top-40'>
            Введите новую почту
          </Text>
          <Input
            register={register}
            rules={{ required: { value: true, message: 'Не заполнено поле Email ' } }}
            errors={errors}
            fluid
            view='base'
            placeholder='Email'
            autoFocus
            type='email'
            classNameInputWrapper='offset-top-16'
            name='email'
          />
          <Button type='submit' className='offset-top-12' fluid>
            Получить код на телефон
          </Button>
        </form>
      </div>
    )
  }

  if (updateEmailStep === EmailUpdateStep.ConfirmUpdate && updateEmailData) {
    return (
      <div className={s.email}>
        <form onSubmit={handleSubmit(() => handleConfirmEmailUpdateSubmit())}>
          <Text family='secondary' className={s.email__title} align='center' as='div'>
            Введите код
          </Text>
          <Text as='div' color='gray' className='offset-top-40'>
            Адрес почты будет изменен на
          </Text>
          <Text className={s['email__offset-top-5']} as='div'>
            {watch('email')}
          </Text>
          <Text as='div' color='gray' className='offset-top-12'>
            Код подтверждения был отправлен на номер
          </Text>
          <Text className={s['email__offset-top-5']} as='div'>
            {user?.phoneNumber}
          </Text>
          <Input
            type='number'
            register={register}
            autoFocus
            rules={{ required: { value: true, message: 'Введите 5-ти значный код из смс' } }}
            errors={errors}
            fluid
            view='base'
            placeholder='Код подтверждения'
            className={s.email__email_input}
            name='phoneOtp'
          />
          {timeEnd ? (
            <Button onClick={() => handleEmailUpdateSubmit()} className='offset-top-32' fluid>
              Запросить новый код
            </Button>
          ) : (
            <Text className={cx({ [s.email__resend_time]: true })} align='center' as='div' color='gray'>
              Новый код можно будет запросить через{' '}
              <Timer maxRange={updateEmailData.resend} setDue={(value) => setTimeEnd(value)} />
            </Text>
          )}
        </form>
      </div>
    )
  }

  if (updateEmailStep === EmailUpdateStep.VerifyEmail && confirmEmailUpdateData) {
    return (
      <div className={s.email}>
        <form onSubmit={handleSubmit(() => handleVerifyEmail())}>
          <Text as='div' color='gray' className='offset-top-12'>
            Код подтверждения был отправлен на почту
          </Text>
          <Text className={s['email__offset-top-5']} as='div'>
            {watch('email')}
          </Text>
          <Input
            register={register}
            rules={{ required: { value: true, message: 'Введите 5-ти значный код из смс' } }}
            errors={errors}
            fluid
            view='base'
            placeholder='Код подтверждения'
            className={s.email__email_input}
            name='emailOtp'
          />
          {timeEnd ? (
            <Button onClick={handleBack} className='offset-top-32' fluid>
              Попробовать заново
            </Button>
          ) : (
            <Text className={cx({ [s.email__resend_time]: true })} align='center' as='div' color='gray'>
              Новый код можно будет запросить через{' '}
              <Timer maxRange={confirmEmailUpdateData.resend} setDue={(value) => setTimeEnd(value)} />
            </Text>
          )}
        </form>
      </div>
    )
  }
}

export default EditEmailModal
