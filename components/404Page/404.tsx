import React from 'react'
import cx from 'classnames'
import { useRouter } from 'next/router'
import { routes } from '@/constants'
import { Button, Text } from '@/components/UI'
import { useWindowSize } from '@/hooks'
import s from './404.module.scss'

const Error404 = () => {
  const { deviceWidth } = useWindowSize()
  const router = useRouter()

  return (
    <div className={s.error}>
      <Text weight='medium' align='center' family='secondary' className={s.error__title}>
        404
      </Text>
      <Text
        className={cx({
          'offset-top-20': deviceWidth === 'small',
          'offset-top-24': deviceWidth === 'medium',
          'offset-top-32': deviceWidth === 'large'
        })}
        align='center'
        as='h3'
      >
        Страница не найдена
      </Text>
      <Text as='p' color='gray' className={s.error__text} align='center' weight='regular'>
        Не правильно набран адрес или такой страницы не существует
      </Text>
      <Button
        onClick={() => router.push(routes.CATEGORY)}
        className={cx({
          'offset-top-20': deviceWidth === 'small',
          'offset-top-24': deviceWidth === 'medium',
          'offset-top-32': deviceWidth === 'large'
        })}
      >
        В каталог
      </Button>
    </div>
  )
}

export default Error404
