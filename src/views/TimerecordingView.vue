<template>
  <div class="flex gap-5">
    <TimeRecording @update-time-record="addTimeRecord" />
    <DateRecordList ref="recordListRef" :date="dateService.getCurrentDate()" title="Heutige Einträge" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DateRecordList from '@/components/DateRecordList.vue';
import TimeRecording from '@/components/TimeRecording.vue';
import { TimeRecord } from '../models/TimeRecord';
import { DateService } from '../services/DateService';

const dateService = DateService.getInstance();

const recordListRef = ref<InstanceType<typeof DateRecordList>>();

const addTimeRecord = (record: TimeRecord) => {
  console.log('Neuer Eintrag:', record);
  recordListRef.value?.addTimeRecord(record);
};
</script>

