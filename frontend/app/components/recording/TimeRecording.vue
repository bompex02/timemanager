<template>
  <div class="h-fit w-87.5 shrink-0 rounded-xl bg-surface-200 p-6 shadow-sm shadow-surface-300 ring-1 ring-surface-300/40 transition-all hover:shadow-md">
    <h2 class="mb-6 text-center text-xl font-semibold text-text-100">Zeiterfassung</h2>

    <!-- Work Location Selection with Labels -->
    <div class="mb-6 space-y-3">
      <p class="text-center text-xs font-medium uppercase tracking-wide text-text-300">Arbeitsort</p>
      <div class="flex justify-center gap-4">
        <button
          type="button"
          class="group flex w-32 flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all"
          :class="workLocation === 'office' 
            ? 'border-accent-400 bg-accent-100 shadow-sm' 
            : 'border-surface-300 bg-surface-100 hover:border-accent-300 hover:bg-surface-200'"
          @click="workLocation = 'office'"
          aria-label="Büro"
        >
          <span class="text-3xl transition-transform group-hover:scale-110">🏢</span>
          <span class="text-xs font-medium" :class="workLocation === 'office' ? 'text-text-100 dark:text-black' : 'text-text-300'">
            Büro
          </span>
        </button>

        <button
          type="button"
          class="group flex w-32 flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all"
          :class="workLocation === 'homeoffice' 
            ? 'border-accent-400 bg-accent-100 shadow-sm' 
            : 'border-surface-300 bg-surface-100 hover:border-accent-300 hover:bg-surface-200'"
          @click="workLocation = 'homeoffice'"
          aria-label="Homeoffice"
        >
          <span class="text-3xl transition-transform group-hover:scale-110">🏠</span>
          <span class="text-xs font-medium" :class="workLocation === 'homeoffice' ? 'text-text-100 dark:text-black' : 'text-text-300'">
            Homeoffice
          </span>
        </button>
      </div>
    </div>

    <!-- Divider -->
    <div class="my-6 border-t border-surface-300"></div>

    <!-- Action Buttons with Icons -->
    <div class="mb-4 space-y-3">
      <BaseButton
        variant="secondary"
        @click="clockIn"
        :disabled="processing || isClockedIn"
        class="group relative w-full overflow-hidden rounded-lg py-3.5 font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
        :class="isClockedIn 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-green-600 hover:bg-green-700 active:scale-[0.98] hover:shadow-lg'"
      >
        <span class="relative z-10 flex items-center justify-center gap-2">
          <svg v-if="processing && actionType === 'in'" class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ processing && actionType === 'in' ? 'Verarbeite...' : 'Einstempeln' }}</span>
        </span>
        <div v-if="!isClockedIn && !processing" class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
      </BaseButton>

      <BaseButton
        variant="secondary"
        @click="clockOut"
        :disabled="processing || !isClockedIn"
        class="group relative w-full overflow-hidden rounded-lg py-3.5 font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
        :class="!isClockedIn 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-red-600 hover:bg-red-700 active:scale-[0.98] hover:shadow-lg'"
      >
        <span class="relative z-10 flex items-center justify-center gap-2">
          <svg v-if="processing && actionType === 'out'" class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ processing && actionType === 'out' ? 'Verarbeite...' : 'Ausstempeln' }}</span>
        </span>
        <div v-if="isClockedIn && !processing" class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
      </BaseButton>
    </div>

    <!-- Enhanced Status Indicator -->
    <div class="rounded-lg bg-surface-100 px-4 py-3 transition-colors" :class="isClockedIn ? 'bg-green-50' : 'bg-red-50'">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="relative">
            <span
              class="flex h-3 w-3 rounded-full"
              :class="isClockedIn ? 'bg-green-600' : 'bg-red-600'"
            ></span>
            <span
              v-if="isClockedIn"
              class="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-green-600 opacity-75"
            ></span>
          </div>
          <span class="text-sm font-semibold" :class="isClockedIn ? 'text-green-700' : 'text-red-700'">
            {{ isClockedIn ? 'Eingestempelt' : 'Ausgestempelt' }}
          </span>
        </div>
        
        <!-- Current Time Display -->
        <div class="flex items-center gap-1.5 text-xs font-medium text-text-300">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ currentTime }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '~/stores/user-store'
import { useTimeRecords } from '~/composables/useTimeRecords'
import type { TimeRecord, Workday } from '@shared/types'
import { RecordType } from '@shared/types'

const config = useRuntimeConfig()
const userStore = useUserStore()
const { formatDateKey, fetchRecordsForDate } = useTimeRecords()

const API_BASE = config.public.baseApiUrl

const emit = defineEmits<{
  'update-time-record': [record: TimeRecord]
}>()

// State
const workLocation = ref<'office' | 'homeoffice'>('office')
const isClockedIn = ref(false)
const processing = ref(false)
const actionType = ref<'in' | 'out' | null>(null)
const currentTime = ref('')

// Update current time every second
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Start time update interval
let timeInterval: NodeJS.Timeout | null = null

