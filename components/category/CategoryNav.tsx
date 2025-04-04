import React from 'react'
import { TCategory } from '@/models'
import { Crumb } from '@/components/UI'
import CategoryNavBlock from './CategoryNavBlock'

export interface CategoryNavProps {
  category: TCategory | TCategory[]
  onCategoryClick?: ((id: string, name: string) => void) | undefined
  asLink?: boolean | string | undefined
  subKey?: 'sub' | 'categories' | undefined
  prevCategoryLink?: string | undefined
}

const CategoryNav = ({
  category,
  onCategoryClick,
  asLink = true,
  subKey = 'sub',
  prevCategoryLink
}: CategoryNavProps) => {
  const categoryAsArray = Array.isArray(category)
  const categoryData: TCategory[] | undefined | any = categoryAsArray ? category : category?.[subKey]

  if (!categoryData) return null

  const someCategoryHasChild = categoryData?.some((v: TCategory) => v?.[subKey]?.length)

  return categoryData?.length ? (
    <div>
      {categoryData.map((v: TCategory) => (
        <CategoryNavBlock
          key={v._id}
          categories={v}
          hasChildCategories={someCategoryHasChild}
          onCategoryClick={onCategoryClick}
          asLink={asLink}
          subKey={subKey}
        />
      ))}
    </div>
  ) : prevCategoryLink ? (
    <Crumb text='Назад' href={prevCategoryLink} linkStyle={{ display: 'flex' }} leftArrow />
  ) : null
}

export default CategoryNav
