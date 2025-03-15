<template>
  <div class="w-[350px] mx-auto p-6 bg-white shadow-lg rounded-2xl flex-shrink-0 flex-grow-0 m-2 max-h-[333px]">
    <h2 class="text-xl text-center font-semibold text-gray-800 mb-4">Heutige Eintäge</h2>

    <!-- checks if there are todays records -->
    <template v-if="todayRecords.length > 0">
      <ul class="mt-4 border-t pt-4 text-gray-700 overflow-y-auto max-h-[260px] pr-3 space-y-2">
        <li v-for="(record, index) in todayRecords" :key="index" class="flex justify-between border-b pb-1">
          <span class="font-medium text-gray-900">{{ record.recordType }}</span>
          <span class="text-gray-600">{{ formatTime(record.timestamp) }}</span>
        </li>
      </ul>
    </template>

    <!-- if there are no todays records -->
    <p v-else class="mt-4 border-t pt-4 text-gray-700 overflow-y-auto max-h-[260px] pr-3">
      Keine Einträge für heute vorhanden
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { TimeRecord } from '../models/TimeRecord'; 

const props = defineProps<{ timeRecords: TimeRecord[] }>();

// todays date in format "YYYY-MM-DD"
const today = new Date().toISOString().split('T')[0];

// filter todays records
const todayRecords = computed(() => {
  return props.timeRecords
    .map(record => ({
      ...record,
      timestamp: convertToDate(record.timestamp) // convert timestamp to Date if necessary
    }))
    .filter(record => {
      if (isNaN(record.timestamp.getTime())) {
        console.warn("❌ Ungültiges Datum gefunden:", record.timestamp);
        return false;
      }
      return record.timestamp.toISOString().split('T')[0] === today;
    });
});

// convert timestamp to Date 
const convertToDate = (timestamp: string | Date): Date => {
  if (timestamp instanceof Date) return timestamp; // if already a Date, return it
  if (typeof timestamp !== "string") return new Date(NaN); // if not a string, return invalid Date

  const parts = timestamp.split(' '); // example: ["15.3.2025", "18:47:02"]
  if (parts.length !== 2) return new Date(NaN);

  const [day, month, year] = parts[0].split('.').map(Number);
  const [hours, minutes, seconds] = parts[1].split(':').map(Number);

  return new Date(year, month - 1, day, hours, minutes, seconds);
};

// format timestamp to "HH:MM:SS"
const formatTime = (timestamp: Date): string => {
  return timestamp.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};
</script>
