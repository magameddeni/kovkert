import React from 'react'
import { useCurrentSiteUrl, useMessage, useWindowSize } from '@/hooks'
import { copyText } from '@/utils/copyText'
import { Icon, Modal, Text } from '@/components/UI'
import styles from './success-join-product-modal.module.scss'

interface SuccessJoinProductModalProps {
  isOpen: boolean
  onClose: VoidFunction
  code: string | undefined
}

export const SuccessJoinProductModal = ({ isOpen, onClose, code }: SuccessJoinProductModalProps) => {
  const { isLarge, isSmall } = useWindowSize()
  const { siteUrl } = useCurrentSiteUrl(`/p/${code}`)

  const handleCopy = () => {
    void copyText(siteUrl)
    useMessage('Ссылка скопирована!', 'success', 'Готово')
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      wrapperClassName={styles['success-join-product-modal']}
      closePlace={isLarge ? 'right' : 'uptop-right'}
    >
      <div className={styles['success-join-product']}>
        <Text as='h3' className={styles['success-join-product__title']} align='center'>
          Готово!
        </Text>
        <Text as='p' size={isSmall ? 'xxxs' : 'md'} className='offset-top-24 offset-sm-top-32' color='gray'>
          Реферальная ссылка
        </Text>
        <div className={styles['success-join-product__ref-code']} onClick={handleCopy}>
          <Text>{siteUrl}</Text>
          {!isSmall && <Icon name='duplicate' color='gray-dark' />}
        </div>
      </div>
    </Modal>
  )
}
