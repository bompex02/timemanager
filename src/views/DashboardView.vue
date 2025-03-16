<template>
    <AllRecordList :timeRecords="timeRecords" />
</template>
  
<script setup lang="ts">
import AllRecordList from '../components/AllRecordList.vue';
import { TimeRecordService } from '../services/TimeRecordService';

const timeRecordService = TimeRecordService.getInstance();
const timeRecords = timeRecordService.getRecords();

</script>
  
<style scoped>
  /* Stildefinitionen werden später hinzugefügt */
</style>
  