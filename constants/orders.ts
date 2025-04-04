export const statusButtonColors = {
  Создан: { background: '#FFECD9', color: '#FF8615' },
  Оплачено: { background: '#EAFBED', color: '#37B379' },
  'В сборке': { background: '#D5EEFF', color: '#3A96D8' },
  'В доставке': { background: '#F0E5FF', color: '#A056FF' },
  Доставлено: { background: '#E8EBED', color: '#8D989D' },
  'Отменено покупателем': { background: '#FFEEEE', color: '#FF6464' },
  'Отменено продавцом': { background: '#FFD9E2', color: '#E74067' }
} as Record<
  string,
  {
    background: string
    color: string
  }
>
