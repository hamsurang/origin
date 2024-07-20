export type ActivityLog = {
  startDate: string
  endDate: string
  contents: string
}

export type ActivityLogGraphProps = {
  logs: ActivityLog[]
}
