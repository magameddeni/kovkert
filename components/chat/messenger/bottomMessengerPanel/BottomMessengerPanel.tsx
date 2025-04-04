import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import cx from 'classnames'
import { useMessengerContext } from '@/components/chat/MessengerContext'
import { Icon, Textarea } from '@/components/UI'
import s from './bottom-messenger-panel.module.scss'

interface IBottomMessengerPanelProps {
  onSendMessage: (message: any, file?: File | null) => void
  onInput: VoidFunction
}

const BottomMessengerPanel = ({ onSendMessage, onInput }: IBottomMessengerPanelProps) => {
  const [message, setMessage] = useState('')
  // const [file, setFile] = useState<any>(null)
  const { sendLoading }: any = useMessengerContext()
  const inputRef = useRef<HTMLInputElement | null>(null)
  // const fileRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()

  // const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (e?.target?.files?.[0]) setFile(e.target?.files[0])
  // }

  const onChange = (e: any) => {
    setMessage(e.target.value)
    onInput()
  }

  const onKeyDown = (e: any, buttonSend: boolean = false) => {
    if (((!e.shiftKey && e.keyCode === 13) || buttonSend) && message.trim().length) {
      onSendMessage(message.trim())
      setMessage('')
      e.preventDefault()
    }
  }

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
    return () => setMessage('')
  }, [inputRef, router.query.to])

  // useEffect(() => {
  //   if (file) {
  //     onSendMessage(message, file)
  //     if (fileRef.current) fileRef.current.value = ''
  //   }
  // }, [file])

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [sendLoading])

  return (
    <div className={s['bottom-messenger-panel']}>
      {/* <label htmlFor='file' className={s['bottom-messenger-panel__attache']}> */}
      {/*  <input accept='image/*' hidden id='file' type='file' ref={fileRef} onChange={handleFileChange} /> */}
      {/*  <Icon name='attache' /> */}
      {/* </label> */}
      <Textarea
        rows={1}
        name='message'
        className={s['bottom-messenger-panel__input']}
        value={message}
        placeholder='Сообщение...'
        onChange={onChange}
        onKeyDown={onKeyDown}
        view='light'
        autoHeight
        fluid
      />
      <div className={cx(s['bottom-messenger-panel__send'], { [s.active]: message })}>
        <Icon name='send' color='white' onClick={(e) => onKeyDown(e, true)} disable={!message} />
      </div>
    </div>
  )
}

export default BottomMessengerPanel
