import React, { useState } from 'react'
import { Button, Icon, Text } from 'components/UI'
import { AffiliateInfoBlockModal } from './AffiliateInfoBlockModal'
import styles from './affiliate-info-block.module.scss'

interface AffiliateInfoBlockProps {
  asIcon?: boolean
}

export const AffiliateInfoBlock: React.FC<AffiliateInfoBlockProps> = ({ asIcon = false }) => {
  const [openModal, setOpenModal] = useState(false)

  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  return (
    <>
      {!asIcon ? (
        <div className={styles['affiliate-info-block']}>
          <Text size='xs' family='secondary'>
            Партнёрская программа
          </Text>
          <Text size='md' whiteSpace='pre-line'>
            {`На Ковкерт действует партнёрская программа.\nВы можете зарабатывать баллы если по вашей ссылке будет оформлен заказ!`}
          </Text>
          <Button view='link' onClick={handleOpenModal}>
            Подробнее
          </Button>
        </div>
      ) : (
        <Icon name='info' color='gray' onClick={handleOpenModal} />
      )}

      <AffiliateInfoBlockModal isOpen={openModal} onClose={handleCloseModal} />
    </>
  )
}
