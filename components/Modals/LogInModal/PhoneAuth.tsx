import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import ReCAPTCHA from 'react-google-recaptcha'
import { Controller, useForm } from 'react-hook-form'
import { useMessage } from '@/hooks'
import { useRegisterUserMutation, useVerifyOTPMutation } from '@/redux/auth/authApi'
import Timer from '@/components/Timer'
import Button from '@/components/UI/Buttons/Button'
import { Input, Text } from '@/components/UI'
import InvalidInputIcon from '@/public/InvalidInput.svg'
import styles from './log_in.module.scss'

type Props = {
  onClose: VoidFunction
}

export type RegisterInput = {
  phoneNumber: string
  recaptchaToken: string
}

const PhoneAuth = ({ onClose }: Props) => {
  const [registerUser, { isLoading }] = useRegisterUserMutation()
  const [showEnterCodeForm, setShowEnterCodeForm] = useState(false)
  const [verifyOTP] = useVerifyOTPMutation()
  const [due, setDue] = useState(false)
  const [code, setCode] = useState('')
  const [errMsg, setErrMsg] = useState<any>('')
  const [resendTimer, setResendTimer] = useState<number>(50)
  const recaptchaRef: any = React.useRef()

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors }
  } = useForm<RegisterInput>()

  const submitPhone = async ({ phoneNumber }: Pick<RegisterInput, 'phoneNumber'>) => {
    try {
      const token = await recaptchaRef.current.executeAsync()

      if (!token) {
        return useMessage('Google captcha не работает', 'error')
      }

      const response: any = await registerUser({
        phoneNumber: phoneNumber.replace(/[- )(]/g, ''),
        recaptchaToken: token
      } as any).unwrap()

      setShowEnterCodeForm(true)
      setResendTimer(response?.resend as number)
    } catch (err: any) {
      if (!err?.status) {
        setErrMsg('Нет ответа от сервера')
      } else if (err.status === 409) {
        setErrMsg('Такой адрес существует')
      } else if (err.status === 429) {
        setErrMsg('Превышено количество запросов или возможно вы бот')
      } else if (err.status) {
        setErrMsg(err.message)
      } else {
        setErrMsg('Регистрация не удалась')
      }
    }
  }

  const resendOtp = async (userPhone: { phoneNumber: string }) => {
    setDue(false)
    await submitPhone(userPhone)
  }

  const verifyOtp = async () => {
    try {
      await verifyOTP({ otp: code, phoneNumber: getValues('phoneNumber').replace(/[- )(]/g, '') }).unwrap()
      setCode('')
      onClose()
    } catch (err: any) {
      if (!err?.status) {
        setErrMsg('Нет ответа от сервера')
      } else if (err.status) {
        setErrMsg(err.data.message)
      } else {
        setErrMsg('Регистрация не удалась')
      }
    }
  }

  const handleBackBtn = () => {
    setShowEnterCodeForm(false)
  }

  useEffect(() => {
    if (code.length === 5) {
      verifyOtp()
    } else {
      setErrMsg(null)
    }
  }, [code])

  return (
    <div className={styles.container}>
      <>
        <div className={styles.container__header}>
          <Text as='h2' className={styles.container__title}>
            Войти
            <div className={styles.container__sub_title}>или создать профиль</div>
          </Text>
        </div>
        <div className={styles.container__body}>
          {showEnterCodeForm ? (
            <form className={styles.container__form}>
              <label className={styles.container__label} htmlFor='phone'>
                Введите код из СМС
              </label>
              <div className={styles.container__description}>
                <span className={styles.container__text_grey}>Код подтверждения был отправлен на номер</span>
                <div className={styles.row}>
                  <span>{getValues('phoneNumber')}</span>
                  <Button
                    size='large'
                    color='blue'
                    background='transparent'
                    handler={handleBackBtn}
                    text='Изменить'
                    type='submit'
                    custom_padding='0'
                  />
                </div>
              </div>

              <div className={styles.container__input_wrapper}>
                <input
                  autoFocus
                  type='number'
                  id='code'
                  maxLength={5}
                  autoComplete='off'
                  aria-invalid={!!errMsg}
                  className={styles.container__code_input}
                  onChange={(e) => setCode(e.target.value)}
                />

                {!!errMsg && <div className={styles.container__error}>{errMsg}</div>}
              </div>
              <div className={styles.container__code_footer}>
                {due ? (
                  <Button
                    size='large'
                    background='transparent'
                    color='blue'
                    handler={() => resendOtp({ phoneNumber: getValues('phoneNumber') })}
                    text='Получить новый код'
                    custom_padding='0'
                    type='button'
                  />
                ) : (
                  <>
                    <p className={styles.container__timer}>
                      <span>Новый код можно будет запросить через</span>
                      <Timer setDue={setDue} maxRange={resendTimer} />
                    </p>
                  </>
                )}
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit(submitPhone)} className={styles.container__form}>
              <label className={styles.container__label} htmlFor='phone'>
                Номер телефона
                <span className={styles.container__text_grey}>
                  Введите номер телефона и мы отправим СМС с кодом подтверждения
                </span>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  size='invisible'
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
                />
                <div className={styles.container__input_wrapper}>
                  <Controller
                    name='phoneNumber'
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
                        autoComplete='off'
                        fluid
                        required
                        autoFocus
                        className={styles.container__input}
                        aria-invalid={Boolean(errors.phoneNumber)}
                      />
                    )}
                  />
                  {Boolean(errors?.phoneNumber?.message) && (
                    <>
                      <div className={styles.container__icon}>
                        <InvalidInputIcon />
                      </div>
                      <div className={styles.container__error}>{errors?.phoneNumber?.message}</div>
                    </>
                  )}
                </div>
              </label>

              <div className={styles.container__phone_footer}>
                <Button
                  loading={isLoading}
                  size='large'
                  background='blue'
                  text='Получить код'
                  layout='fill'
                  type='submit'
                />
                <div className={styles['recaptcha-text']}>
                  <Text as='p'>
                    Этот сайт защищен reCAPTCHA и Google
                    <Link href='https://policies.google.com/privacy' target='_blank'>
                      <Text color='blue'>Политика конфиденциальности</Text>
                    </Link>
                    и
                    <Link href='https://policies.google.com/terms' target='_blank'>
                      <Text color='blue'>Условия обслуживания.</Text>
                    </Link>
                  </Text>
                </div>
              </div>
            </form>
          )}
        </div>
      </>
    </div>
  )
}

export default PhoneAuth
