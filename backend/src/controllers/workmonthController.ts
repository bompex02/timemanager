import type { WorkMonth, TimeRecord } from '@shared/types'
import { RecordType } from '@shared/types'
import { getDb } from '../lib/mongoClient.js'
import { getUserById } from './usersController.js'

type DbTimeRecord = Omit<TimeRecord, 'timestamp'> & { timestamp: Date | string }

// Helper to get date key in 'YYYY-MM-DD' format in local time
const getDateKeyLocal = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Controller to get WorkMonth summary for a user
export const getWorkMonthByUser = async (req, res, next) => {
  const { userId } = req.params
  const yearParam = req.query?.year
  const monthParam = req.query?.month

  const now = new Date()
  const year = yearParam ? parseInt(yearParam as string, 10) : now.getFullYear()
  let month = now.getMonth()

  if (monthParam) {
    const parsed = parseInt(monthParam as string, 10)
    if (Number.isNaN(parsed)) {
      return res.status(400).json({ message: 'Ungultiger month Parameter' })
    }
    if (parsed >= 1 && parsed <= 12)
      month = parsed - 1
    else if (parsed >= 0 && parsed <= 11)
      month = parsed
    else
      return res.status(400).json({ message: 'month muss 0-11 oder 1-12 sein' })
  }

  try {
    const db = await getDb()
    const startDate = new Date(year, month, 1, 0, 0, 0, 0)
    const endDate = new Date(year, month + 1, 1, 0, 0, 0, 0)

    // Fetch all time records for the user in the specified month
    const startIso = startDate.toISOString()
    const endIso = endDate.toISOString()

    const recordFilter = {
      userId,
      $or: [
        { timestamp: { $gte: startDate, $lt: endDate } },
        { timestamp: { $gte: startIso, $lt: endIso } },
      ],
    }

    const records = await db
      .collection<DbTimeRecord>('timeRecords')
      .find(recordFilter)
      .toArray()

    // get records grouped by day (YYYY-MM-DD)
    const recordsByDay = new Map<string, DbTimeRecord[]>()
    for (const record of records) {
      const timestamp = record.timestamp instanceof Date ? record.timestamp : new Date(record.timestamp)
      const key = getDateKeyLocal(timestamp)
      const bucket = recordsByDay.get(key) ?? []
      bucket.push({ ...record, timestamp })
      recordsByDay.set(key, bucket)
    }

    let hoursWorked = 0
    const user = await getUserById({ id: userId })
    const targetHoursPerWeek = user?.preferences?.targetHoursPerWeek ?? 40 // Default to 40 if not set
    const hoursPerDay = targetHoursPerWeek / 5 // Assuming 5 working days per week
    let hoursShouldWork = 0

    // Iterate through each day of the month
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day)
      const weekday = date.getDay()

      // Skip weekends
      if (weekday === 0 || weekday === 6) continue
      hoursShouldWork += hoursPerDay

      const dayKey = getDateKeyLocal(date)
      const dayRecords = recordsByDay.get(dayKey)
      if (!dayRecords || dayRecords.length === 0) continue

      // Sort records by timestamp
      const sorted = [...dayRecords].sort((a, b) => {
        const aTime = new Date(a.timestamp).getTime()
        const bTime = new Date(b.timestamp).getTime()
        return aTime - bTime
      })

      // Calculate worked hours for the day
      let dailyMilliseconds = 0
      for (let i = 0; i < sorted.length - 1; i += 2) {
        const start = sorted[i]
        const end = sorted[i + 1]
        if (start.recordType === RecordType.Einstempeln && end.recordType === RecordType.Ausstempeln) {
          const diff = new Date(end.timestamp).getTime() - new Date(start.timestamp).getTime()
          if (diff > 0)
            dailyMilliseconds += diff
        }
      }

      // Convert milliseconds to hours and add to total
      hoursWorked += dailyMilliseconds / (1000 * 60 * 60)
    }

    const result: WorkMonth = {
      userId,
      year,
      month,
      hoursWorked: Number(hoursWorked.toFixed(2)),
      hoursShouldWork: Number(hoursShouldWork.toFixed(2)),
    }

    res.json(result)
  } catch (error) {
    next(error)
  }
}
