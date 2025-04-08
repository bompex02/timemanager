<template>
  <div class="p-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <i class="pi pi-chevron-left cursor-pointer text-xl" @click="previousMonth"></i>
      <h2 class="text-xl font-semibold">{{ displayMonthAndYear }}</h2>
      <i class="pi pi-chevron-right cursor-pointer text-xl" @click="nextMonth"></i>
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
        class="text-center p-2 rounded-lg cursor-pointer hover:bg-blue-100"
        :class="{
          'bg-blue-500 text-white': isToday(day),
          'bg-blue-200': isSelected(day),
          'border-2 border-blue-500': isSelected(day)
        }"
        @click="selectDay(day)"
      >
        {{ day.getDate() }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// State
const currentDate = ref(new Date());
const selectedDate = ref<Date | null>(null);

// Computed month/year label
const displayMonthAndYear = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' });
});

// Weekdays
const weekDays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

// First day offset
const firstDayOfMonth = computed(() => {
  return new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1).getDay();
});

// Generate days in current month
const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const numDays = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: numDays }, (_, index) => new Date(year, month, index + 1));
});

// jump to previous month
function previousMonth() {
  currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() - 1));
}

// jump to next month
function nextMonth() {
  currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() + 1));
}

// set the selected date as the value of the selectedDate ref
function selectDay(day: Date) {
  selectedDate.value = day;
}

// Check if the day is selected
function isSelected(date: Date) {
  return selectedDate.value && selectedDate.value.toDateString() === date.toDateString();
}

// Check if the day is today
function isToday(date: Date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
</script>

<style scoped>
/* Prevent layout shift when adding borders */
.text-center {
  box-sizing: border-box;
}

/* Optional: Styles for selected date */
.bg-blue-200 {
  background-color: #bfdbfe;
}

.border-blue-500 {
  border-color: #3b82f6;
}

.bg-blue-500 {
  background-color: #3b82f6;
  color: white;
}

.hover\:bg-blue-100:hover {
  background-color: #ebf8ff;
}
</style>
