import { useState } from 'react'

export const useLikeCount = ({
  likeCount = 0,
  dislikeCount = 0,
  like = false,
  dislike = false
}: {
  like?: boolean
  dislike?: boolean
  likeCount: number | any
  dislikeCount: number | any
}) => {
  const [currentLike, setCurrentLike] = useState(like)
  const [currentDislike, setCurrentDislike] = useState(dislike)
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount)
  const [currentDislikeCount, setCurrentDislikeCount] = useState(dislikeCount)

  const successLikeInteractHandler = (type: 'like' | 'dislike') => {
    if (type === 'like') {
      setCurrentLikeCount(!currentLike ? currentLikeCount + 1 : currentLikeCount - 1)
      setCurrentLike(!currentLike)
      if (currentDislike) {
        setCurrentDislike(!currentDislike)
        setCurrentDislikeCount(currentDislikeCount - 1)
      }
    } else {
      setCurrentDislikeCount(!currentDislike ? currentDislikeCount + 1 : currentDislikeCount - 1)
      setCurrentDislike(!currentDislike)
      if (currentLike) {
        setCurrentLike(!currentLike)
        setCurrentLikeCount(currentLikeCount - 1)
      }
    }
  }

  return { successLikeInteractHandler, currentDislike, currentLike, currentLikeCount, currentDislikeCount }
}
