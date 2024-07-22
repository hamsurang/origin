type Year = `${number}${number}${number}${number}`
type Month = `0${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | `1${0 | 1 | 2}`
type Day = `0${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | `${1 | 2}${number}` | `3${0 | 1}`

type YYYY_MM_DD = `${Year}-${Month}-${Day}`

export type ActivityLogProps = {
  logs: {
    startDate: YYYY_MM_DD
    endDate: YYYY_MM_DD
    contents: string
  }[]
}
