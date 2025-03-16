<template>
  <div class="flex gap-5">
    <TimeRecording @update-time-record="addTimeRecord"/>
    <DateRecordList :date="dateService.getCurrentDate()" title="Heutige Einträge" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DateRecordList from '@/components/DateRecordList.vue';
import TimeRecording from '@/components/TimeRecording.vue';
import { TimeRecord } from '../models/TimeRecord';
import { DateService } from '../services/DateService';

const dateService = DateService.getInstance();

// Generate TimeRecord Array with an empty array to prevent 'undefined' error
const timeRecords = ref<TimeRecord[]>([]);

const addTimeRecord = (record: TimeRecord) => {
  console.log('Neuer Eintrag:', record);
  timeRecords.value.unshift(record);
};
</script>
