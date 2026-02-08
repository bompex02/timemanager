<template>
  <section class="min-h-100 rounded-xl bg-surface-200 p-6 shadow-sm shadow-surface-300 ring-1 ring-surface-300/40">
    <h2 class="text-xl font-semibold text-text-100 text-center mb-1">
      {{ t('dashboardMonthlyTitle') }}
    </h2>
    <p class="text-sm text-text-300 text-center mb-4">
      {{ currentMonthLabel }}
    </p>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-surface-300 border-t-text-100"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ error }}
    </div>

    <!-- Empty State -->
    <p
      v-else-if="!workMonth"
      class="rounded-lg border border-dashed border-surface-300 px-4 py-8 text-center text-text-300"
    >
      🚀 {{ t('dashboardEmptyMonthly') }}
    </p>

    <!-- Chart -->
    <ClientOnly v-else>
      <div class="h-78 w-full">
        <VChart class="h-full w-full" :option="chartOptions" autoresize />
      </div>
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import type { WorkMonth } from '@shared/types'
import { useUserStore } from '~/stores/user-store'
const { t } = useI18n()

use([PieChart, TitleComponent, TooltipComponent, LegendComponent, CanvasRenderer])

const config = useRuntimeConfig()
const userStore = useUserStore()

const API_BASE = config.public.baseApiUrl

const workMonth = ref<WorkMonth | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const currentMonthLabel = computed(() => {
  return new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
})

const chartOptions = computed(() => ({
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'horizontal',
    left: 'center',
    top: 0,
    textStyle: {
      color: '#94A3B8',
    },
  },
  series: [
    {
      name: 'Arbeitsstunden',
      type: 'pie',
      radius: '60%',
      center: ['50%', '62%'],
      data: [
        { value: workMonth.value?.hoursWorked ?? 0, name: t('dashboardWorkedHours') },
        { value: workMonth.value?.hoursShouldWork ?? 0, name: t('dashboardPlannedHours') },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 12,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.25)',
        },
      },
    },
  ],
}))

const fetchWorkMonth = async () => {
  loading.value = true
  error.value = null

  if (!userStore.user?._id) {
      throw new Error('Benutzer nicht authentifiziert')
    }

  try {
    console.log('Url:', `${API_BASE}/api/workmonths/user:${userStore.user?._id}`)
  const response = await fetch(`${API_BASE}/api/workmonths/user/${userStore.user?._id}`, {
    })
    if (!response.ok) {
      throw new Error(`Fehler beim Laden der Arbeitsmonatsdaten: ${response.statusText}`)
    }
    const data = await response.json()
    console.log('Fetched work month data:', data)
    workMonth.value = data as WorkMonth
  } catch (err: any) {
    error.value = err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten'
    console.error('Error fetching work month:', err)
    workMonth.value = null 
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  loading.value = false

  fetchWorkMonth();
})
</script>
