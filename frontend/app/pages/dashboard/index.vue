<template>
  <section class="flex flex-col gap-6">
    <header class="flex flex-col gap-1">
      <h1 class="text-text-100">{{ t('dashboard') }}</h1>
      <p class="text-text-300">
        {{ t('dashboardSubtitle') }}
      </p>
    </header>

    <div class="grid gap-6 lg:grid-cols-2">
      <DailyWorkHourChart />
      <ComparisonWorkHourChart />
    </div>

    <AllRecordList />
  </section>
</template>

<script setup lang="ts">
import AllRecordList from '~/components/AllRecordList.vue'
import ComparisonWorkHourChart from '~/components/dashboard/ComparisonWorkHourChart.vue'
import DailyWorkHourChart from '~/components/dashboard/DailyWorkHourChart.vue'

const { t } = useI18n()
</script>
