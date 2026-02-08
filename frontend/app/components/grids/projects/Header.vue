<template>
  <div class="w-fit relative flex items-center pb-2">
    <h3>{{ props.headline }}</h3>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  headline: string
}>()
</script>
