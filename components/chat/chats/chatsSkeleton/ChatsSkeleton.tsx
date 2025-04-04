import React from 'react'
import { Skeleton } from '@/components/UI'
import s from '../chats.module.scss'

const ChatsSkeleton = () => (
  <div className={s.chats}>
    <Skeleton>
      {Array(5)
        .fill('')
        .map(() => (
          <div key={Math.random()} className={s.chat}>
            <div className={s.chat__logo}>
              <Skeleton.Item width={40} height={40} />
            </div>
            <div className={s.chat__info}>
              <Skeleton.Item width={120} height={14} />
              <Skeleton.Item width={120} height={14} className='offset-top-4' />
            </div>
            <div className={s.chat__date}>
              <Skeleton.Item width={40} height={10} />
            </div>
          </div>
        ))}
    </Skeleton>
  </div>
)

export default ChatsSkeleton
