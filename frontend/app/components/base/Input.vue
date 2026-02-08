<template>
  <label
    class="flex flex-col justify-center rounded-lg px-2 py-1 shadow-xs relative border-2 focus-within:border-input-on-active focus-within:text-input-on-active"
    :class="[
      props.disabled ? 'border-disabled text-disabled' : 'border-text-100 text-text-100',
    ]"
  >
    <!-- label of input -->
    <template v-if="props.label">
      <span class="flex items-center gap-0.5">
        <p class="text-xs group">{{ props.label }}</p>
        <p
          v-if="props.required"
          class="text-danger"
        >*</p>
      </span>
    </template>
    <!-- input -->
    <input
      ref="input"
      v-model="model"
      :disabled="props.disabled"
      :type="props.type === 'password' ? (isClearText? 'text': 'password') : props.type"
      class="ring-0 outline-0 text-text"
    >
    <!-- eye button for type password -->
    <template v-if="props.type === 'password'">
      <button
        class="absolute right-4"
        @click="toggle"
      >
        <EyeIcon
          v-if="!isClearText"
          class="size-5"
        />
        <EyeSlashIcon
          v-else
          class="size-5"
        />
      </button>
    </template>
  </label>
</template>

<script setup lang="ts">
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

defineOptions({
  inheritAttrs: false,
})
const props = withDefaults(defineProps<{
  type?: 'text' | 'number' | 'password'
  label?: string
  disabled?: boolean
  required?: boolean

}>(), {
  type: 'text',
})

// refs
const input = useTemplateRef('input')
const model = defineModel<string | number>()
const isClearText = ref<boolean>(false)

// functions
function focus() {
  input.value?.focus()
}

function toggle() {
  isClearText.value = !isClearText.value
}

defineExpose({
  focus,
})
</script>
