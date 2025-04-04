import React, { FC, useCallback, useMemo, useState } from 'react'
import Image from 'next/image'
import ModalCosntructor from '@/components/Modals/ModalConstructor'
import StoriesModal from '@/components/Modals/StoriesModal'
import useMediaQuery from '@/components/Hooks/useMediaQuery'
import styles from './ShopAvatar.module.scss'

type Props = {
  image: string
  stories?: Array<any>
  width?: number
  height?: number
  name: string
  _styles?: React.CSSProperties
}

const ShopAvatar: FC<Props> = ({ image = '', stories = [], width = 70, height = 70, name = '', _styles }) => {
  const isMobile = useMediaQuery('( max-width: 850px )')
  const [showStoriesModal, setShowStoriesModal] = useState(false)

  const dasharray = useMemo(() => {
    if (stories.length === 1) {
      return ''
    }

    const gap = 10
    const lineLength = 314 / stories.length
    return `${lineLength - gap} ${gap} `.repeat(stories.length)
  }, [stories])

  const handlerClick = () => {
    setShowStoriesModal(true)
  }

  const handlerClose = useCallback(() => {
    setShowStoriesModal(false)
  }, [])

  return (
    <>
      <div style={{ width, height, ..._styles }} className={styles.avatar}>
        {stories.length > 0 && (
          <svg width={width} height={height} viewBox='0 0 104 104' className={styles.svg} onClick={handlerClick}>
            <circle
              cx='52'
              cy='52'
              r='50'
              fill='none'
              strokeLinecap='round'
              className={styles.circle}
              strokeDashoffset='387.69908169872417'
              strokeDasharray={dasharray}
              strokeWidth='4'
            />
          </svg>
        )}
        {image ? (
          <Image alt={name} src={image} width={width - 10} height={height - 10} />
        ) : (
          <div
            style={{
              width: width - 8,
              height: height - 8,
              borderRadius: '50%',
              backgroundColor: '#222'
            }}
          />
        )}
      </div>

      <ModalCosntructor show={showStoriesModal} onClose={() => setShowStoriesModal(false)} fullScreen={isMobile}>
        <StoriesModal stories={stories} onClose={handlerClose} image={image} name={name} />
      </ModalCosntructor>
    </>
  )
}

export default ShopAvatar
