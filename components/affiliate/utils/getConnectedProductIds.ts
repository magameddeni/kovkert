export const getConnectedProductIds = (data: any, key: string) =>
  data.reduce(
    (acc: Record<string, boolean>, v: any) => ({
      ...acc,
      [v[key]]: true
    }),
    {}
  )
