import React, { useEffect, useState } from 'react'

type Props = {
  maxRange: number
  setDue: (value: boolean | ((prevVar: boolean) => boolean)) => void
}

function Timer({ maxRange, setDue }: Props) {
  const [time, setTime] = useState(maxRange)

  useEffect(() => {
    if (time > 0) {
      setTimeout(() => setTime(time - 1), 1000)
    }
    if (time <= 0) {
      setDue(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time])

  return (
    <span>
      {Math.floor(time / 60) < 10 ? `0${Math.floor(time / 60)}` : Math.floor(time / 60)}:
      {time % 60 < 10 ? `0${time % 60}` : time % 60}
    </span>
  )
}

export default Timer
