const baseSessionError = 'Перейдите в корзину для повторного оформления заказа.'

export const enhastedCheckoutErrorMessage = (message?: string) => `${message ?? ''}\n${baseSessionError}`
