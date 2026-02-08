<template>
  <div class="container mx-auto max-w-7xl px-6 py-10">
    <div class="grid gap-6 md:grid-cols-2 md:items-stretch">
      <div class="min-h-[520px]">
        <TimeRecording
          class="h-full w-full"
          @update-time-record="handleTimeRecordUpdate"
        />
      </div>
      <div class="min-h-[520px]">
        <DateRecordList
          ref="recordListRef"
          class="h-full w-full"
          :date="currentDate"
          title="Heutige Einträge"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TimeRecording from '~/components/recording/TimeRecording.vue'
import DateRecordList from '~/components/recording/DateRecordList.vue'
import type { TimeRecord } from '@shared/types'

// Components are auto-imported in Nuxt
const recordListRef = ref<{ addTimeRecord: (record: TimeRecord) => void } | null>(null)
const currentDate = ref(new Date())

const handleTimeRecordUpdate = (record: TimeRecord) => {
  console.log('Neuer Eintrag:', record)
  recordListRef.value?.addTimeRecord(record)
}
</script>
