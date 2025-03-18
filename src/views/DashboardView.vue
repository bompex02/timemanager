<template>
  <div class="grid grid-cols-2 grid-rows-1 gap-4 w-full pt-4">
    <!-- Andere Charts -->
    <DailyWorkHoursChart />
    <ComparisonWorkhoursChart />
  </div>
  <AllRecordList class="col-span-2 row-span-2 w-full mt-4" />
</template>
  
<script setup lang="ts">
  import AllRecordList from '../components/AllRecordList.vue';
  import DailyWorkHoursChart from '../components/DailyWorkHoursChart.vue';
  import ComparisonWorkhoursChart from '../components/ComparisonWorkhoursChart.vue';
</script>
 