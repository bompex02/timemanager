<template>
  <div class="w-full px-1 flex flex-col relative" :class="[props.label ? 'pt-1' : 'pt-4']">
    <label v-if="props.label" for="input" class="flex gap-1" :class="labelClass">
      {{ props.label }}<p v-if="props.required" class="text-red-500">*</p>
    </label>
    <span class="relative">
      <input
        ref="input"
        v-bind="$attrs"
        v-model="model"
        name="input"
        class="group rounded-lg py-2 px-2 w-full focus:outline-hidden focus:ring-0 transition"
        :class="inputClass"
      />
      <button
        v-if="$attrs.type === 'password' && props.password"
        class="p-2 absolute top-1/2 right-2 -translate-y-1/2"
        :class="iconClass"
        @click="togglePasswordVisibilty"
      >
        <EyeSlashIcon v-if="passwordVisible" class="size-5" />
        <EyeIcon v-else class="size-5" />
      </button>
    </span>
  </div>
</template>

<script setup lang="ts">
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid';
import { computed, ref, useTemplateRef } from 'vue';

const props = withDefaults(
  defineProps<{
    label?: string;
    variant?: 'primary' | 'light';
    required?: boolean;
    password?: boolean;
  }>(),
  {
    variant: 'primary',
  }
);

defineOptions({
  inheritAttrs: false,
});

const inputClass = computed(() =>
  props.variant === 'light'
    ? 'border border-gray-300 bg-white text-gray-900 focus:border-gray-500'
    : 'border-2 border-white bg-transparent text-white focus:border-gray-400'
);

const labelClass = computed(() => (props.variant === 'light' ? 'text-gray-800' : 'text-white'));
const iconClass = computed(() => (props.variant === 'light' ? 'text-gray-700 hover:text-gray-500' : 'text-white hover:text-white/70'));

const togglePasswordVisibilty = () => {
  if (!input.value || !props.password) return;
  input.value.type = input.value.type === 'password' ? 'text' : 'password';
  passwordVisible.value = !passwordVisible.value;
};

const input = useTemplateRef('input');
const passwordVisible = ref<boolean>(false);
const model = defineModel<string | number | null>();
</script>