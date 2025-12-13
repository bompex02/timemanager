<template>
    <div class="w-full px-1 flex flex-col relative" :class="[props.label ? 'pt-1' : 'pt-4']">
        <label for="input" class="text-sm text-black">{{ props.label }}</label>
        <input ref="input" v-bind="$attrs" v-model="model" name="input" class="group border-2 bg-white border-black focus:border-gray-400 focus:outline-hidden focus:ring-0 rounded-lg py-1 px-2 w-full" />
        <button v-if="$attrs.type === 'password'" class="absolute top-1/2 right-3.5 pt-0.5"><EyeIcon class="size-5" /></button>
    </div>
</template>

<script setup lang="ts">
import { EyeIcon } from '@heroicons/vue/24/solid';

const props = withDefaults(defineProps<{
    label?: string,
    variant: 'primary' | 'password', 
}>(), {variant: 'primary'})

defineOptions({
  inheritAttrs: false,
})

const model = defineModel<string | null>()
</script>