<template>
  <div class="w-[350px] mx-auto p-6 bg-white shadow-lg rounded-2xl flex-shrink-0 flex-grow-0 m-2 max-h-[333px] border">
    <h2 class="text-xl text-center font-semibold text-gray-800 mb-4">{{ title }}</h2>

    <!-- checks if there are todays records -->
    <template v-if="todayRecords.length > 0">
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
  import { computed } from 'vue';
  import { TimeRecordService } from '../services/TimeRecordService';
  import { DateService } from '../services/DateService';
  import { WorkdayService } from '../services/WorkdayService';

  const date = defineProps<{ date: Date, title: string }>();

  const timeRecordService = TimeRecordService.getInstance();
  const dateService = DateService.getInstance();
  const workdayService = WorkdayService.getInstance();

  const todayRecords = computed(() => {  
    console.log("🔍 Filter Datum:", date.date);
    console.log('All Records:', timeRecordService.getRecords());
    console.log('Todays Records:', timeRecordService.getRecordsByDate(date.date));
    return timeRecordService.getRecordsByDate(date.date);
  });

  function getDisplayDate(date: Date): string {
    const normalizedDate = dateService.normalizeDate(date);
    const today = dateService.normalizeDate(new Date());

    return normalizedDate === today ? "heute" : normalizedDate;
  }

</script>
