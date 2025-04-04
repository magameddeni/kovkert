import React, { useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/router'
import { routes } from '@/constants'
import { useDebounce, useOutsideClick } from '@/hooks'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { clearSearchHistoryLocal, removeSearchHistoryItemLocal } from '@/redux/user/userSlice'
import { useLazyGetUserQuery } from '@/redux/user/userApi'
import { ILayoutSearchParams } from '@/components/layout/models'
import { SearchResultType } from '@/components/search/types'
import { ClearButton, SearchSkeleton } from '@/components/search/ui'
import { Button, Icon, Input, Text } from '@/components/UI'
import $api from '@/components/Http/axios'
import s from './styles.module.scss'
import AutocompleteList from '../AutocompleteList'
import SearchSuggestions from '../SearchSuggestions'
import CategorySuggestions from '../CategorySuggestions'

const SearchMobile = ({
  value = '',
  placeholder = 'Поиск',
  type = 'default',
  getSearchData,
  onClearSearch
}: ILayoutSearchParams) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFetching, setIsFetching] = useState(false)
  const [searchString, setSearchString] = useState<string>(value || '')
  const [result, setResult] = useState<SearchResultType>()
  const [inFocus, setInFocus] = useState(false)

  const [getUserInfo] = useLazyGetUserQuery()
  const { data: userData, searchHistoryLocal, isLoggedIn } = useAppSelector(({ beru }) => beru?.user)

  const debouncedSearch = useDebounce(searchString, 300)
  const ref = useOutsideClick(() => {
    setInFocus(false)
  })
  const router = useRouter()
  const dispatch = useAppDispatch()

  const searchHistory = (isLoggedIn ? userData?.searchHistory : searchHistoryLocal) || []
  const isTyped = inFocus && Boolean(debouncedSearch.trim())
  const isDefaultType = type === 'default'

  const goToSearchPage = async (searchPageValue?: string | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const searchValue = typeof searchPageValue === 'string' ? searchPageValue : searchString

    setInFocus(false)
    setSearchString(searchValue)

    if (!isDefaultType && getSearchData) {
      return getSearchData(searchValue)
    }

    await router.push(`${routes.SEARCH}?text=${searchValue}`)
  }

  const onClearButton = () => {
    setSearchString('')
    onClearSearch?.()
  }

  const onRemoveSearchHistoryItem = async (e?: React.ChangeEvent<HTMLElement>, removeSearchValue?: string) => {
    try {
      e?.stopPropagation()

      if (isLoggedIn) {
        if (removeSearchValue) {
          await $api.put('/api/v1.0/users/deleteSearchValue', { deletedValue: removeSearchValue })
        } else {
          await $api.put('/api/v1.0/users/deleteSearchValue', { deleteAll: true })
        }

        await getUserInfo({ initial: false })
      } else if (removeSearchValue) {
        dispatch(removeSearchHistoryItemLocal(removeSearchValue))
      } else {
        dispatch(clearSearchHistoryLocal())
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

  const goToCategoryPage = async (categoryId: string) => {
    await router.push(`${routes.CATEGORY}/${categoryId}`)
  }

  const renderSearchResult = () => {
    if (isFetching) {
      return <SearchSkeleton />
    }

    if (result) {
      const { categories, suggestions, words } = result

      return (
        <>
          {words && words.length > 0 && (
            <AutocompleteList words={words.slice(0, 3)} onWordClick={handleAutocompleteClick} />
          )}
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

  useEffect((): any => {
    if (inFocus) inputRef?.current?.focus()
    document.body.style.overflow = inFocus ? 'hidden' : 'visible'

    return () => (document.body.style.overflow = 'visible')
  }, [inFocus])

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

  if (inFocus) {
    return createPortal(
      <div className={s['search-wrapper']}>
        <div className={s['search-wrapper__top']}>
          <Icon name='arrow-left2' size='md' color='gray-dark' onClick={() => setInFocus(false)} />
          <Input
            autoFocus
            name='search'
            ref={inputRef}
            onChange={(e) => setSearchString(e.target.value)}
            onKeyUp={onKeyUp}
            placeholder={placeholder as string}
            value={searchString}
            view='light'
            fluid
          />
          {Boolean(debouncedSearch.length) && (
            <>
              <ClearButton onClick={onClearButton} marginRight />
              <Button onClick={goToSearchPage} className={s['button-search']}>
                Найти
              </Button>
            </>
          )}
        </div>
        {((!isTyped && Boolean(searchHistory?.length)) || isTyped) && (
          <ul className={s.result}>
            {!isTyped && Boolean(searchHistory?.length) && (
              <>
                <div className={s.result__item}>
                  <Text color='gray'>История поиска</Text>
                  <Text color='gray' onClick={() => onRemoveSearchHistoryItem()}>
                    Очистить
                  </Text>
                </div>
                {searchHistory.map((v: string) => (
                  <li key={v} className={cx(s.result__item, s.history)} onClick={() => goToSearchPage(v)}>
                    <div className={s['history-text']}>
                      <Icon name='history' color='gray-light' />
                      {v}
                    </div>
                    <ClearButton onClick={(e: React.ChangeEvent<HTMLElement>) => onRemoveSearchHistoryItem(e, v)} />
                  </li>
                ))}
              </>
            )}
            {isTyped && renderSearchResult()}
          </ul>
        )}
      </div>,
      document.getElementById('__next') as any
    )
  }

  return (
    <div className={s.search} ref={ref}>
      <Input
        className={s.search__seacrh}
        name='search-read-only'
        onFocus={() => setInFocus(true)}
        value={searchString ?? ''}
        placeholder={placeholder as string}
        type='text'
        view='base'
        readOnly
        fluid
      />
    </div>
  )
}

export default SearchMobile
