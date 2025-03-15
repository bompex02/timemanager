<template>
  <div class="flex gap-5">
    <TimeRecording @update-time-record="addTimeRecord"/>
    <TodaysRecordList :timeRecords="timeRecords" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TodaysRecordList from '@/components/TodaysREcordList.vue';
import TimeRecording from '@/components/TimeRecording.vue';
import { TimeRecord } from '../models/TimeRecord';

// Generate TimeRecord Array with an empty array to prevent 'undefined' error
const timeRecords = ref<TimeRecord[]>([]);

const addTimeRecord = (record: TimeRecord) => {
  console.log('Neuer Eintrag:', record);
  timeRecords.value.unshift(record);
};
</script>
