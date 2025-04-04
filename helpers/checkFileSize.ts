export const checkFileSize = (file: File | null, checkSize: number) => {
  if (!file) return file
  return file.size > checkSize * (1024 * 1024)
}
