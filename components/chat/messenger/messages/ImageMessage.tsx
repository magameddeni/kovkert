import React, { FC } from 'react'
import cx from 'classnames'
import moment from 'moment'
import { Text } from '@/components/UI'
import MessageRead from 'public/msg_read.svg'
import MessageSend from 'public/msg_send.svg'
import Spinner from 'public/spinner.svg'
import { IMessage } from '../../types'
import s from './messages.module.scss'
import 'react-circular-progressbar/dist/styles.css'

interface IImageMessageProps {
  message: IMessage
  pending?: boolean
  index: number
  onClick: (arg: number) => void
  self: boolean
}

const ImageMessage: FC<IImageMessageProps> = ({
  index,
  message: { createdAt = '', read, thumb },
  pending,
  onClick,
  self
}) => (
  <div className={cx(s.message, s.image, { [s.self]: self })} onClick={() => onClick(index)}>
    {pending ? (
      <div className={s.message__block}>
        <div className={s.spinner}>
          <Spinner />
        </div>
      </div>
    ) : (
      <>
        <div className={s.message__block}>
          <img src={thumb} alt='' />
        </div>
        <div className={s.message__date}>
          {self && (
            <div className={s['status-icon']}>{pending ? <Spinner /> : read ? <MessageRead /> : <MessageSend />}</div>
          )}
          <Text className={s.time}>{moment(createdAt).format('HH:mm')}</Text>
        </div>
      </>
    )}
  </div>
)

export default ImageMessage
