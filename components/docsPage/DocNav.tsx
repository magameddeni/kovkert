import React from 'react'
import Link from 'next/link'
import cx from 'classnames'
import { routes } from '@/constants'
import { TDoc } from '@/models'
import { Icon, Text } from '@/components/UI'
import s from './docs.module.scss'

type IDocNavProps = {
  data: TDoc[] | undefined
  active: string | null
  arrowRight?: boolean
}

const DocNav = ({ data, active, arrowRight }: IDocNavProps) => {
  if (!data) return

  return (
    <ul className={s['docs-nav']}>
      {data.map((v: TDoc) => (
        <li key={v.link} className={cx(s['docs-nav__item'], { [s.active]: v.link === active })}>
          <Link href={`${routes.DOCS}?to=${v.link}`} className={s.link}>
            <Text weight='regular'>{v.title}</Text>
            {arrowRight && <Icon name='arrow-right' size='sm' color='gray' />}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default DocNav
