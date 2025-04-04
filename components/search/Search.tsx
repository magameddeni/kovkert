import React, { useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { useRouter } from 'next/router'
import { routes } from '@/constants'
import { useDebounce, useOutsideClick, useWindowSize } from '@/hooks'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { useLazyGetUserQuery } from '@/redux/user/userApi'
import { removeSearchHistoryItemLocal } from '@/redux/user/userSlice'
import { SearchResultType } from '@/components/search/types'
import { ClearButton, SearchSkeleton } from '@/components/search/ui'
import { Button, Icon, Input, Text } from '@/components/UI'
import { ILayoutSearchParams } from '@/components/layout/models'
import $api from '@/components/Http/axios'
import s from './search.module.scss'
import AutocompleteList from './AutocompleteList'
import SearchSuggestions from './SearchSuggestions'
import CategorySuggestions from './CategorySuggestions'

const Search = ({
  value = '',
  placeholder = 'Поиск',
  type = 'default',
  searchPrefix,
  getSearchData,
  onClearSearch
}: ILayoutSearchParams) => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { text } = router.query
  const searchTermFromQuery = typeof text === 'string' && text
  const [isFetching, setIsFetching] = useState(false)
  const [searchString, setSearchString] = useState<string>(value || searchTermFromQuery || '')
  const [result, setResult] = useState<SearchResultType>()
  const [inFocus, setInFocus] = useState(false)
  const [searchType, setSearchType] = useState(type)
  const [currentPlaceholder, setCurrentPlaceholder] = useState<string>(placeholder as string)

  const [getUserInfo] = useLazyGetUserQuery()
  const { data: userData, searchHistoryLocal, isLoggedIn } = useAppSelector(({ beru }) => beru?.user)

  const { isLarge } = useWindowSize()
  const debouncedSearch = useDebounce(searchString, 300)
  const ref = useOutsideClick(() => {
    setInFocus(false)
  })

  const searchHistory = (isLoggedIn ? userData?.searchHistory : searchHistoryLocal) || []
  const isTyped = inFocus && Boolean(debouncedSearch.trim())
  const isDefaultType = searchType === 'default'

  const inputRef = useRef<HTMLInputElement | null>(null)

  const goToSearchPage = async (searchPageValue?: string | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const searchValue = typeof searchPageValue === 'string' ? searchPageValue : searchString

    setInFocus(false)
    setSearchString(searchValue)

    if (!isDefaultType && getSearchData) {
      return getSearchData(searchValue)
    }

    await router.push({
      pathname: routes.SEARCH,
      query: {
        text: searchValue
      }
    })
  }

  const goToCategoryPage = async (categoryId: string) => {
    await router.push(`${routes.CATEGORY}/${categoryId}`)
  }

  const handleAutocompleteClick = (suggestion: string) => {
    const completedWords = searchString.split(/\s+/)
    const lastWordIndex = completedWords.length - 1
    const lastWord = completedWords[lastWordIndex]
    const suggestionConcatSpace = suggestion.concat(' ')
    const lastWordCompleted = lastWord.endsWith(' ')

    if (lastWordCompleted) {
      setSearchString([...completedWords, suggestionConcatSpace].join(' '))
      return
    }
    completedWords[lastWordIndex] = suggestionConcatSpace
    setSearchString(completedWords.join(' '))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value)
  }

  const onRemoveSearchHistoryItem = async (e: React.ChangeEvent<HTMLElement>, removeSearchHValue: string) => {
    try {
      e.stopPropagation()

      if (isLoggedIn) {
        await $api.put('/api/v1.0/users/deleteSearchValue', { deletedValue: removeSearchHValue })
        await getUserInfo({ initial: false })
      } else {
        dispatch(removeSearchHistoryItemLocal(removeSearchHValue))
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onKeyUp = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      await goToSearchPage()
    }
  }

  const onClearButton = () => {
    setSearchString('')
    onClearSearch?.()
  }

  const onChangeSearchType = () => {
    setSearchType('default')
    setCurrentPlaceholder('Поиск')
  }

  const renderSearchResult = () => {
    if (isFetching) {
      return <SearchSkeleton />
    }

    if (result) {
      const { categories, suggestions, words } = result

      return (
        <>
          {words && words.length > 0 && <AutocompleteList words={words} onWordClick={handleAutocompleteClick} />}
          {suggestions && suggestions.length > 0 && (
            <SearchSuggestions suggestions={suggestions} onSuggestionClick={goToSearchPage} />
          )}
          {categories && categories.length > 0 && (
            <CategorySuggestions categories={categories} onCategoryClick={goToCategoryPage} />
          )}
        </>
      )
    }

    return <div className={s['not-result']}>По вашему запросу ничего не найдено</div>
  }

  useEffect(() => {
    if (debouncedSearch.trim()) {
      setIsFetching(true)
      $api
        .post(`/api/products/search`, { searchTerm: searchString.replace(/\s+/g, ' ') })
        .then((res) => setResult(res.data))
        .finally(() => setIsFetching(false))
    } else {
      setResult(undefined)
    }
  }, [debouncedSearch])

  return (
    <>
      {inFocus && <div className={s['search-overlay']} />}
      <div className={s.search} ref={ref}>
        {(inFocus || isTyped) && (
          <ul className={cx(s.result, { [s['has-data']]: searchHistory?.length || isTyped })}>
            {Boolean(searchHistory?.length) &&
              searchString.length === 0 &&
              searchHistory.map((v: string) => (
                <li key={v} className={cx(s.result__item, s.history)} onClick={() => goToSearchPage(v)}>
                  <div className={s['history-text']}>
                    <Icon name='history' color='gray-light' />
                    {v}
                  </div>
                  <ClearButton onClick={(e: React.ChangeEvent<HTMLElement>) => onRemoveSearchHistoryItem(e, v)} />
                </li>
              ))}
            {isTyped && renderSearchResult()}
          </ul>
        )}
        <div className={cx(s.form, { [s['in-focus']]: inFocus })}>
          {isLarge && !isDefaultType && (
            <div className={s.left}>
              <div className={s['form__shop-label']}>
                <Text color='blue' family='secondary' whiteSpace='nowrap'>
                  {searchPrefix}
                </Text>
                <Icon name='close' color='blue' size='sm' onClick={onChangeSearchType} />
              </div>
            </div>
          )}
          <Input
            name='search'
            ref={inputRef}
            className={s.form__input}
            onFocus={() => setInFocus(true)}
            onChange={handleInputChange}
            onKeyUp={onKeyUp}
            placeholder={currentPlaceholder}
            value={searchString}
            autoComplete='off'
            fluid
          />
          {isLarge && (
            <div className={s.right}>
              {isTyped && <ClearButton onClick={onClearButton} marginRight />}
              <Button className={s.form__button} onClick={goToSearchPage} disabled={!searchString.trim()}>
                Найти
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Search
