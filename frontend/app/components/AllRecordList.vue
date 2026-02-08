<template>
  <section class="rounded-xl bg-surface-200 p-6 shadow-sm shadow-surface-300 ring-1 ring-surface-300/40">
    <div class="flex flex-col gap-1">
      <h2 class="text-xl font-semibold text-text-100">
        {{ t('dashboardRecordsTitle') }}
      </h2>
      <p class="text-sm text-text-300">
        {{ t('dashboardRecordsSubtitle') }}
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="mt-6 flex justify-center py-8">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-surface-300 border-t-text-100"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="mt-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ error }}
    </div>

    <!-- Records List -->
    <div v-else-if="hasRecords" class="mt-6 max-h-150 overflow-y-auto pr-2">
      <div v-for="(records, dateKey, index) in displayGroupedRecords" :key="dateKey">
        <div v-if="index !== 0" class="my-4 border-t border-surface-300"></div>

        <div class="flex flex-wrap items-center gap-3">
          <h3 class="text-lg font-semibold text-text-100">
            {{ formatFullDate(dateKey) }}
          </h3>
          <span
            class="rounded-full px-3 py-1 text-xs font-semibold"
            :class="getHomeOfficeStatusClass(dateKey)"
          >
            {{ getHomeOfficeStatusLabel(dateKey) }}
          </span>
        </div>

        <ul class="mt-3 space-y-2">
          <li
            v-for="(record, recIndex) in records"
            :key="recIndex"
            class="flex items-center justify-between rounded-lg border border-surface-300 px-3 py-2 text-sm"
          > 
            <span class="text-text-200">{{ formatRecordType(record.recordType) }}</span>
            <span class="text-text-300">{{ formatTime(record.timestamp) }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Empty State -->
    <p v-else class="mt-6 rounded-lg border border-dashed border-surface-300 px-4 py-6 text-center text-text-300">
      {{ t('dashboardRecordsEmpty') }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { type TimeRecord, RecordType } from '@shared/types'
import { useUserStore } from '~/stores/user-store'
const { t } = useI18n()

const props = defineProps<{
  dateKey?: string
}>()

const config = useRuntimeConfig()
const userStore = useUserStore()

const sortedGroupedRecords = ref<Record<string, TimeRecord[]>>({})
const homeOfficeStatusMap = ref<Record<string, boolean>>({})
const loading = ref(true)
const error = ref<string | null>(null)

const API_BASE = config.public.baseApiUrl

// checks if there are any records
const displayGroupedRecords = computed(() => {
  if (!props.dateKey)
    return sortedGroupedRecords.value
  const records = sortedGroupedRecords.value[props.dateKey]
  return records ? { [props.dateKey]: records } : {}
})

const hasRecords = computed(() => Object.keys(displayGroupedRecords.value).length > 0)

// helper function to convert string to Date
const toDate = (value: string | Date): Date => {
  return value instanceof Date ? value : new Date(value)
}

// helper function to format date as YYYY-MM-DD
const formatDateKey = (date: Date): string => {
  return date.toISOString().slice(0, 10)
}

// format full date in German locale
const formatFullDate = (dateKey: string): string => {
  const date = new Date(dateKey)
  return date.toLocaleDateString('de-DE', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  })
}

// format time in HH:MM format
const formatTime = (value: string | Date): string => {
  const date = toDate(value)
  return date.toLocaleTimeString('de-DE', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const getHomeOfficeStatusLabel = (dateKey: string): string => {
  return homeOfficeStatusMap.value[dateKey]? t('dashboardHomeOffice') : t('dashboardOffice')
}

const getHomeOfficeStatusClass = (dateKey: string): string => {
  return homeOfficeStatusMap.value[dateKey] 
    ? 'bg-emerald-500/15 text-emerald-600' 
    : 'bg-sky-500/15 text-sky-600'
}

// format record type label
const formatRecordType = (recordType: string): string => {
  switch (recordType) {
    case RecordType.Einstempeln:
      return t('recordTypeEinstempeln')
    case RecordType.Ausstempeln:
      return t('recordTypeAusstempeln')
    default:
      return recordType
  }
}

// returns records grouped by date and sorted within each group
const groupAndSortRecords = (records: TimeRecord[]): Record<string, TimeRecord[]> => {
  const grouped: Record<string, TimeRecord[]> = {}

  for (const record of records) {
    const dateKey = formatDateKey(toDate(record.timestamp))
    ;(grouped[dateKey] ??= []).push(record)
  }

  Object.values(grouped).forEach(group => {
    group.sort((a, b) => toDate(a.timestamp).getTime() - toDate(b.timestamp).getTime())
  })

  return Object.fromEntries(
    Object.entries(grouped).sort(
      ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
    )
  )
}

// fetch all time records for user
const getTimeRecordsForUser = async (userId: string): Promise<TimeRecord[]> => {
  const response = await fetch(`${API_BASE}/api/records/user/${userId}`)
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unbekannter Fehler')
    throw new Error(`Fehler beim Laden der Einträge: ${errorText}`)
  }
  
  return response.json()
}

const getHomeOfficeStatusBulk = async ( userId: string, from: string, to: string ): Promise<Record<string, boolean>> => {
  const url = `${API_BASE}/api/workdays/homeoffice/bulk/${userId}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
  const response = await fetch(url)
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unbekannter Fehler')
    throw new Error(`Fehler beim Laden der Homeoffice-Statuswerte: ${errorText}`)
  }
  
  return response.json()
}

// get grouped records and home office status
const fetchGroupedRecords = async (): Promise<void> => {
  try {
    loading.value = true
    error.value = null

    if (!userStore.user?._id) {
      throw new Error('Benutzer nicht authentifiziert')
    }

    const userId = userStore.user._id
    
    // fetch time records and group them by date
    const records = await getTimeRecordsForUser(userId)
    sortedGroupedRecords.value = groupAndSortRecords(records)

    // get date keys for home office status
    const dateKeys = Object.keys(sortedGroupedRecords.value)
    if (dateKeys.length === 0) {
      homeOfficeStatusMap.value = {}
      return
    }

    // date-range for home office status bulk request
    const dateFrom = dateKeys[dateKeys.length - 1] // oldest date
    const dateTo = dateKeys[0] // newest date

    if (!dateFrom || !dateTo) {
      homeOfficeStatusMap.value = {}
      return
    }

    homeOfficeStatusMap.value = await getHomeOfficeStatusBulk(userId, dateFrom, dateTo)
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten'
    console.error('Error fetching grouped records:', err)
    
    //reset data on error
    sortedGroupedRecords.value = {}
    homeOfficeStatusMap.value = {}
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchGroupedRecords()
})
</script>
