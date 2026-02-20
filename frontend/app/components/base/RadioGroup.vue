<template>
  <RadioGroupRoot
    v-model="model"
    :orientation="direction"
    class="flex gap-8"
    :class="[direction === 'vertical' ? 'flex': 'flex-col']"
  >
    <RadioGroupItem
      v-for="section in sections"
      :key="section"
      :value="section"
      :class="[
        direction === 'vertical' ? 'flex flex-col items-center': 'flex flex-row-reverse items-center gap-2 justify-center',
      ]"
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

const { direction = 'horizontal', initialSelection } = defineProps<{
  direction?: 'vertical' | 'horizontal'
  type?: 'text' | 'image'
  initialSelection?: string
}>()

const sections = Object.keys(useSlots())
const model = defineModel<string>()

onMounted(() => {
  if (initialSelection) model.value = initialSelection
})
</script>
