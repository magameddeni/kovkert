import React from 'react'
import { meta } from '@/constants'
import { Button, Container, Text } from '@/components/UI'
import Layout from '@/components/layout/Main'
import emitter, { EVENTS } from '@/utils/emitter'
import s from './auth.module.scss'

interface INotAuthorized {
  accessToText?: string
}

const NotAuthorized = ({ accessToText = 'личному кабинету' }: INotAuthorized) => (
  <Layout meta={{ ...meta.NOT_AUTHORIZED }}>
    <Container>
      <div className={s['not-authorized']}>
        <Text as='p' size='xxl' align='center'>
          Вы не авторизованы.
        </Text>
        <Text as='p' size='lg' align='center' className='offset-top-4'>
          {`Для доступа к ${accessToText} необходимо войти.`}
        </Text>
        <Button className='offset-top-16' onClick={() => emitter.emit(EVENTS.SHOW_LOGIN_MODAL)}>
          Войти
        </Button>
      </div>
    </Container>
  </Layout>
)

export default NotAuthorized
