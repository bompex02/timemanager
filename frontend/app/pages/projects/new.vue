<template>
  <div class="text-text flex flex-col h-full gap-10 select-none">
    <span>
      <h1>{{ t('newProject') }}</h1>
      <p class="text-disabled">{{ t('addNewProject') }}</p>
    </span>
    <section class="max-w-2xl rounded-xl bg-surface-200 p-6 shadow-sm shadow-surface-300 ring-1 ring-surface-300/40">
      <ProjectForm
        v-model="form"
        :loading="saving"
        :error="error"
        @submit="submit"
        @cancel="cancel"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import ProjectForm from '~/components/projects/ProjectForm.vue'
import { useProjectForm } from '~/composables/useProject'

const { t } = useI18n()
const { form, error, saving, cancel, createProject } = useProjectForm()

const submit = () => {
  createProject()
}
</script>
