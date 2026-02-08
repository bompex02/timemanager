import type { TimeRecord } from '@shared/types'

export const useTimeRecords = () => {
  const config = useRuntimeConfig()
  const API_BASE = config.public.baseApiUrl

  const formatDateKey = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const fetchRecordsForUser = async (userId: string): Promise<TimeRecord[]> => {
    const response = await fetch(`${API_BASE}/api/records/user/${userId}`)
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Einträge')
    }
    return response.json()
  }

  const fetchRecordsForDate = async (userId: string, date: Date): Promise<TimeRecord[]> => {
    const dateKey = formatDateKey(date)
    const records = await fetchRecordsForUser(userId)
    return records.filter((record) => formatDateKey(new Date(record.timestamp)) === dateKey)
  }

  return {
    formatDateKey,
    fetchRecordsForUser,
    fetchRecordsForDate,
  }
}
