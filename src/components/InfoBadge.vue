<template>
  <span 
    class="inline-block rounded py-1 px-2.5 text-sm font-medium text-white opacity-90" 
    :class="badgeClasses">
    {{ text }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ProjectState } from '../models/Project';

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  }
})

const badgeClasses = computed(() => {
  switch (props.state) {
    case ProjectState.Active:
      return 'bg-green-500';
    case ProjectState.Inactive:
      return 'bg-yellow-500';
    case ProjectState.Completed:
      return 'bg-blue-500';
    case ProjectState.Cancelled:
      return 'bg-red-500';
    case 'office':
      return 'bg-indigo-600';
    case 'homeoffice':
      return 'bg-emerald-500';
    default:
      return 'bg-gray-400';
  }
})
</script>
