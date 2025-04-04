export type TSubCategory = {
  parent?: TCategory | TSubCategory
  categories?: TCategory[]
  haSubcategories?: boolean
  name: string
  _id: string
}

export type TCategory = {
  parent?: TCategory | TSubCategory
  categories?: TSubCategory[]
  haSubcategories?: boolean
  icon?: string
  img: string
  key: string
  name: string
  nesting?: number
  prev?: TSubCategory
  sub?: TSubCategory[] | TCategory[]
  __v?: number
  _id: string
}

export interface IFilter {
  key: string
  title: string
  type: string
  values: string[]
}

export interface IFilterSlider {
  key: string
  max?: number
  min?: number
  title: string
  type: string
}
