<template>
  <SelectRoot
    v-model="model"
  >
    <SelectTrigger
      class="group items-start flex flex-col justify-start rounded-lg px-2 py-1 shadow-xs relative border-2 w-full"
      :class="[
        props.disabled ? 'border-disabled text-disabled' : 'border-text-100 text-text-100',
      ]"
    >
      <!-- label -->
      <template v-if="props.label">
        <span class="flex items-center gap-0.5">
          <p class="text-xs group">{{ props.label }}</p>
          <p
            v-if="props.required"
            class="text-danger"
          >*</p>
        </span>
      </template>
      <SelectValue>
        {{ model || '-' }}
      </SelectValue>
      <SelectIcon class="group-data-[state=open]:rotate-180 absolute right-3 inset-y-1/4 transition duration-500" />
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        class="z-50 max-h-(--reka-select-content-available-height) w-full min-w-(--reka-select-trigger-width) overflow-auto rounded-lg border-2 border-text-100 bg-text-100 py-2 text-sm shadow-lg text-surface-100"
        :side-offset="6"
        position="popper"
      >
        <SelectViewport>
          <SelectItem
            v-for="item in items"
            :key="item"
            :value="item"
            class="hover:bg-text-200 p-1.5 focus:ring-0 focus:outline-0"
          >
            <SelectItemText>
              {{ item }}
            </SelectItemText>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<script setup lang="ts">
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'

const props = defineProps<{
  items: Array<string>
  disabled?: boolean
  label?: string
  required?: boolean
}>()

const model = defineModel<string>()
</script>
