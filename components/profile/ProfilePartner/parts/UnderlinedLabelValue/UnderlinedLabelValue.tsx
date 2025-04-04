import React from 'react'

import { Text } from '@/components/UI'
import s from './styles.module.scss'

interface UnderlinedLabelValueProps {
  label: string
  value: string
}

const UnderlinedLabelValue: React.FC<UnderlinedLabelValueProps> = ({ label, value }) => (
  <div className={s.UnderlinedLabelValue}>
    <Text size='xxs' color='gray' weight='medium' family='secondary'>
      {label}
    </Text>
    <div className={s.UnderlinedLabelValue__underlineDivider} />
    <Text size='xxs' family='secondary'>
      {value}
    </Text>
  </div>
)

export default UnderlinedLabelValue
