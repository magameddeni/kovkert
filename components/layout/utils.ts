import { DEFAULT_RUSSIAN_KOVKERT_KEYWORDS, routes } from '@/constants'
import { IDeviceWidth } from '@/hooks'
import { layoutRules } from '@/components/layout/const'

type Routes = keyof typeof routes

export const isFreeLayout = (route: Routes | string) => layoutRules.feature.freeLayout[route as Routes] ?? false

export const isMobileHeader = (route: Routes | string, width: IDeviceWidth) =>
  layoutRules.deviceWidth[width]?.mobileHeader[route as Routes] ?? false

export const enhastedKeywords = (keywords: string) =>
  keywords ? `${keywords}, ${DEFAULT_RUSSIAN_KOVKERT_KEYWORDS}` : DEFAULT_RUSSIAN_KOVKERT_KEYWORDS
