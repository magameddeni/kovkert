import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import {
  useChangePhoneMutation,
  useConfirmChangePhoneOTPMutation,
  useConfirmResetPhoneOTPMutation,
  useResetPhoneMutation
} from '@/redux/auth/authApi'
import { useAppSelector } from '@/redux/hook'
import { Button, ButtonGroup, DotsLoader, Input, Text } from '@/components/UI'
import Timer from 'components/Timer'
import s from './edit-phone-modal.module.scss'

type Props = {
  onClose: VoidFunction
}

const EditPhoneModal = ({ onClose }: Props) => {
  const user = useAppSelector(({ beru }) => beru.user.data)
  const [resetPhoneOTP, setResetPhoneOTP] = useState('')
  const [enterNewPhone, setEnterNewPhone] = useState(false)
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [newPhoneOTP, setNewPhoneOTP] = useState('')

  const [errMsg, setErrMsg] = useState('')
  const [codeSent, setCodeSent] = useState(false)

  const [resendTimer, setResendTimer] = useState(50)
  const [due, setDue] = useState(false)

  const [resetPhoneQuery, { isLoading: resetingPhone }] = useResetPhoneMutation()
  const [confirmResetPhoneQuery, { isLoading: confrimingResetPhone }] = useConfirmResetPhoneOTPMutation()
  const [changePhoneQuery, { isLoading: changingPhone }] = useChangePhoneMutation()
  const [confrimChangePhoneQuery, { isLoading: confirmingChangePhone }] = useConfirmChangePhoneOTPMutation()

  const resetPhone = async () => {
    try {
      const response = await resetPhoneQuery({ phoneNumber: user?.phoneNumber as string }).unwrap()
      setResendTimer(response.resendAfter)
      setDue(false)
      setCodeSent(true)
    } catch (error: any) {
      if (!error?.data.message) {
        setErrMsg('Нет ответа от сервера')
      } else if (error.data.message) {
        setErrMsg(error.data.message)
      } else {
        setErrMsg('Что-то пошло не так! Попробуйте снова!')
      }
    }
  }

  const confirmResetPhone = async () => {
    try {
      await confirmResetPhoneQuery({ OTP: resetPhoneOTP }).unwrap()
      setCodeSent(false)
      setEnterNewPhone(true)
      setResetPhoneOTP('')
    } catch (error: any) {
      if (!error?.data.message) {
        setErrMsg('Нет ответа от сервера')
      } else if (error.data.message) {
        setErrMsg(error.data.message)
      } else {
        setErrMsg('Что-то пошло не так! Попробуйте снова!')
      }
    }
  }

  const changePhone = async (e?: { preventDefault: VoidFunction }) => {
    e?.preventDefault()
    try {
      const response = await changePhoneQuery({ newPhoneNumber: newPhoneNumber.replace(/ /g, '') }).unwrap()
      setResendTimer(response.resendAfter)
      setDue(false)
      setCodeSent(true)
    } catch (error: any) {
      if (!error?.data.message) {
        setErrMsg('Нет ответа от сервера')
      } else if (error.data.message) {
        setErrMsg(error.data.message)
      } else {
        setErrMsg('Что-то пошло не так! Попробуйте снова!')
      }
    }
  }

  const verifyNewNumber = async () => {
    try {
      await confrimChangePhoneQuery({
        OTP: newPhoneOTP,
        phoneNumber: newPhoneNumber.replace(/ /g, '')
      }).unwrap()
      setNewPhoneOTP('')
      onClose()
    } catch (error: any) {
      if (!error.data.message) {
        setErrMsg('Нет ответа от сервера')
      } else if (error.data.message) {
        setErrMsg(error.data.message)
      } else {
        setErrMsg('Регистрация не удалась')
      }
    }
  }

  const onChangeCode = (value: string, newPhone?: boolean) => {
    if ((Number(value) && value.length < 6) || value === '') {
      if (newPhone) {
        setResetPhoneOTP(value)
      } else {
        setNewPhoneOTP(value)
      }
    }
  }

  useEffect(() => {
    if (resetPhoneOTP.length === 5) {
      confirmResetPhone()
    }
  }, [resetPhoneOTP])

  useEffect(() => {
    if (newPhoneOTP.length === 5) {
      verifyNewNumber()
    }
  }, [newPhoneOTP])

  useEffect(() => {
    setErrMsg('')
  }, [resetPhoneOTP, newPhoneNumber, newPhoneOTP])

  if (resetingPhone || confrimingResetPhone || changingPhone || confirmingChangePhone) {
    return (
      <div className={s['edit-phone']}>
        <DotsLoader />
      </div>
    )
  }

  if (enterNewPhone) {
    return (
      <div className={s['edit-phone']}>
        {!codeSent ? (
          <>
            <Text as='h6' align='center'>
              Введите новый номер
            </Text>
            <p style={{ color: '#ff1111' }}>{errMsg}</p>
            <form onSubmit={changePhone}>
              <Input
                view='base'
                autoFocus
                type='tel'
                autoComplete='off'
                placeholder='Мобильный телефон'
                name='phone'
                value={newPhoneNumber}
                onChange={(value) => setNewPhoneNumber(value as unknown as string)}
                classNameInputWrapper='offset-top-16'
                required
                fluid
              />
              <Button type='submit' className='offset-top-12' fluid>
                Получить код
              </Button>
            </form>
          </>
        ) : (
          <>
            <Text as='h6' align='center'>
              Введите полученный код
            </Text>
            <Text as='p' size='md' color='gray' className={cx('offset-top-40', s['text-description'])}>
              Код подтверждения был отправлен на номер
              <br />
              <Text size='md' color='primary'>
                {newPhoneNumber}
              </Text>
            </Text>
            <p style={{ color: '#ff1111' }}>{errMsg}</p>
            <Input
              type='number'
              name='codr'
              autoFocus
              autoComplete='off'
              view='base'
              placeholder='5 символов'
              onChange={(e) => onChangeCode(e.target.value)}
              value={newPhoneOTP}
              className={s.input}
              textCenter
              classNameInputWrapper='offset-top-16'
              required
              fluid
            />
            <div className={s['timer-wrapper']}>
              {!due ? (
                <Text size='md' color='gray' align='center' className={s['timer-wrapper__text']}>
                  Новый код можно будет запросить через&nbsp;
                  <Timer setDue={setDue} maxRange={resendTimer} />
                </Text>
              ) : (
                <Button view='link' onClick={() => changePhone()}>
                  Отправить снова
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className={s['edit-phone']}>
      {!codeSent ? (
        <>
          <Text as='h6' align='center'>
            Изменение номера телефона
          </Text>
          <Text as='p' size='md' color='gray' className='offset-top-40'>
            Мы отправим код подтверждения на ваш текущий номер:
            <br />
            <Text size='md' color='primary'>
              {user?.phoneNumber}
            </Text>
          </Text>
          <ButtonGroup className='offset-top-12'>
            <Button view='link' onClick={onClose}>
              Отмена
            </Button>
            <Button fluid onClick={resetPhone}>
              Получить код
            </Button>
          </ButtonGroup>
        </>
      ) : (
        <>
          <Text as='h6' family='secondary' align='center'>
            Введите код
          </Text>
          <Text as='p' size='md' color='gray' className={cx('offset-top-40', s['text-description'])}>
            Код подтверждения был отправлен на номер
            <br />
            <Text size='md' color='primary'>
              {user?.phoneNumber}
              <Button view='link' onClick={() => setCodeSent(false)}>
                Изменить
              </Button>
            </Text>
          </Text>
          <p style={{ color: '#ff1111' }}>{errMsg}</p>
          <Input
            type='number'
            name='code'
            autoFocus
            view='base'
            autoComplete='off'
            placeholder='5 символов'
            onChange={(e) => onChangeCode(e.target.value, true)}
            value={resetPhoneOTP}
            className={s.input}
            classNameInputWrapper='offset-top-16'
            required
            fluid
            textCenter
          />
          <div className={s['timer-wrapper']}>
            {!due ? (
              <Text size='md' color='gray' align='center' className={s['timer-wrapper__text']}>
                Новый код можно будет запросить через&nbsp;
                <Timer setDue={setDue} maxRange={resendTimer} />
              </Text>
            ) : (
              <Button view='link' onClick={resetPhone}>
                Получить новый код
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default EditPhoneModal
