import { type PropsWithChildren, createContext, useContext, useMemo, useState } from 'react'

const ActivityLogYearContext = createContext<
  | {
      selectedYear: number | undefined
      setSelectedYear: (year: number) => void
    }
  | undefined
>(undefined)

export const ActivityLogProvider = ({ children }: PropsWithChildren) => {
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined)

  const yearContext = useMemo(
    () => ({
      selectedYear,
      setSelectedYear,
    }),
    [selectedYear],
  )

  return (
    <ActivityLogYearContext.Provider value={yearContext}>
      {children}
    </ActivityLogYearContext.Provider>
  )
}

export const useActivityLogYear = () => {
  const context = useContext(ActivityLogYearContext)

  if (context == null) {
    throw new Error('ActivityLog components must be wrapped in <ActivityLogProvider />')
  }

  return context
}
