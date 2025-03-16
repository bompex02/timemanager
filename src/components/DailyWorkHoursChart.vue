<template>
  <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
    <h2 class="text-xl font-semibold text-gray-800 text-center mb-4">
      Gearbeitete Stunden pro Tag
    </h2>

    <v-chart class="w-full h-64 min-h-[555px]" :option="chartOptions" autoresize />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import { use } from 'echarts/core';
  import { BarChart } from 'echarts/charts';
  import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
  import { CanvasRenderer } from 'echarts/renderers';
  import VChart from 'vue-echarts';
  import { WorkdayService } from '../services/WorkdayService';
  import { DateService } from '../services/DateService';
  import { Workday } from '../models/Workday';

  use([BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

  // service singletons
  const workdayService = WorkdayService.getInstance();
  const dateService = DateService.getInstance();

  // reaktive Workdays
  const workdays = computed(() => workdayService.getWorkdays());

  onMounted(() => {
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const workDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      const hoursWorked = workdayService.getHoursWorkedForDay(new Workday(workDate, 0, false));

      workdays.value.push(new Workday(workDate, hoursWorked, false));
    }
  });

  // chart options 
  const chartOptions = computed(() => ({
    tooltip: { trigger: 'axis' },
    grid: { left: '10%', right: '10%', bottom: '10%' },
    xAxis: {
      type: 'category',
      data: workdays.value.map((d) => dateService.normalizeDate(d.date)),
      axisLabel: {
        rotate: 45,
        formatter: (value: string) => value,
      },
    },
    yAxis: {
      type: 'value',
      name: 'Stunden',
    },
    series: [
      {
        name: 'Gearbeitete Stunden',
        data: workdays.value.map((d) => d.hoursWorked),
        type: 'bar',
        color: '#4F46E5',
      },
    ],
  }));
</script>
