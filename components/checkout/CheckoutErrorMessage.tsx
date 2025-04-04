import { Button, Text } from '@/components/UI'
import Link from 'next/link'
import { routes } from '@/constants'
import React from 'react'

interface CheckoutErrorMessageProps {
  message: string
}

export const CheckoutErrorMessage: React.FC<CheckoutErrorMessageProps> = ({ message }) => (
  <div className='offset-top-32'>
    <Text size='lg' whiteSpace='pre-line'>
      {message}
    </Text>
    <Link href={routes.BASKET}>
      <Button className='offset-top-16'>В корзину</Button>
    </Link>
  </div>
)
