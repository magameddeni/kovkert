import React, { useState } from 'react'
import Button from '@/components/UI/Buttons/Button'
import AuthLogIn from './AuthLogIn'
import styles from './log_in.module.scss'
// @ts-ignore
import PhoneAuth from './PhoneAuth'

type Props = {
  onClose: VoidFunction
}

function LogIn({ onClose }: Props) {
  const [enterEmail, setEnterEmail] = useState(false)

  return (
    <div className={styles.modal}>
      {!enterEmail ? (
        <PhoneAuth onClose={() => onClose()} />
      ) : (
        <AuthLogIn
          // setEnterEmail={() => setEnterEmail(false)}
          onClose={() => onClose()}
        />
      )}
      <div className={styles.modal__footer}>
        {enterEmail ? (
          <Button
            size='large'
            color='blue'
            background='transparent'
            handler={() => setEnterEmail(false)}
            text='Войти с мобильного телефона'
            custom_padding='0'
          />
        ) : (
          <Button
            size='large'
            color='blue'
            background='transparent'
            handler={() => setEnterEmail(true)}
            text='Войти с помощью почты'
            custom_padding='0'
          />
        )}
      </div>
    </div>
  )
}

export default LogIn
