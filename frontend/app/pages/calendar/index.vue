<template>
  <div class="container mx-auto max-w-6xl p-6 h-[calc(100vh-4rem)]">
    <section class="flex h-full flex-col rounded-xl bg-surface-200 p-6 shadow-sm shadow-surface-300 ring-1 ring-surface-300/40">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <button
          @click="jumpToPreviousMonth"
          class="rounded-lg p-2 text-text-200 transition-colors hover:bg-surface-300 hover:text-text-100"
          :disabled="loading"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h2 class="text-2xl font-semibold text-text-100">
          {{ displayMonthAndYear }}
        </h2>

        <button
          @click="jumpToNextMonth"
          class="rounded-lg p-2 text-text-200 transition-colors hover:bg-surface-300 hover:text-text-100"
          :disabled="loading"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-surface-300 border-t-text-100"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ error }}
      </div>

      <!-- Calendar Grid -->
      <div v-else class="flex flex-1 flex-col">
        <!-- Weekdays Header -->
        <div class="grid grid-cols-7 gap-3">
          <div
            v-for="(day, index) in weekDays"
            :key="index"
            class="py-2 text-center text-sm font-semibold text-text-200"
          >
            {{ day }}
          </div>
        </div>

        <!-- Days -->
        <div class="mt-2 grid flex-1 grid-cols-7 grid-rows-6 gap-3">
          <!-- Empty placeholders for alignment -->
          <div v-for="empty in firstDayOfMonth" :key="'empty-' + empty"></div>

          <div
            v-for="day in daysInMonth"
            :key="day.toISOString()"
            class="flex cursor-pointer flex-col items-center justify-center rounded-lg border transition-all hover:bg-accent-200 hover:border-accent-400"
            :class="getDayClasses(day)"
            @click="selectDay(day)"
          >
            <span class="text-base font-semibold">{{ day.getDate() }}</span>
            <span v-if="hasWorkday(day)" class="mt-2 text-xl">
              {{ getWorkdayIcon(day) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Selected Day Info -->
      <div v-if="selectedDate" class="mt-4 rounded-xl border border-surface-300 bg-surface-100/80 p-5 shadow-sm shadow-surface-300">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h3 class="text-lg font-semibold text-text-100">
          {{ formatSelectedDate }}
          </h3>
          <div v-if="selectedDayWorkday" class="flex items-center gap-2 text-xs font-semibold">
            <span class="rounded-full bg-accent-100 px-3 py-1 text-accent-500">
              ⏳ {{ selectedDayWorkday.hoursWorked }}h
            </span>
            <span
              class="rounded-full px-3 py-1"
              :class="selectedDayWorkday.homeOffice ? 'bg-emerald-500/15 text-emerald-600' : 'bg-sky-500/15 text-sky-600'"
            >
              {{ selectedDayWorkday.homeOffice ? '🏠 Home-Office' : '🏢 Office' }}
            </span>
          </div>
        </div>

        <div v-if="selectedDayWorkday" class="mt-4">
          <AllRecordList :date-key="formatDateKey(new Date(selectedDayWorkday.date))" />
        </div>
        <p v-else class="mt-2 text-sm text-text-300">Keine Arbeitszeit erfasst</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { Workday } from '@shared/types'
import { useUserStore } from '~/stores/user-store'

const config = useRuntimeConfig()
const userStore = useUserStore()

// State
const currentDate = ref(new Date())
const selectedDate = ref<Date | null>(null)
const workdaysMap = ref<Map<string, Workday>>(new Map())
const loading = ref(true)
const error = ref<string | null>(null)
const workdaysCache = new Map<string, Workday[]>()
const inFlight = new Map<string, Promise<Workday[]>>()

// Constants
const API_BASE = config.public.baseApiUrl
const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

// Computed
const displayMonthAndYear = computed(() =>
  currentDate.value.toLocaleString('de-DE', { month: 'long', year: 'numeric' })
)

const formatSelectedDate = computed(() => {
  if (!selectedDate.value) return ''
  return selectedDate.value.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})

const firstDayOfMonth = computed(() => {
  const dayIndex = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1).getDay()
  return (dayIndex + 6) % 7
})

const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const numDays = new Date(year, month + 1, 0).getDate()

  return Array.from({ length: numDays }, (_, index) => new Date(year, month, index + 1))
})

