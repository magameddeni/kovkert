import React from 'react'
import { Text } from '@/components/UI'
import IconMessage from '@/public/icons/message.svg'
import s from './choose-chat.module.scss'

const ChooseChat = () => (
  <div className={s['choose-chat']}>
    <IconMessage width={30} height={28} />
    <Text color='gray' family='secondary' className='offset-top-12'>
      Выберите чат
    </Text>
  </div>
)

export default ChooseChat
