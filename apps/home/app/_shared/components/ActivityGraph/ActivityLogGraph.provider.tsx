import { type PropsWithChildren, createContext, useContext, useMemo, useState } from 'react'

const ActivityLogGraphYearContext = createContext<
  | {
      selectedYear: number | undefined
      setSelectedYear: (year: number) => void
    }
  | undefined
>(undefined)

export const ActivityLogGraphProvider = ({ children }: PropsWithChildren) => {
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined)

  const yearContext = useMemo(
    () => ({
      selectedYear,
      setSelectedYear,
    }),
    [selectedYear],
  )

  return (
    <ActivityLogGraphYearContext.Provider value={yearContext}>
      {children}
    </ActivityLogGraphYearContext.Provider>
  )
}

export const useActivityLogGraphYear = () => {
  const context = useContext(ActivityLogGraphYearContext)

  if (context == null) {
    throw new Error('ActivityLogGraph components must be wrapped in <ActivityLogGraphProvider />')
  }

  return context
}
