export const formatOrderTime = (time: number): string => {
  const minutes = Math.floor((time % 3600) / 60)
  const seconds = time % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
