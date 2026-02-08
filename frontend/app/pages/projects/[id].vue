<template>
  <div class="text-text flex flex-col h-full gap-10 select-none">
    <span>
      <h1>{{ t('editProject') }}</h1>
      <p class="text-disabled">{{ t('editProjectSubtitle') }}</p>
    </span>
    <section class="max-w-2xl rounded-xl bg-surface-200 p-6 shadow-sm shadow-surface-300 ring-1 ring-surface-300/40">
      <div v-if="loading" class="text-sm text-text-300">
        {{ t('loading') }}
      </div>
      <ProjectForm
        v-else
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
const route = useRoute()
const { form, error, loading, saving, cancel, loadProject, updateProject } = useProjectForm()

const projectId = computed(() => route.params.id as string | undefined)

const submit = () => {
  if (!projectId.value) {
    error.value = t('projectUpdateError')
    return
  }
  updateProject(projectId.value)
}

onMounted(() => {
  if (!projectId.value) {
    error.value = t('projectLoadError')
    return
  }
  loadProject(projectId.value)
})
</script>
