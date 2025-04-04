import React from 'react'
import styles from './styles/chip.module.scss'

interface ChipProps {
  label: string
}

const Chip = ({ label }: ChipProps) => (
  <div className={styles.chip}>
    <span className={styles.chip__label}>{label}</span>
  </div>
)

export default Chip
