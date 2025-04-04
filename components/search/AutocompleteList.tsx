import React from 'react'
import { Chip } from '../UI' // Assuming Chip is in the same directory or adjust the path accordingly
import s from './autocompleteList.module.scss' // CSS Module for styling

interface AutocompleteListProps {
  words: string[]
  onWordClick: (word: string) => void
}

const AutocompleteList: React.FC<AutocompleteListProps> = ({ words, onWordClick }) => (
  <ul className={s.words_list}>
    {words.map(
      (item) =>
        item && (
          <li key={item} className={s.words_list__word} onClick={() => onWordClick(item)}>
            <Chip label={item} />
          </li>
        )
    )}
  </ul>
)

export default AutocompleteList
