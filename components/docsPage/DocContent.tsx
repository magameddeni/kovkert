import React from 'react'
import remarkGfm from 'remark-gfm'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import s from './docs.module.scss'

interface IDocContentProps {
  data: string | undefined
}

const DocContent = ({ data }: IDocContentProps) => {
  if (!data) return

  return (
    <div className={s['doc-content']}>
      <ReactMarkdown children={data} remarkPlugins={[remarkGfm]} />
    </div>
  )
}

export default DocContent
