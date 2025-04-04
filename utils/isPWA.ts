const checkStandAloneQuery = () => {
  const url = new URL(window.location.href)
  const params = new URLSearchParams(url.search)
  return params.has('mode') && params.get('mode') === 'standalone'
}

export const isPWA = () =>
  checkStandAloneQuery() ||
  // @ts-ignore
  window.navigator.standalone ||
  ['standalone'].some((displayMode) => window.matchMedia(`(display-mode: ${displayMode})`).matches)
