import React from 'react'
import cx from 'classnames'
import moment from 'moment'
import { IMessage } from '@/components/chat/types'
import { Text } from '@/components/UI'
import SpinnerIcon from 'public/spinner.svg'
import MessageRead from 'public/msg_read.svg'
import MessageSend from 'public/msg_send.svg'
import s from './messages.module.scss'

interface ITextMessageProps {
  message: IMessage
  self: boolean
  pending: boolean
}

const TextMessage = ({ message, self, pending }: ITextMessageProps) => (
  <div className={cx(s.message, { [s.self]: self })}>
    <div className={s.message__block}>
      <Text className={s.text}>{message.message}</Text>
    </div>
    <div className={s.message__date}>
      {self && (
        <div className={s['status-icon']}>
          {pending ? <SpinnerIcon /> : message.read ? <MessageRead /> : <MessageSend />}
        </div>
      )}
      <Text className={s.time}>{moment(message.createdAt).format('HH:mm')}</Text>
    </div>
  </div>
)

export default TextMessage
