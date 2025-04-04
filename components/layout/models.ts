export interface ILayoutSearchParams {
  value?: string | undefined
  placeholder?: string | undefined
  type?: 'default' | 'shop'
  searchPrefix?: string | undefined
  getSearchData?: ((data: string) => void) | undefined
  onClearSearch?: VoidFunction | undefined
}
