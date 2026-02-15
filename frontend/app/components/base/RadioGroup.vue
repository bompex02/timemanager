<template>
  <RadioGroupRoot
    v-model="model"
    :orientation="props.direction"
    class="flex gap-8"
  >
    <RadioGroupItem
      v-for="section in sections"
      :key="section"
      :value="section"
      class="flex flex-col items-center"
    >
      <slot :name="section" />
      <div class="size-4 flex items-center justify-center border-text-100 border rounded-full relative">
        <RadioGroupIndicator
          class="block size-1 p-1 rounded-full bg-accent-200"
        />
      </div>
    </RadioGroupItem>
  </RadioGroupRoot>
</template>

<script setup lang="ts">
import { RadioGroupRoot, RadioGroupItem, RadioGroupIndicator } from 'reka-ui'

const props = withDefaults(defineProps<{
  direction?: 'vertical' | 'horizontal'
  type?: 'text' | 'image'
  initialSelection?: string
}>(), {
  direction: 'horizontal',
  type: 'text',
})

const sections = Object.keys(useSlots())
const model = defineModel<string>()

onMounted(() => {
  if (props.initialSelection) model.value = props.initialSelection
})
</script>