const selectedDayWorkday = computed(() => {
  if (!selectedDate.value) return null
  return workdaysMap.value.get(formatDateKey(selectedDate.value))
})

// formatDateKey: formats a Date object to 'YYYY-MM-DD' string
const formatDateKey = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// check if a date is today
const isToday = (date: Date): boolean => {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

// check if a date is the selected date
const isSelected = (date: Date): boolean => {
  return selectedDate.value?.toDateString() === date.toDateString()
}

// check if a date has a workday entry
const hasWorkday = (date: Date): boolean => {
  return workdaysMap.value.has(formatDateKey(date))
}

// get workday icon based on homeOffice status
const getWorkdayIcon = (date: Date): string => {
  const workday = workdaysMap.value.get(formatDateKey(date))
  return workday?.homeOffice ? '🏠' : '🏢'
}

const getDayClasses = (day: Date): string => {
  const classes: string[] = ['border-surface-300']

  if (isToday(day)) {
    classes.push('bg-accent-500 text-white border-accent-500 font-bold')
  } else if (isSelected(day)) {
    classes.push('bg-accent-200 border-accent-400 text-text-100')
  } else if (hasWorkday(day)) {
    classes.push('bg-surface-100 text-text-100')
  } else {
    classes.push('bg-accent-100/40 text-text-300 border-accent-200/40')
  }

  return classes.join(' ')
}

const selectDay = (day: Date): void => {
  selectedDate.value = day
}

const jumpToPreviousMonth = (): void => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  )
}

const jumpToNextMonth = (): void => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  )
}

// fetch user's workdays from backend for given month and year
const getWorkdaysForMonth = async (userId: string, year: number, month: number): Promise<Workday[]> => {
  const cacheKey = `${userId}:${year}-${String(month + 1).padStart(2, '0')}`
  const cached = workdaysCache.get(cacheKey)
  if (cached) return cached

  const existing = inFlight.get(cacheKey)
  if (existing) return existing

  // Month is 0-indexed in the frontend, send as 1-indexed to backend
  const request = (async () => {
    const response = await fetch(
      `${API_BASE}/api/workdays/month/${userId}/${encodeURIComponent(year)}/${encodeURIComponent(month + 1)}`
    )

    if (response.status === 304 && cached) {
      return cached
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unbekannter Fehler')
      throw new Error(`Fehler beim Laden der Arbeitstage: ${errorText}`)
    }

    const data = await response.json()
    workdaysCache.set(cacheKey, data)
    return data
  })()

  inFlight.set(cacheKey, request)
  try {
    return await request
  } finally {
    inFlight.delete(cacheKey)
  }
}

// Fetch workdays for the current month
const fetchWorkdays = async (): Promise<void> => {
  try {
    loading.value = true
    error.value = null

    if (!userStore.user?._id) {
      throw new Error('Benutzer nicht authentifiziert')
    }

    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()

    const workdays = await getWorkdaysForMonth(userStore.user._id, year, month)

    // Build map for quick lookup
    const newMap = new Map<string, Workday>()
    workdays.forEach((workday) => {
      if (!workday.date) return
      const dateKey = formatDateKey(new Date(workday.date))
      newMap.set(dateKey, workday)
    })

    workdaysMap.value = newMap
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten'
    console.error('Error fetching workdays:', err)
    workdaysMap.value = new Map()
  } finally {
    loading.value = false
  }
}

watch(currentDate, () => {
  fetchWorkdays()
})

onMounted(() => {
  fetchWorkdays()
})
</script>
