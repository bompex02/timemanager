<template>
    <div class="w-[350px] px-1 flex flex-col" :class="[props.label ? 'pt-1' : 'pt-4']">
        <label for="input" class="text-sm text-black">{{ props.label }}</label>
        <input v-model="model" name="input" class="border-3 border-black rounded-lg p-1 w-full" />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    label?: string
}>()

const model = defineModel<string | null>()
</script>