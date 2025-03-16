<template>
    <div class="mx-auto p-6 bg-white shadow-lg rounded-2xl flex-shrink-0 flex-grow-0 w-fit min-w-[350px] max-w-max">
      <h2 class="text-xl text-center font-semibold text-gray-800 mb-4">Alle Einträge</h2>

      <!-- checks if there are records -->
      <div v-if="Object.keys(groupedRecords).length > 0" class="flex flex-col gap-4 overflow-y-auto max-h-[600px]">
        <div v-for="(records, dateKey) in groupedRecords" :key="dateKey">
            <DateRecordList :date="dateService.parseDateFromString(dateKey)" :title="dateKey" />
        </div>
      </div>

      <!-- if there are no records -->
      <p v-else class="mt-4 border-t pt-4 text-gray-700">
        Keine Einträge vorhanden
      </p>
    </div>
</template>


  
<script setup lang="ts">
import { computed } from 'vue';
import { TimeRecordService } from '../services/TimeRecordService';
import { DateService } from '../services/DateService';
import DateRecordList from '../components/DateRecordList.vue';

const dateService = DateService.getInstance();
const timeRecordService = TimeRecordService.getInstance();
const groupedRecords = computed(() => timeRecordService.getGroupedRecordsByDate());

</script>
