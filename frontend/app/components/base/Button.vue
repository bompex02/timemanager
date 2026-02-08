<template>
  <button
    type="button"
    :disabled="props.disabled"
    class="rounded-lg w-fit text-lg"
    :class="variantStyling"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  variant: 'primary' | 'secondary' | 'text'
  disabled?: boolean
}>()

// add styling for different variants
const variantStyling = computed(() => {
  if (props.variant === 'primary')
    return 'bg-primary-300 border-button text-text-100 hover:bg-button-hover py-2 px-4'
  if (props.variant === 'secondary')
    return ''
  if (props.variant === 'text')
    return 'hover:bg-button-hover/10 py-2 px-4'
  return ''
})
</script>
