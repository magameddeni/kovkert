import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import cx from 'classnames'
import { useAppSelector } from '@/redux/hook'
import { useWindowSize, useQueryParams } from '@/hooks'
import { scrollToTop } from '@/helpers'
import { useMessengerContext } from './MessengerContext'
import { SearchChat } from './chats/searchChat'
import { Chats } from './chats'
import { Messenger } from './messenger'
import { IChat } from './types'
import s from './chat.module.scss'

interface IChatProps {
  className?: string
  arrowBack?: boolean
}

const Chat = ({ className, arrowBack }: IChatProps) => {
  const [activeDialog, setActiveDialog] = useState(null)
  const [searchDialogsResult, setSearchDialogsResult] = useState<IChat | null>(null)
  const { typingDialogs, dialogs, loading, setPending }: any = useMessengerContext()
  const {
    query: { activeChat }
  } = useRouter()
  const { isSmall } = useWindowSize()
  const { setQuery } = useQueryParams()
  const auth = useAppSelector(({ beru }) => beru.user)

  const onClickChat = useCallback(async (value: string) => {
    await setQuery({ activeChat: value })
    scrollToTop()
  }, [])

  useEffect(() => {
    setActiveDialog(dialogs.find((dialog: any) => dialog._id === activeChat))
  }, [activeChat, dialogs])

  useEffect(() => setPending([]), [activeChat])

  return (
    <div className={cx(s.chat, className)}>
      {(!isSmall || !activeDialog) && (
        <div className={s.chat__chats}>
          {Boolean(dialogs?.length) && (
            <SearchChat
              disabled={loading}
              dialogs={dialogs}
              setSearchDialogsResult={setSearchDialogsResult}
              arrowBack={arrowBack}
            />
          )}
          <Chats
            activeChat={activeDialog}
            chats={searchDialogsResult ? [searchDialogsResult] : dialogs}
            loading={loading}
            typingDialogs={typingDialogs}
            onSelectDialog={onClickChat}
          />
        </div>
      )}
      {(!isSmall || activeDialog) && (
        <div className={s.chat__messenger}>
          <Messenger loading={loading} conversationId={activeChat} user={auth?.data} />
        </div>
      )}
    </div>
  )
}

export default Chat
