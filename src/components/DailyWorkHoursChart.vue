<template>
  <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[400px]">
    <h2 class="text-xl font-semibold text-gray-800 text-center mb-4">
      Gearbeitete Stunden pro Tag
    </h2>

    <!-- if there are no workdays -->
    <p v-if="workdays.length === 0" class="text-center text-gray-600">
      🚀 Noch keine Arbeitszeiten für die letzten 14 Tage vorhanden.
    </p>

    <!-- if there are workdays -->
    <v-chart v-else class="w-full h-64 min-h-[300px]" :option="chartOptions" autoresize />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted } from 'vue';
  import { use } from 'echarts/core';
  import { BarChart } from 'echarts/charts';
  import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
  import { CanvasRenderer } from 'echarts/renderers';
  import VChart from 'vue-echarts';
  import { WorkdayService } from '../services/WorkdayService';
  import { DateService } from '../services/DateService';
  import type { Workday } from '../models/WorkModels';

  use([BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

  // Service Singletons
  const workdayService = WorkdayService.getInstance();
  const dateService = DateService.getInstance();

  // Workdays of the last 14 days for the chart (no weekends)
  const workdays = computed(() => workdayService.getWorkdaysOfLast2WeeksByUser());

  // chart options
  const chartOptions = computed(() => ({
    tooltip: { trigger: 'axis' },
    axisPointer: {
      type: 'shadow', // smother transitions between bars when hovering
    },
    formatter: (params: any) => {
      const data = params[0].data;
      const homeOfficeText = data.homeOffice ? "🏡 Home-Office" : "🏢 Office";
      return `
        <strong>${params[0].axisValue}</strong><br/>
        ⏳ <strong>${data.value}</strong> Stunden<br/>
        ${homeOfficeText}
      `;
    },
    grid: { left: '10%', right: '10%', bottom: '10%' },
    xAxis: {
      type: 'category',
      data: workdays.value.map((workday) => dateService.normalizeDate(workday.date)),
      axisLabel: {
        rotate: 45, // Rotate the labels to prevent them from overlapping (NEED TO BE FIXED IN PRODUCTION)
      },
    },
    yAxis: {
      type: 'value',
      name: 'Stunden',

    },
    series: [
    {
      name: 'Gearbeitete Stunden',
      data: workdays.value.map((workday) => ({
        value: workday.hoursWorked.toFixed(2), // format to 2 decimal places
        homeOffice: workday.homeOffice,
        itemStyle: {
          color: workday.homeOffice ? "#10B981" : "#4F46E5", // color switch between home office (green) and office (blue) 
        }
      })),
      type: 'bar',
    },
  ],
  }));
</script>
