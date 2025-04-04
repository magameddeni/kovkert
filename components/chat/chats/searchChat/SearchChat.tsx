import React, { FC } from 'react'
import { useRouter } from 'next/router'
import { Icon, Input } from '@/components/UI'
import { IChat } from '../../types'
import s from './search-chat.module.scss'

interface ISearchChatProps {
  disabled?: boolean
  dialogs: IChat[]
  setSearchDialogsResult: (payload: IChat | null) => void
  arrowBack?: boolean
}

const SearchChat: FC<ISearchChatProps> = ({ disabled = false, dialogs, setSearchDialogsResult, arrowBack = true }) => {
  const router = useRouter()

  const findChat = (e: any) => {
    if (e.target.value.length)
      dialogs.forEach((dialog) => {
        const regex = new RegExp(e.target.value.toUpperCase())
        const found = dialog.companion.name.toUpperCase().match(regex)
        if (found && found[0]?.length) setSearchDialogsResult(dialog)
      })
    else setSearchDialogsResult(null)
  }

  return (
    <div className={s['search-chat']}>
      {arrowBack && <Icon name='arrow-left2' className={s['search-chat__icon']} onClick={() => router.back()} />}
      <Input
        onChange={findChat}
        name='search-chat'
        className={s['search-chat__input']}
        placeholder='Поиск'
        disabled={disabled}
        view='light'
        fluid
      />
    </div>
  )
}

export default SearchChat
