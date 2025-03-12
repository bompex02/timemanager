<template>
    <div class="w-[350px] mx-auto p-6 bg-white shadow-lg rounded-2xl flex-shrink-0 flex-grow-0 m-2 max-h-[333px]">
      <h2 class="text-xl text-center font-semibold text-gray-800 mb-4">Zeiterfassungsliste</h2>
      <div class="mt-4 border-t pt-4 text-gray-700 overflow-y-auto max-h-[260px] pr-3">
        <ul class="space-y-2">
          <li v-for="(entry, index) in entries" :key="index" class="flex justify-between">
            <span>{{ entry.type }}</span>
            <span>{{ entry.time }}</span>
          </li>
        </ul>
      </div>
    </div>
</template>
  
<script setup>
  
  defineProps({
    entries: Array,
  });
</script>
  