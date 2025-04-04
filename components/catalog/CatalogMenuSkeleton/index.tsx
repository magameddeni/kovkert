import React from 'react'
import { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './styles.module.scss'

const sizes: Record<number, string> = {
  0: '55%',
  1: '80%',
  2: '60%',
  3: '88%',
  4: '82%',
  5: '71%',
  6: '55%',
  7: '45%',
  8: '65%',
  9: '90%'
}

const CatalogMenuSkeleton = () => {
  const renderItems = () =>
    Array.from({ length: 10 }, (_, i) => (
      <div className={styles.item} key={i} style={{ width: sizes[i] }}>
        <div className={styles.icon} />
        <div className={styles.name} />
      </div>
    ))

  return (
    <SkeletonTheme>
      <div className={styles.items}>{renderItems()}</div>
    </SkeletonTheme>
  )
}

export default CatalogMenuSkeleton
