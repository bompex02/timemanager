<template>
    <div class="w-[350px] px-1 flex flex-col" :class="[props.label ? 'pt-1' : 'pt-4']">
        <label for="input" class="text-sm text-black">{{ props.label }}</label>
        <input v-model="model" name="input" class="group border-2 border-black focus:border-gray-400 focus:outline-hidden focus:ring-0 rounded-lg py-1 px-2 w-full" />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    label?: string
}>()

const model = defineModel<string | null>()
</script>