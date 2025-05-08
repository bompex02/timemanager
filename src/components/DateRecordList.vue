<template>
  <div class="w-[350px] mx-auto p-6 bg-white shadow-lg rounded-2xl flex-shrink-0 flex-grow-0 m-2 max-h-[333px]">
    <h2 class="text-xl text-center font-semibold text-gray-800 mb-4">{{ title }}</h2>

    <!-- checks if there are todays records -->
    <template v-if="Object.keys(todayRecords).length > 0">
      <ul class="mt-4 border-t pt-4 text-gray-700 overflow-y-auto max-h-[260px] pr-3 space-y-2">
        <li v-for="(record, index) in todayRecords" :key="index" class="flex justify-between border-b">
          <span class="font-medium text-gray-900">{{ record.recordType }}</span>
          <span class="text-gray-900">{{ dateService.getTimeString(record.timestamp) }}</span>
        </li>
      </ul>
    </template>

    <!-- if there are no todays records -->
    <p v-else class="mt-4 border-t pt-4 text-gray-700 overflow-y-auto max-h-[260px] pr-3">
      Keine Einträge für {{ getDisplayDate(date.date ) }} vorhanden
    </p>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { TimeRecordService } from '../services/TimeRecordService';
  import { DateService } from '../services/DateService';
  import { TimeRecord } from '../models/TimeRecord';
  import { UserService } from '../services/UserService';

  const date = defineProps<{ date: Date, title: string }>();

  const emit = defineEmits(['update-time-record']);

  const timeRecordService = TimeRecordService.getInstance();
  const dateService = DateService.getInstance();
  const userService = UserService.getInstance();

  const currentUserId = userService.getCurrentUser()?.id || '';
  
  const allRecords = ref<TimeRecord[]>([]);

  watch(() => date.date, async () => {
    await fetchTodayRecords();
  });

  onMounted(async () => {
    const userId = userService.getCurrentUser()?.id || '';
    fetchTodayRecords();
  });

  const fetchTodayRecords = async () => {
    todayRecords.value = await timeRecordService.getRecordsForUserByDay(currentUserId, date.date);
  }

  const todayRecords = ref<TimeRecord[]>([]);

  function getDisplayDate(date: Date): string {
    const normalizedDate = dateService.normalizeDate(date);
    const today = dateService.normalizeDate(new Date());

    return normalizedDate === today ? "heute" : normalizedDate;
  }

  // Reagiere auf das Event, wenn ein neuer TimeRecord erstellt wird
  const addTimeRecord = (newRecord: TimeRecord) => {
    todayRecords.value.unshift(newRecord); // Füge den neuen Eintrag sofort hinzu
  }

  defineExpose({
    addTimeRecord
  });

  // Lausche auf das Event 'update-time-record', das von TimeRecording ausgelöst wird
  emit('update-time-record', addTimeRecord);

</script>
