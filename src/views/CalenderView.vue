<template>
  <div class="flex flex-col gap-6">
    <!-- calendar component -->
    <Calendar @day-selected="handleDaySelected" />

    <!-- selected day info components -->
    <div class="flex flex-wrap justify-center gap-4 min-h-[200px] transition-all duration-300">
      <SelectedCalendarDayInfo :info="selectedWorkdayInfo" />
      <DateRecordList
        v-if="selectedWorkdayInfo?.homeOffice !== null && selectedWorkdayInfo?.homeOffice !== undefined"
        :key="selectedWorkdayInfo.date.toISOString()"
        :date="selectedWorkdayInfo.date"
        title="Einträge"
      />
    </div>
  </div>
</template>


<script setup lang="ts">
import Calendar from '../components/Calendar.vue'
import SelectedCalendarDayInfo from '../components/SelectedCalendarDayInfo.vue'
import DateRecordList from '../components/DateRecordList.vue'
import { WorkdayService } from '../services/WorkdayService'
import { ref } from 'vue'

const workdayService = WorkdayService.getInstance()
const selectedWorkdayInfo = ref<null | { date: Date; homeOffice: boolean | null; hoursWorked: number }>(null)

async function handleDaySelected(day: Date) {
  const workday = workdayService.getWorkdayForUserByDate(day)
  if (workday) {
    const homeOffice = workdayService.getHomeOfficeForUserByDay(day)
    const hoursWorked = await workdayService.getHoursWorkedForUserByDay(day)
    selectedWorkdayInfo.value = { date: day, homeOffice, hoursWorked }
  } else {
    selectedWorkdayInfo.value = { date: day, homeOffice: null, hoursWorked: 0 }
  }
}
</script>