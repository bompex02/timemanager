<template>
  <div class="w-87.5 max-h-83.25 shrink-0 rounded-xl bg-surface-200 p-6 shadow-sm shadow-surface-300 ring-1 ring-surface-300/40">
    <h2 class="mb-4 text-center text-xl font-semibold text-text-100">{{ title }}</h2>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center border-t border-surface-300 pt-4">
      <div class="h-6 w-6 animate-spin rounded-full border-2 border-surface-300 border-t-text-100"></div>
    </div>

    <!-- Records List -->
    <template v-else-if="records.length > 0">
      <ul class="max-h-60 space-y-2 overflow-y-auto border-t border-surface-300 pr-3 pt-4 text-text-200">
        <li
          v-for="(record, index) in records"
          :key="record._id || index"
          class="flex justify-between border-b border-surface-300 pb-2"
        >
          <span class="font-medium text-text-100">{{ record.recordType }}</span>
          <span class="text-text-200">{{ formatTime(record.timestamp) }}</span>
        </li>
      </ul>
    </template>

    <!-- Empty State -->
    <p v-else class="border-t border-surface-300 pt-4 text-center text-text-300">
      Keine Einträge für {{ displayDate }} vorhanden
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useUserStore } from '~/stores/user-store'
import { useTimeRecords } from '~/composables/useTimeRecords'
import type { TimeRecord } from '@shared/types'

const props = defineProps<{
  date: Date
  title: string
}>()

const userStore = useUserStore()
const { formatDateKey, fetchRecordsForDate } = useTimeRecords()

const records = ref<TimeRecord[]>([])
const loading = ref(true)

// gets display string for the date prop
const displayDate = computed(() => {
  const today = new Date()
  const propDate = new Date(props.date)

  // Reset time to compare dates only
  today.setHours(0, 0, 0, 0)
  propDate.setHours(0, 0, 0, 0)

  if (propDate.getTime() === today.getTime()) {
    return 'heute'
  }

  return propDate.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
})

// formats a timestamp to 'HH:MM'
const formatTime = (timestamp: string | Date): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  return date.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// get all records for the given date for the current user
const fetchRecords = async (): Promise<void> => {
  try {
    loading.value = true

    if (!userStore.user?._id) {
      records.value = []
      return
    }

    records.value = await fetchRecordsForDate(userStore.user._id, props.date)
  } catch (error) {
    console.error('Error fetching records:', error)
    records.value = []
  } finally {
    loading.value = false
  }
}

// add a new time record to the top of the list
const addTimeRecord = (newRecord: TimeRecord): void => {
  records.value.unshift(newRecord)
}

watch(() => props.date, () => {
  fetchRecords()
})

onMounted(() => {
  fetchRecords()
})

// exposes methods to parent components
defineExpose({
  addTimeRecord,
})
</script>
