import React from 'react'
import { Button, Text, Gap } from '@/components/UI'
import s from './styles.module.scss'

interface NoActiveProgramProps {}

const NoActiveProgram: React.FC<NoActiveProgramProps> = () => (
  <div className={s.NoActiveProgram}>
    <Text className={s.email__title} align='center' as='div'>
      У вас нет подключенных партнерских программ
    </Text>
    <Gap size={32} />
    <Button className={s.form__btn} onClick={() => {}}>
      Посмотреть доступные
    </Button>
  </div>
)

export default NoActiveProgram
