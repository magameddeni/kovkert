import { routes } from '@/constants'
import { IDeviceWidth } from '@/hooks'

type Routes = Partial<Record<keyof typeof routes, boolean>>

interface LayoutRules {
  feature: {
    freeLayout: Routes
  }
  deviceWidth: Partial<
    Record<
      IDeviceWidth,
      {
        mobileHeader: Routes
      }
    >
  >
}

export const layoutRules: LayoutRules = {
  feature: {
    freeLayout: {
      [routes.CHAT]: true,
      [routes.CHECKOUT]: true,
      [routes.CHECKOUT_SUCCESS]: true,
      [routes.REVIEWS]: true
    }
  },
  deviceWidth: {
    medium: {
      mobileHeader: {
        [routes.SHOP_SLUG]: true
      }
    }
  }
}
