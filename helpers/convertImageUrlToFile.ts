export const convertImageUrlToFile = async (url: string, fileName: string): Promise<File> => {
  const response = await fetch(url)
  const blob = await response.blob()

  return new File([blob], fileName, blob)
}
