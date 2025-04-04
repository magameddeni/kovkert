import React, { PropsWithChildren } from 'react'
import cx from 'classnames'
import { Container, Text } from '@/components/UI'
import styles from './style.module.scss'

interface IEmptyPageProps extends PropsWithChildren {
  title?: string
  description?: string
  className?: string
}

const EmptyPage = ({ children, title, description, className }: IEmptyPageProps) => (
  <Container>
    <div className={cx(styles['empty-page'], className)}>
      <Text as='p' className={styles['empty-page__title']} align='center' family='secondary'>
        {title}
      </Text>
      <Text as='p' className={styles['empty-page__description']} align='center'>
        {description}
      </Text>
      {children}
    </div>
  </Container>
)

export default EmptyPage
