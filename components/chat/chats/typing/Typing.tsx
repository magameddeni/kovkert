import React from 'react'
import s from './typing.module.scss'

const Typing = () => (
  <div className={s.typing}>
    печатает <span className={s.typing__ellipsis} />
  </div>
)

export default Typing
