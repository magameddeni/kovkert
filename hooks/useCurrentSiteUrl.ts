export const useCurrentSiteUrl = (url = '') => {
  const origin = (typeof window !== 'undefined' && window.location.origin) ?? ''

  return {
    siteUrl: `${origin}${url}`
  }
}
