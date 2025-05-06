<template>
    <div class="p-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <i class="pi pi-chevron-left cursor-pointer text-xl" @click="jumpToPreviousMonth"></i>
        <h2 class="text-xl font-semibold">{{ displayMonthAndYear }}</h2>
        <i class="pi pi-chevron-right cursor-pointer text-xl" @click="jumpToNextMonth"></i>
      </div>
  
      <!-- Calendar Grid -->
      <div class="grid grid-cols-7 gap-2.5 pt-10">
        <!-- Weekdays -->
        <div v-for="(day, index) in weekDays" :key="index" class="text-center font-medium text-gray-600">
          {{ day }}
        </div>
  
        <!-- Empty placeholders for alignment -->
        <div v-for="empty in firstDayOfMonth" :key="'empty-' + empty"></div>
  
        <!-- Days -->
        <div
          v-for="day in daysInMonth"
          :key="day.toDateString()"
          class="text-center p-2 rounded-lg cursor-pointer hover:bg-blue-300 h-16"
          :class="{
            'bg-blue-800 text-white': isToday(day),
            'bg-blue-400': isSelected(day),
            'border border-gray-300': !isToday(day) && !isSelected(day),
          }"
          @click="selectDay(day)"
        >
          {{ day.getDate() }}
          <br v-if="workdayService.getWorkdayForUserByDate(day)" />
          {{
            workdayService.getWorkdayForUserByDate(day)
              ? workdayService.getHomeOfficeForUserByDay(day)
                ? '🏠'
                : '🏢'
              : ''
          }}
        </div>
      </div>
    </div>
</template>
  
<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { WorkdayService } from '../services/WorkdayService'
  
  const emit = defineEmits(['day-selected'])
  
  const workdayService = WorkdayService.getInstance()
  const currentDate = ref(new Date())
  const selectedDate = ref<Date | null>(null)
  
  const weekDays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
  const displayMonthAndYear = computed(() =>
    currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' })
  )
  
  const firstDayOfMonth = computed(() =>
    new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1).getDay()
  )
  
  const daysInMonth = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    const numDays = new Date(year, month + 1, 0).getDate()
  
    return Array.from({ length: numDays }, (_, index) => new Date(year, month, index + 1))
  })
  
  function jumpToPreviousMonth() {
    currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() - 1))
  }
  
  function jumpToNextMonth() {
    currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() + 1))
  }
  
  function selectDay(day: Date) {
    selectedDate.value = day
    emit('day-selected', day)
  }
  
  function isSelected(date: Date) {
    return selectedDate.value?.toDateString() === date.toDateString()
  }
  
  function isToday(date: Date) {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }
</script>
  
<style scoped>
  .text-center {
    box-sizing: border-box;
  }
</style>  