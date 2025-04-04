import React, { ChangeEvent, useState } from 'react'
import { useLoginUserMutation } from '@/redux/auth/authApi'
import { EMAIL_REGEX } from '@/helpers'
import { Text } from '@/components/UI'
import Button from '@/components/UI/Buttons/Button'
import styles from './log_in.module.scss'

type Props = {
  onClose: VoidFunction
}

function AuthLogIn({ onClose }: Props) {
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [loginUser, { isLoading }] = useLoginUserMutation()
  const [errMsg, setErrMsg] = useState('')
  const [isSpace, setIsSpace] = useState(false)

  const onSubmitHandler = async (e: Event) => {
    e.preventDefault()
    if (isLoading) return
    if (EMAIL_REGEX.test(email)) {
      try {
        await loginUser({
          login: email,
          password: pwd
        }).unwrap()
        onClose()
      } catch (err: any) {
        console.error(err)
        if (!err?.status) {
          setErrMsg('Нет ответа от сервера')
        }

        if (err.data?.error) {
          setErrMsg(err.data.error)
        } else {
          console.error(err.error)
        }
      }
    } else {
      setErrMsg('Введите корректную почту')
    }
  }

  const changeEmailInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isSpace) {
      const { value } = e.target
      const trimmedValue = value.replace(/\s/g, '')
      setEmail(trimmedValue)
    }
  }

  const handleEmailKeyPress = (e: any) => {
    if (e.key === ' ') {
      setIsSpace(true)
    } else {
      setIsSpace(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.container__header}>
        <Text as='h2' className={styles.container__title}>
          Войти
          <div className={styles.container__sub_title}>или создать профиль</div>
        </Text>
      </div>
      <div className={styles.container__body}>
        <form className={styles.container__form}>
          <label className={styles.container__label} htmlFor='phone'>
            Адрес электронной почты
            <span className={styles.container__text_grey}>Только для зарегестрированных пользователей</span>
            <div className={styles.container__input_wrapper}>
              <input
                onKeyPress={handleEmailKeyPress}
                autoFocus
                type='email'
                id='email'
                autoComplete='off'
                placeholder='Email'
                className={styles.container__input}
                value={email}
                onChange={changeEmailInput}
              />
            </div>
          </label>

          <label className={styles.container__label} htmlFor='password'>
            Пароль
            <div className={styles.container__input_wrapper}>
              <input
                type='password'
                id='password'
                autoComplete='off'
                placeholder='Пароль'
                className={styles.container__input}
                onChange={(e) => setPwd(e.target.value)}
              />
            </div>
          </label>

          {!!errMsg && <div className={styles.container__error}>{errMsg}</div>}

          <div className={styles.container__code_footer}>
            <Button
              loading={isLoading}
              size='large'
              background='blue'
              handler={onSubmitHandler}
              text='Войти'
              layout='fill'
              type='submit'
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default AuthLogIn
