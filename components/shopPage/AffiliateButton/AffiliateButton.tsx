import React from 'react'
import Link from 'next/link'
import cx from 'classnames'
import { useRouter } from 'next/router'
import { routes } from '@/constants'
import { Text } from '@/components/UI'
import styles from './affiliate-button.module.scss'

interface AffiliateButtonProps {
  className?: string
}

export const AffiliateButton: React.FC<AffiliateButtonProps> = ({ className }) => {
  const { query } = useRouter()

  return (
    <Link
      href={`${routes.SHOP}/${query.slug}${routes.AFFILIATE}`}
      className={cx(styles['affiliate-button'], className)}
    >
      <img src='/hexagon-shadow.svg' alt='' />
      <Text color='peach' size='xs' family='secondary'>
        Партнерская программа
      </Text>
    </Link>
  )
}