onMounted(async () => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  await Promise.all([loadUserStatus(), loadUserPreferences()])
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

// Helper Functions
const showSuccess = (message: string) => {
  // TODO: Replace with your toast service
  console.log('Success:', message)
}

const showError = (message: string) => {
  // TODO: Replace with your toast service
  console.error('Error:', message)
  alert(message)
}

// API Calls
const checkIfFirstRecordOfDay = async (userId: string): Promise<boolean> => {
  try {
    const today = new Date()
    const records = await fetchRecordsForDate(userId, today)
    return records.length === 0
  } catch (error) {
    console.error('Error checking first record:', error)
    return false
  }
}

const createWorkday = async (userId: string): Promise<void> => {
  try {
    const today = new Date()
    const dateKey = formatDateKey(today)

    await fetch(`${API_BASE}/api/workdays`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        date: dateKey,
        hoursWorked: 0,
        homeOffice: workLocation.value === 'homeoffice',
      }),
    })
  } catch (error) {
    console.error('Error creating workday:', error)
  }
}

const createTimeRecord = async (
  userId: string,
  recordType: RecordType
): Promise<TimeRecord | null> => {
  try {
    const response = await fetch(`${API_BASE}/api/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        recordType,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error('Fehler beim Erstellen des Eintrags')
    }

    return response.json()
  } catch (error) {
    console.error('Error creating time record:', error)
    return null
  }
}

const updateWorkdayHours = async (userId: string): Promise<void> => {
  try {
    const today = new Date()
    const dateKey = formatDateKey(today)

    // Fetch all records for today
    const records = await fetchRecordsForDate(userId, today)

    // Calculate hours worked
    const sorted = records.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )

    let totalMs = 0
    for (let i = 0; i < sorted.length - 1; i += 2) {
      const start = sorted[i]
      const end = sorted[i + 1]

      if (start && end && start.recordType === RecordType.Einstempeln && end.recordType === RecordType.Ausstempeln) {
        const diff = new Date(end.timestamp).getTime() - new Date(start.timestamp).getTime()
        totalMs += diff
      }
    }

    const hoursWorked = Number((totalMs / (1000 * 60 * 60)).toFixed(2))

    // Update workday
    await fetch(`${API_BASE}/api/workdays/user/${userId}/date/${dateKey}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hoursWorked,
        homeOffice: workLocation.value === 'homeoffice',
      }),
    })
  } catch (error) {
    console.error('Error updating workday hours:', error)
  }
}

const loadUserStatus = async (): Promise<void> => {
  try {
    if (!userStore.user?._id) return

    const today = new Date()
    const records = await fetchRecordsForDate(userStore.user._id, today)

    // If odd number of records, user is clocked in
    isClockedIn.value = records.length % 2 !== 0
  } catch (error) {
    console.error('Error loading user status:', error)
    isClockedIn.value = false
  }
}

const loadUserPreferences = async (): Promise<void> => {
  try {
    if (!userStore.user?._id) return

    const response = await fetch(`${API_BASE}/api/users/${userStore.user._id}/preferences`)

    if (response.ok) {
      const prefs = await response.json()
      workLocation.value = prefs.defaultLocation || 'office'
    }
  } catch (error) {
    console.error('Error loading preferences:', error)
  }
}

// Actions
const clockIn = async (): Promise<void> => {
  try {
    processing.value = true
    actionType.value = 'in'

    if (!userStore.user?._id) {
      showError('Kein Benutzer angemeldet!')
      return
    }

    if (isClockedIn.value) {
      showError('Sie sind bereits eingestempelt!')
      return
    }

    const userId = userStore.user._id

    // Check if first record of the day
    const isFirstRecord = await checkIfFirstRecordOfDay(userId)

    if (isFirstRecord) {
      await createWorkday(userId)
    }

    // Create time record
    const record = await createTimeRecord(userId, RecordType.Einstempeln)

    if (record) {
      isClockedIn.value = true
      showSuccess('Einstempeln erfolgreich!')
      emit('update-time-record', record)
    }
  } catch (error) {
    showError('Fehler beim Einstempeln')
    console.error('Clock in error:', error)
  } finally {
    processing.value = false
    actionType.value = null
  }
}

const clockOut = async (): Promise<void> => {
  try {
    processing.value = true
    actionType.value = 'out'

    if (!userStore.user?._id) {
      showError('Kein Benutzer angemeldet!')
      return
    }

    if (!isClockedIn.value) {
      showError('Bereits ausgestempelt!')
      return
    }

    const userId = userStore.user._id

    // Create time record
    const record = await createTimeRecord(userId, RecordType.Ausstempeln)

    if (record) {
      isClockedIn.value = false
      showSuccess('Ausstempeln erfolgreich!')
      emit('update-time-record', record)

      // Update workday hours
      await updateWorkdayHours(userId)
    }
  } catch (error) {
    showError('Fehler beim Ausstempeln')
    console.error('Clock out error:', error)
  } finally {
    processing.value = false
    actionType.value = null
  }
}

// Lifecycle
onMounted(async () => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  await Promise.all([loadUserStatus(), loadUserPreferences()])
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>
