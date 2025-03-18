<template>
    <span 
      class="inline-block rounded py-1 px-2.5 text-lg font-medium text-white opacity-80" 
      :class="badgeClasses">
      {{ text }}
    </span>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  const props = defineProps({
    text: {
      type: String,
      required: true
    },
    state: {
      type: Boolean,
      required: true
    }
  });
  
  const badgeClasses = computed(() => {
    return props.state ? 'bg-[#10B981]' : 'bg-[#4F46E5]'; // if state is true, use green color, otherwise use blue color
  });
  </script>
  