import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { routes } from '@/constants'
import { Container, Text } from '@/components/UI'
import { isPWA } from '@/utils/isPWA'
import axios from 'axios'
import fileDownload from 'js-file-download'
import cx from 'classnames'
import s from './footer.module.scss'

interface ILink {
  name: string
  link: string
  color?: string
}

interface IImage {
  img: string
  width?: number
  height?: number
}

const Footer = () => {
  const [isLoading, setIsLoading] = useState(false)
  const handleDownload = () => {
    setIsLoading(true)
    axios
      .get('/kovkert.apk', {
        responseType: 'blob'
      })
      .then((res) => {
        fileDownload(res.data, 'kovkert.apk')
        setIsLoading(false)
      })
  }
  const renderLink = ({ name, link, ...rest }: ILink) => (
    <Link href={link}>
      <Text weight='regular' {...rest}>
        {name}
      </Text>
    </Link>
  )

  const renderImage = ({ img, width = 45, height = 18 }: IImage) => (
    <Image src={img} width={width} height={height} alt='' />
  )

  return (
    <footer className={s.footer}>
      <Container>
        <div className={s['footer-top']}>
          <div className={s.left}>
            <div className={s.footer__block}>
              <Text as='h6' className={s.title}>
                Покупателям
              </Text>
              <ul className={s.list}>
                <li>{renderLink({ name: 'Оформление заказа', link: `${routes.DOCS}?to=oformlenie-zakaza` })}</li>
                <li>{renderLink({ name: 'Оплата', link: `${routes.DOCS}?to=oplata` })}</li>
                <li>{renderLink({ name: 'Доставка', link: `${routes.DOCS}?to=dostavka` })}</li>
                <li>{renderLink({ name: 'Возврат', link: `${routes.DOCS}?to=vozvrat` })}</li>
              </ul>
            </div>
            <div className={s.footer__block}>
              <Text as='h6' className={s.title}>
                Принимаем к оплате
              </Text>
              <ul className={s['payment-systems']}>
                <li>{renderImage({ img: '/footer/mir.svg' })}</li>
                <li>{renderImage({ img: '/footer/visa.svg' })}</li>
                <li>{renderImage({ img: '/footer/mc.svg' })}</li>
              </ul>
            </div>
            <div className={s['footer-group-block']}>
              <div className={s.footer__block}>
                <Text as='h6' className={s.title}>
                  О компании
                </Text>
                <ul className={s.list}>
                  <li>{renderLink({ name: 'Контакты', link: `${routes.DOCS}?to=kontakti` })}</li>
                  <li>{renderLink({ name: 'Реквизиты', link: `${routes.DOCS}?to=rekviziti` })}</li>
                </ul>
              </div>
              <div className={s.footer__block}>
                <Text as='h6' className={s.title}>
                  Наши соцсети
                </Text>
                <ul className={s.list}>
                  <li>{renderLink({ name: 'Телеграм', link: `#` })}</li>
                  <li>{renderLink({ name: 'Youtube', link: `#` })}</li>
                </ul>
              </div>
            </div>
          </div>
          {!isPWA() && (
            <div className={s.right}>
              <div className={s.footer__block}>
                <Text as='h6' className={s.title}>
                  Приложение
                </Text>
                <ul className={s.apps}>
                  <a
                    href='https://apps.apple.com/us/app/kovkert/id6668526431?platform=iphone'
                    target='_blank'
                    className={s.apps__item_wrapper}
                    rel='noreferrer'
                  >
                    <li className={s.apps__item}>
                      {renderImage({ img: '/footer/app-store.svg', width: 110, height: 39 })}
                    </li>
                  </a>
                  <div
                    onClick={handleDownload}
                    className={cx(s.apps__item_wrapper, {
                      [s['apps-loading']]: isLoading
                    })}
                  >
                    <li className={s.apps__item}>
                      {renderImage({ img: '/footer/google-play.svg', width: 110, height: 39 })}
                    </li>
                  </div>
                </ul>
              </div>
            </div>
          )}
        </div>
        <div className={s['footer-bottom']}>
          <Text color='gray' weight='regular' className={s.footer__date}>
            © 2023 - {new Date().getFullYear()} Kovkert
          </Text>
          {renderLink({
            name: 'Условия обработки персональных данных',
            link: `${routes.DOCS}?to=usloviya-obrabotki-personalnikh-dannikh`,
            color: 'gray'
          })}
        </div>
      </Container>
    </footer>
  )
}

export default Footer
