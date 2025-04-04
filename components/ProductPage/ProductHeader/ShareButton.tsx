import React, { useState } from 'react'
import cx from 'classnames'
import { copyText } from '@/utils/copyText'
import { useWindowSize, useMessage } from '@/hooks'
import { IProduct } from '@/models'
import { Icon, Text } from '@/components/UI'
import s from './product-header.module.scss'

interface IShareData {
  title?: string
  text?: string
  url?: string
  files?: File[]
}

const ShareButton = ({ item }: { item: IProduct }) => {
  const [showMessage, setShowMessage] = useState<boolean>(false)
  const { deviceWidth } = useWindowSize()

  const renderMessage = () => (
    <div
      className={cx(s['share__link-copied'], {
        [s.active]: showMessage,
        [s.dynamic]: deviceWidth === 'large'
      })}
    >
      <Icon color='blue' name='check' />
      <Text color='blue'>Ссылка скопирована</Text>
    </div>
  )

  const onShareClick = async () => {
    const data: IShareData = {
      title: '',
      text: `${item.productName} за ${item.discountPrice}`,
      url: window.location.href
    }

    // if (item?.images?.[0]?.link) {
    //   const blob = await fetch(item?.images?.[0]?.link).then((r) => r.blob())
    //   data.files = [
    //     new File([blob], 'file.jpg', {
    //       type: 'image/jpeg',
    //       lastModified: Date.now()
    //     })
    //   ]
    // }

    if (deviceWidth === 'small') {
      navigator?.share(data)
    } else {
      await copyText(window.location.href)
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 2000)

      if (deviceWidth !== 'large' && !showMessage) {
        useMessage(renderMessage(), 'success', null, {
          className: 'light',
          position: 'bottom-center'
        })
      }
    }
  }

  return (
    <div className={s.share} onClick={onShareClick}>
      <Icon name='share' />
      <Text>Поделиться</Text>
      {deviceWidth === 'large' && renderMessage()}
    </div>
  )
}

export default ShareButton
