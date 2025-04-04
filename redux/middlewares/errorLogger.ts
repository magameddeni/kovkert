import { isRejectedWithValue } from '@reduxjs/toolkit'
import * as Sentry from '@sentry/nextjs'

import type { MiddlewareAPI, Middleware } from '@reduxjs/toolkit'

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    Sentry.captureException(action)
  }

  return next(action)
}
