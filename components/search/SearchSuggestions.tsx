import React from 'react'
import s from './searchSuggestions.module.scss'

interface SearchSuggestion {
  value: string
  text: string
}

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[]
  onSuggestionClick: (value: string) => void
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ suggestions, onSuggestionClick }) => (
  <ul className={s.suggestions}>
    {suggestions.map((item) => (
      <li key={item.value} className={s.suggestions__item} onClick={() => onSuggestionClick(item.value)}>
        <div dangerouslySetInnerHTML={{ __html: item.text }} />
      </li>
    ))}
  </ul>
)

export default SearchSuggestions
