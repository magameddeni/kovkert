import React from 'react'
import { Button, Text } from '@/components/UI'
import { useRouter } from 'next/router'

import s from './help_section.module.scss'

interface HelpSectionProps {
  questions: { title: string; to: string }[]
}

const HelpSection: React.FC<HelpSectionProps> = ({ questions }) => {
  const router = useRouter()
  return (
    <div className={s.helper}>
      <Text className={s.helper__title} as='div'>
        Помощь
      </Text>

      <div className={s.helper__questions}>
        {questions.map((item) => (
          <Button key={item.title} view='link' className={s.helper__question} onClick={() => router.push(item.to)}>
            {item.title}
          </Button>
        ))}
      </div>

      {/* <div className={s.helper__ask_btn}>
        <Button className={s['helper__ask-question']}>Задать вопрос</Button>
      </div> */}
    </div>
  )
}

export default HelpSection
