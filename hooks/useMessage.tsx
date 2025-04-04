import React from 'react'
import { Slide, toast, ToastOptions } from 'react-toastify'

type MessageTypes = 'success' | 'error' | 'loading' | 'info'

export const useMessage = (
  value: string | React.ReactNode,
  type: MessageTypes = 'success',
  title: string | null = '',
  params: object = {}
) => {
  const defaultParams = {
    position: 'top-center',
    transition: Slide,
    hideProgressBar: true,
    type: type || 'success',
    ...params
  } as ToastOptions

  const defaultTitles = {
    success: 'Успех!',
    error: 'Ошибка',
    loading: '',
    info: ''
  } as Record<MessageTypes, string>

  const ToastifyValue = () => (
    <div className='toastify-value'>
      {title !== null && <p className='toastify-value__title'>{title || defaultTitles[type]}</p>}
      <p className='toastify-value__value'>{value}</p>
    </div>
  )

  return toast(<ToastifyValue />, defaultParams)
}
