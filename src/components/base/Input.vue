<template>
    <div class="w-full px-1 flex flex-col relative" :class="[props.label ? 'pt-1' : 'pt-4']">
        <label for="input" class="flex gap-1 text-white">{{ props.label }}<p v-if="props.required" class="text-red-500">*</p></label>
        <span class="relative">
            <input ref="input" v-bind="$attrs" v-model="model" name="input" class="group border-2 bg-bl border-white text-white focus:border-gray-400 focus:outline-hidden focus:ring-0 rounded-lg py-2 px-2 w-full" />
            <button v-if="$attrs.type === 'password'" class="hover:text-white/70 p-2 absolute top-1/2 right-2 -translate-y-1/2 text-white" @click="togglePasswordVisibilty">
                <EyeSlashIcon v-if="passwordVisible" class="size-5" />
                <EyeIcon v-else class="size-5" />
            </button>
        </span>
    </div>
</template>

<script setup lang="ts">
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid';
import { ref, useTemplateRef } from 'vue'

const props = defineProps<{
    label?: string,
    variant: 'primary',
    required?: boolean,
}>()

defineOptions({
  inheritAttrs: false,
})

const togglePasswordVisibilty = () => {
    if (!input.value) return
    input.value.type = input.value.type === "password" ? "text" : "password"
    passwordVisible.value = !passwordVisible.value
}

const input = useTemplateRef('input')
const passwordVisible = ref<boolean>(false)
const model = defineModel<string | null>()
</script>