import React from 'react'
import cx from 'classnames'
import { Container, Text } from 'components/UI/index'
import s from './style.module.scss'

interface IEmptyPageProps {
  title: string
  description?: string
  fullHeight?: boolean
}

const PageEmpty = ({ title, description, fullHeight = true }: IEmptyPageProps) => (
  <Container>
    <div className={cx(s['page-empty'], { [s['full-height']]: fullHeight })}>
      <Text as='p' size='xl' align='center'>
        {title}
      </Text>
      {description && (
        <Text as='p' className='offset-top-12' color='gray' align='center'>
          {description}
        </Text>
      )}
    </div>
  </Container>
)

export default PageEmpty
