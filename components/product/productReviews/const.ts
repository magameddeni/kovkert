import { ISelectOption } from '@/components/UI'
import { SortType } from './model'

export const sorList: Array<ISelectOption<SortType>> = [
  { label: 'По полезности', value: SortType.POPULATE },
  { label: 'Новые', value: SortType.DATE_ASC },
  { label: 'Старые', value: SortType.DATE_DESC },
  { label: 'Лучшие оценки', value: SortType.VALUE_ASC },
  { label: 'Худшие оценки', value: SortType.VALUE_DESC }
]
