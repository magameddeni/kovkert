import React from 'react'

import { IProduct } from '@/models'
import styles from './ProductСharacteristics.module.scss'
import Button from '../UI/button/Button'

type Props = {
  count?: number
  data: IProduct['characteristics']
  onScrollTo?: VoidFunction
}

function ProductCharacteristics({ count = 2, data, onScrollTo }: Props) {
  const items = data.slice(0, count)

  const showBtnMore = count < data.length

  const renderItems = () =>
    items.map((item) => {
      if (item.value.length > 0)
        return (
          <dl key={item._id} className={styles.dl}>
            <dt className={styles.dt}>
              <span> {item.title}</span>
            </dt>
            <div className={styles.dd}>
              {item.value.map((value, index) => (
                <dd key={value} className={styles.dd}>
                  {value}
                  {index !== item.value.length - 1 && ',  '}
                </dd>
              ))}
            </div>
          </dl>
        )
    })

  return (
    <div className={styles.container}>
      <div className={styles.container__items}>{renderItems()}</div>

      {showBtnMore && (
        <Button view='link' onClick={() => onScrollTo?.()}>
          Все характеристики{' '}
        </Button>
      )}
    </div>
  )
}

export default ProductCharacteristics
