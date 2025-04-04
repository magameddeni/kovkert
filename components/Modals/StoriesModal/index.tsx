import React, { useEffect, useMemo } from 'react'
import Stories from 'react-insta-stories'
import Image from 'next/image'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppSelector } from '@/redux/hook'
import ArrowLeft from '../../../public/ArrowFrame.svg'
import styles from './StoriesModal.module.scss'
import useMediaQuery from '../../Hooks/useMediaQuery'
import useTimeHook from '../../Hooks/useTimeHook'
import { lookedUserStories } from '../../services/mutateData'

function Story({ action, story, onClose, isMobile, name, image }: any) {
  useEffect(() => {
    action('play')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { day, monthLong, yearLong, hour, minute } = useTimeHook(story.createdAt)

  return (
    <>
      <div className={styles.modal__header}>
        {isMobile && (
          <div className={styles.arrowLeft} onClick={onClose}>
            <ArrowLeft />
          </div>
        )}
        <div className={styles.avatar}>
          <Image width={30} height={30} src={image} alt='' />
        </div>
        <div className={styles.info}>
          <div className={styles.nick}>{name}</div>
          <div className={styles.createdDate}>
            {day} {monthLong} {yearLong} {`${hour}:${minute}`}
          </div>
        </div>
      </div>
      <img
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center'
        }}
        src={story.url}
        alt=''
      />
    </>
  )
}

function StoriesModal({ stories, onClose, image, name }: any) {
  const isMobile = useMediaQuery('( max-width: 850px )')
  const { id }: any = useAppSelector(({ beru }) => beru.user.data)

  const client = useQueryClient()

  const mutation = useMutation({
    mutationFn: lookedUserStories,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['get_stories_subscription'] })
    }
  })

  const startShowStories = (event: any) => {
    if (!stories[event].looked.includes(id)) {
      mutation.mutate({ story: stories[event] })
    }
  }

  const items = useMemo(
    () =>
      stories.map((story: any) => ({
        content: ({ action }: any) => (
          <Story action={action} story={story} isMobile={isMobile} name={name} onClose={onClose} image={image} />
        )
      })),
    [stories]
  )

  return (
    <div className={styles.modal}>
      <>
        <Stories
          onStoryStart={startShowStories}
          stories={items}
          onAllStoriesEnd={onClose}
          keyboardNavigation
          width={isMobile ? '100%' : '360px'}
          height={isMobile ? '100%' : '640px'}
        />
      </>
    </div>
  )
}

export default React.memo(StoriesModal)
