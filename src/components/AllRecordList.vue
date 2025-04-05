<template>
  <div class="mx-auto p-6 bg-white shadow-lg rounded-2xl flex-shrink-0 w-fit min-w-[350px]">
    <h2 class="text-xl text-center font-semibold text-gray-800 mb-4">Alle Einträge</h2>

    <!-- checks if there are records -->
    <div v-if="Object.keys(sortedGroupedRecords).length > 0" class="overflow-y-auto max-h-[600px] pt-4">
      <div v-for="(records, dateKey, index) in sortedGroupedRecords" :key="dateKey">

        <!-- black line between entries -->
        <div v-if="index !== 0" class="border-t-2 border-black my-4 pb-2 "></div>
        
        <!-- headline with date and homeoffice/office state -->
        <div class="flex items-center mb-2 gap-8">
          <h3 class="text-lg font-semibold text-gray-800 mr-4">
            {{ dateService.normalizeDate(dateService.parseDateFromString(dateKey)) }}
          </h3>
          
          <!-- homeoffice/office badge with spacing -->
          <InfoBadge v-if="workdayService.getHomeOfficeForDay(dateService.parseDateFromString(dateKey))" text="🏠 Homeoffice" :state="workdayService.getHomeOfficeForDay(dateService.parseDateFromString(dateKey))" class="ml-4"/>
          <InfoBadge v-else text="🏢 Office" :state="workdayService.getHomeOfficeForDay(dateService.parseDateFromString(dateKey))" class="ml-4"/>
        </div>

        <!-- list of records -->
        <ul>
          <li v-for="(record, recIndex) in records" :key="recIndex" class="border-b border-gray-300 py-2 flex justify-between">
            <span class="text-sm text-gray-600">{{ record.recordType }}</span>
            <span class="text-sm text-gray-600 m-2 pr-4">{{ dateService.getTimeString(record.timestamp) }}</span>
          </li>
        </ul>

      </div>
    </div>

    <!-- if there are no records -->
    <p v-else class="mt-4 border-t pt-4 text-gray-700">
      Keine Einträge vorhanden
    </p>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { TimeRecordService } from '../services/TimeRecordService';
  import { DateService } from '../services/DateService';
  import { WorkdayService } from '../services/WorkdayService';
  import { RecordType, TimeRecord } from '../models/TimeRecord';
  import InfoBadge from './InfoBadge.vue';
  import { UserService } from '../services/UserService';

  const dateService = DateService.getInstance();
  const timeRecordService = TimeRecordService.getInstance();
  const workdayService = WorkdayService.getInstance();
  const userService = UserService.getInstance();

  // returns all records sorted by date descending (ref for reactive array of records)
  const sortedGroupedRecords = ref<Record<string, TimeRecord[]>>({});
  
  // load records from service and groups them by date
  const fetchGroupedRecords = async () => {
    const userId = await userService.getCurrentUser()?.id || '';
    const grouped = await timeRecordService.getGroupedRecordsForUserByDate(userId);

    sortedGroupedRecords.value = Object.keys(grouped)
      .sort((a, b) => dateService.parseDateFromString(b).getTime() - dateService.parseDateFromString(a).getTime())
      .reduce((acc, key) => {
        acc[key] = grouped[key];
        return acc;
      }, {} as Record<string, TimeRecord[]>);
  };
  
  // calls method to load records and groups them by date
  fetchGroupedRecords();

</script>
