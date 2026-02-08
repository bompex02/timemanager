<template>
  <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
    <BaseInput
      v-model="model.name"
      :label="t('projectName')"
      required
    />

    <label class="flex flex-col gap-2 text-sm text-text-300">
      <span>{{ t('projectDescription') }}</span>
      <BaseInput
        v-model="model.description"
        rows="4"
        class="w-full rounded-lg border border-surface-300 bg-surface-200 px-3 py-2 text-text-100 outline-none focus:border-input-on-active"
      />
    </label>

    <label class="flex flex-col gap-2 text-sm text-text-300">
      <span>{{ t('projectState') }}</span>
      <select
        v-model="model.state"
        class="w-full rounded-lg border border-surface-300 bg-surface-200 px-3 py-2 text-text-100 outline-none focus:border-input-on-active"
      >
        <option v-for="option in stateOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <p v-if="props.error" class="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
      {{ props.error }}
    </p>

    <div class="flex items-center gap-3">
      <BaseButton variant="primary" :disabled="props.loading" @click="handleSubmit">
        {{ t('projectSave') }}
      </BaseButton>
      <BaseButton variant="text" :disabled="props.loading" @click="handleCancel">
        {{ t('projectCancel') }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ProjectState } from '@shared/types'

const props = defineProps<{
  loading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  (event: 'submit'): void
  (event: 'cancel'): void
}>()

const model = defineModel<{
  name: string
  description: string
  state: ProjectState
}>({
  default: () => ({
    name: '',
    description: '',
    state: ProjectState.Active,
  }),
})

const stateOptions = computed(() => [
  { value: ProjectState.Active, label: t('projectStateActive') },
  { value: ProjectState.Inactive, label: t('projectStateInactive') },
  { value: ProjectState.Completed, label: t('projectStateCompleted') },
  { value: ProjectState.Cancelled, label: t('projectStateCancelled') },
])

const handleSubmit = () => {
  emit('submit')
}

const handleCancel = () => {
  emit('cancel')
}

const { t } = useI18n()
</script>
