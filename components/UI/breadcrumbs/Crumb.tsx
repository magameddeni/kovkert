import React from 'react'
import { useRouter } from 'next/router'
import cx from 'classnames'
import Link from 'next/link'
import { Icon, Text } from '@/components/UI'
import { routes } from '@/constants'
import s from './breadcrumbs.module.scss'

interface ICrumbProps {
  leftArrow?: boolean
  rightArrow?: boolean
  text: string
  href: string
  linkStyle?: React.CSSProperties
}

const EXCLUDED_QUERIES = ['price_range']

export const Crumb = ({ leftArrow, rightArrow, text, href, linkStyle }: ICrumbProps) => {
  const router = useRouter()
  const currentQuery = router.query

  const filteredObject = Object.fromEntries(
    Object.entries(currentQuery).filter(([key]) => !EXCLUDED_QUERIES.includes(key))
  )

  const hrefWithQuery = {
    pathname: href,
    query: { ...filteredObject }
  }

  const shouldAddQuery = router.pathname === routes.CATEGORY_SLUG

  return (
    <Link color='inherit' href={shouldAddQuery ? hrefWithQuery : href} style={linkStyle}>
      <div className={s.crumb}>
        {leftArrow && <Icon name='arrow-left' color='gray' className={cx(s.crumb__icon, s.left)} />}
        <Text color='gray' className={s.crumb__text}>
          {text}
        </Text>
        {rightArrow && <Icon name='arrow-right' color='gray' className={cx(s.crumb__icon, s.right)} />}
      </div>
    </Link>
  )
}
