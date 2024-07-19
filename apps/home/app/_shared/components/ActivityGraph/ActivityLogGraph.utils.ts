import dayjs from 'dayjs'

export const getDateRange = (selectedYear?: number) => {
  const today = dayjs()
  const startDate = selectedYear
    ? today.year(selectedYear).startOf('year')
    : today.subtract(1, 'year').startOf('week')
  const endDate = selectedYear ? today.year(selectedYear).endOf('year') : today

  return [startDate, endDate] as const
}
