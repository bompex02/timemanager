<template>
  <section class="min-h-100 rounded-xl bg-surface-200 p-6 shadow-sm shadow-surface-300 ring-1 ring-surface-300/40">
    <h2 class="text-xl font-semibold text-text-100 text-center mb-1">
      {{ t('dashboardDailyTitle') }}
    </h2>
    <p class="text-sm text-text-300 text-center mb-4">
      {{ t('dashboardDailySubtitle') }}
    </p>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-surface-300 border-t-text-100"></div>
    </div>

    <!-- FOR DEBUG -->
    <div v-else-if="error" class="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ error }}
    </div>

    <!-- Empty State -->
    <p
      v-else-if="workdays.length === 0"
      class="rounded-lg border border-dashed border-surface-300 px-4 py-8 text-center text-text-300"
    >
      🚀 {{ t('dashboardEmptyDaily') }}
    </p>

    <!-- Chart -->
    <ClientOnly v-else>
      <VChart class="h-96 w-full" :option="chartOptions" autoresize />
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import type { Workday } from '@shared/types'
import { useUserStore } from '~/stores/user-store'
const { t } = useI18n()

use([BarChart, GridComponent, TooltipComponent, CanvasRenderer])

const config = useRuntimeConfig()
const userStore = useUserStore()

// State
const workdays = ref<Workday[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const API_BASE = config.public.baseApiUrl

// Helper Functions
const formatShortDate = (iso?: string): string => {
  if (!iso) return ''
  const date = new Date(iso)
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
}

// Chart Configuration
const chartOptions = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    formatter: (params: any) => {
      const data = params[0]?.data
      if (!data) return ''
      const homeOfficeText = data.homeOffice? `🏡 ${t('dashboardHomeOffice')}`: `🏢 ${t('dashboardOffice')}`
      return `
        <strong>${params[0].axisValue}</strong><br/>
        ⏳ <strong>${data.value}</strong> ${t('dashboardHoursUnit')}<br/>
        ${homeOfficeText}
      `
    },
  },
  grid: {
    left: '10%',
    right: '10%',
    bottom: '15%',
    top: '8%',
  },
  xAxis: {
    type: 'category',
    data: workdays.value.map((workday) => formatShortDate(workday.date)),
    axisLabel: {
      rotate: 45,
    },
  },
  yAxis: {
    type: 'value',
    name: t('dashboardHoursUnit'),
  },
  series: [
    {
      name: t('dashboardWorkedHours'),
      type: 'bar',
      data: workdays.value.map((workday) => ({
        value: Number(workday.hoursWorked ?? 0).toFixed(2),
        homeOffice: workday.homeOffice,
        itemStyle: {
          color: workday.homeOffice ? '#10B981' : '#4F46E5',
        },
      })),
    },
  ],
}))

// API Call
const getWorkdaysOfLast2Weeks = async (userId: string): Promise<Workday[]> => {
  const response = await fetch(`${API_BASE}/api/workdays/last2weeks/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unbekannter Fehler')
    throw new Error(`Fehler beim Laden der Arbeitstage: ${errorText}`)
  }
  
  return response.json()
}

// Main Fetch Function
const fetchWorkdays = async (): Promise<void> => {
  try {
    loading.value = true
    error.value = null

    if (!userStore.user?._id) {
      throw new Error('Benutzer nicht authentifiziert')
    }

    workdays.value = await getWorkdaysOfLast2Weeks(userStore.user._id)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten'
    console.error('Error fetching workdays:', err)
    workdays.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchWorkdays()
})
</script>
