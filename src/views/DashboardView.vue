<template>
 <div class="h-full flex flex-col gap-4">
  <div class="grid grid-cols-2 grid-rows-1 gap-4 w-full pt-4">
    <!-- Andere Charts -->
    <DailyWorkHoursChart />
    <ComparisonWorkhoursChart />
  </div>
  <AllRecordList class="col-span-2 row-span-2 w-full mt-4" />
  <div>
    <BaseInput label="test" />
  </div>  
 </div>
</template>
  
<script setup lang="ts">
  import AllRecordList from '../components/AllRecordList.vue';
  import DailyWorkHoursChart from '../components/DailyWorkHoursChart.vue';
  import ComparisonWorkhoursChart from '../components/ComparisonWorkhoursChart.vue';
  import BaseInput from '@/components/base/Input.vue'
</script>
 