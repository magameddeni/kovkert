import React from 'react'
import classNames from 'classnames/bind'
import { useRouter } from 'next/router'
import { routes } from '@/constants'
import { Button, Text } from '@/components/UI'
import WatchedProducts from '@/components/WatchedProducts/WatchedProducts'
import useMediaQuery from '@/components/Hooks/useMediaQuery'
import s from './feedback.module.scss'

const cn = classNames.bind(s)

const FeedbackSuccess = () => {
  const isMobile = useMediaQuery('(max-width: 567px)')
  const router = useRouter()

  const buyButtonHandler = () => router.push(routes.CATEGORY)

  return (
    <>
      <div className={s.feedback}>
        <Text as='h1' style={{ fontSize: isMobile ? '32px' : '44px' }}>
          Спасибо за отзыв
        </Text>
        <Text
          as='div'
          className={cn(isMobile ? 'offset-top-16' : 'offset-top-24', {
            feedback__sub_title: true
          })}
        >
          Скоро мы его проверим и опубликуем
        </Text>
        <div className={s.feedback__buy_button}>
          <Button onClick={buyButtonHandler}>Продолжить покупки</Button>
        </div>
      </div>
      <WatchedProducts gridStyles={{ rowGap: '16px', columnGap: '15px' }} grid={isMobile ?? true} />
    </>
  )
}

export default FeedbackSuccess
