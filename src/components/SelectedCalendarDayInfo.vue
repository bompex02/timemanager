<template>
    <div
      v-if="info?.homeOffice !== null && info?.homeOffice !== undefined"
      class="mt-6 p-6 rounded-xl bg-white shadow-lg"
    >
      <div class="flex items-center gap-3 mb-2">
        <span class="text-2xl">
          {{ info.homeOffice === true ? '🏠' : info.homeOffice === false ? '🏢' : '❓' }}
        </span>
        <h3 class="text-lg font-semibold text-gray-800">
          {{
            info.homeOffice === true
              ? 'Home Office'
              : info.homeOffice === false
              ? 'Büro'
              : 'Unbekannter Arbeitsort'
          }}
        </h3>
      </div>
  
      <div class="text-gray-700 text-base">
        <span v-if="info.hoursWorked > 0">
          Gearbeitete Stunden: <span class="font-medium">{{ info.hoursWorked }}</span> Stunden
        </span>
        <span v-else>
          Keine Arbeitszeit erfasst.
        </span>
      </div>
    </div>
</template>
  
<script setup lang="ts">
  defineProps<{
    info: {
      date: Date
      homeOffice: boolean | null
      hoursWorked: number
    } | null
  }>()
</script>  