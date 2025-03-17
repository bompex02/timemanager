<template>
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[400px]">
      <h2 class="text-xl font-semibold text-gray-800 text-center mb-4">
        Monatlicher Vergleich: Geleistete vs. Geplante Stunden
      </h2>
  
      <!-- if there are no entries -->
      <p v-if="!workMonth" class="text-center text-gray-600">
        🚀 Noch keine Arbeitszeiten für diesen Monat vorhanden.
      </p>
  
      <!-- if there are entries -->
      <v-chart v-else class="w-full h-64 min-h-[300px]" :option="chartOptions" autoresize />
    </div>
</template>
  
<script setup lang="ts">
    import { computed, ref, onMounted } from 'vue';
    import VChart from 'vue-echarts';
    import { WorkMonth } from '../models/WorkMonth';
    import { WorkMonthService } from '../services/WorkMonthService';
    import { DateService } from '../services/DateService';
    import { use } from 'echarts/core';
    import { PieChart } from 'echarts/charts';
    import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
    import { CanvasRenderer } from 'echarts/renderers';

    use([PieChart, TitleComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

    // services singletons
    const workMonthService = WorkMonthService.getInstance();
    const dateService = DateService.getInstance();

    // current month
    const workMonth = ref<WorkMonth | null>(null);

    onMounted(() => {
    const today = dateService.getCurrentDate();
    const month = today.getMonth();
    const year = today.getFullYear();

    workMonth.value = workMonthService.getWorkMonth(year, month);
    });

    // Chart Optionen für ECharts
    const chartOptions = computed(() => ({
    title: {
        subtext: dateService.formatMonthYear(dateService.getCurrentDate()), 
        left: 'center'
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'left'
    },
    series: [
        {
        name: 'Arbeitsstunden',
        type: 'pie',
        radius: '50%',
        data: [
            { value: workMonth.value?.hoursWorked || 0, name: 'Geleistete Stunden' },
            { value: workMonth.value?.hoursShouldWork || 0, name: 'Geplante Stunden' },
        ],
        emphasis: {
            itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
        }
    ]
    }));
</script>
