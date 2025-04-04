import React from 'react'
import s from './categorySuggestions.module.scss'
import { CategorySuggestion } from './types'

interface CategorySuggestionProps {
  categories: CategorySuggestion[]
  onCategoryClick: (value: string) => void
}

const CategorySuggestions: React.FC<CategorySuggestionProps> = ({ categories, onCategoryClick }) => (
  <ul className={s['category-suggestions']}>
    {categories.map(({ _id, name }) => (
      <li className={s['category-suggestions__item']} key={_id} onClick={() => onCategoryClick(_id)}>
        <span className={s['category-suggestions__item__title']}>Категория</span>
        <span className={s['category-suggestions__item__name']}>{name}</span>
      </li>
    ))}
  </ul>
)

export default CategorySuggestions
