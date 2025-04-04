import React from 'react'
import styles from './CatalogButton.module.scss'

type Props = {
  expand: boolean
  onClick: VoidFunction
}

const CatalogButton = ({ expand, onClick }: Props) => (
  <button aria-expanded={expand} className={styles.btn} onClick={onClick}>
    <span className={styles.btn__lines} />
    <span className={styles.btn__text}>Каталог</span>
  </button>
)

export default CatalogButton
