<template>
    <AllRecordList :timeRecords="timeRecords" />
    <DailyWorkHoursChart />
</template>
  
<script setup lang="ts">
import AllRecordList from '../components/AllRecordList.vue';
import DailyWorkHoursChart from '../components/DailyWorkHoursChart.vue';
import { TimeRecordService } from '../services/TimeRecordService';

const timeRecordService = TimeRecordService.getInstance();
const timeRecords = timeRecordService.getRecords();

</script>
 