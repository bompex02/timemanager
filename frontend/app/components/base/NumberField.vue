<template>
  <NumberFieldRoot
    v-model="model"
    invert-wheel-change
    :min="props.minValue"
    :max="props.maxValue"
    class="flex flex-col px-2 py-1 border-2 rounded-lg w-fit shadow-xs focus-within:border-input-on-active focus-within:text-input-on-active"
  >
    <template v-if="props.label">
      <span class="flex items-center gap-0.5">
        <p class="text-xs group">{{ props.label }}</p>
        <p
          v-if="props.required"
          class="text-danger"
        >*</p>
      </span>
    </template>
    <div
      class="items-start gap-2 relative"
      :class="[
        props.disabled ? 'border-disabled text-disabled' : 'border-text-100 text-text-100',
      ]"
    >
      <NumberFieldInput class="w-24 ring-0 outline-0 text-text" />
      <span class="absolute right-0 space-x-2">
        <NumberFieldDecrement class="hover:bg-button-hover/10 rounded-lg">
          <MinusIcon class="size-5" />
        </NumberFieldDecrement>
        <NumberFieldIncrement class="hover:bg-button-hover/10 rounded-lg">
          <PlusIcon class="size-5" />
        </NumberFieldIncrement>
      </span>
    </div>
  </NumberFieldRoot>
</template>

<script setup lang="ts">
import { NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput, NumberFieldRoot } from 'reka-ui'
import { MinusIcon, PlusIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  label: string
  minValue?: number
  maxValue?: number
  disabled?: boolean
  required?: boolean
}>()

const model = defineModel<number>({ default: 0 })
</script>
