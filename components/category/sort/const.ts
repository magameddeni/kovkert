import { ISelectOption } from '@/components/UI'
import { SortType } from './model'

export const sortList: Array<ISelectOption<SortType>> = [
  { label: 'Рядом', value: SortType.LOCATION },
  // { label: 'Рейтинг', value: SortType.POPULAR },
  { label: 'Дороже', value: SortType.PRICE_DESC },
  { label: 'Дешевле', value: SortType.PRICE_ASC }
]
