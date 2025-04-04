export type SearchResultType = {
  suggestions: SearchSuggestion[]
  words: string[]
  categories: CategorySuggestion[]
}

export type CategorySuggestion = {
  name: string
  _id: string
}

export type SearchSuggestion = {
  value: string
  text: string
}
