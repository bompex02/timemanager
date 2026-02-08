<template>
  <div class="text-text container flex flex-col gap-4 py-10 w-full h-full mx-auto">
    <div class="flex relative w-fit">
      <span>
        <h1>{{ t('projects') }}</h1>
        <p class="text-disabled">{{ t('projectsOverview') }}</p>
      </span>
      <BaseButton
        variant="text"
        class="absolute -right-18"
        @click="$router.push({ name: 'projects-new' })"
      >
        <PlusIcon class="size-8" />
      </BaseButton>
    </div>
    <BaseTabBar
      v-model="currentTab"
      :tabs="[t('ongoing'), t('archive')]"
    />
    <p
      v-if="errorMessage"
      class="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
    >
      {{ errorMessage }}
    </p>
    <div class="flex gap-10 flex-1">
      <template v-if="currentTab === 0">
        <GridsProjects
          class="flex-1"
          :headline="t('activeProjects')"
          :projects="activeProjects"
          :drop-zone-state="ProjectState.Active"
          :dragged-item-id="draggedItemId"
          :deleting-id="deletingId"
          @drag-start="handleDragStart"
          @drag-end="handleDragEnd"
          @drop="handleDrop"
          @edit="handleEdit"
          @delete="handleDelete"
        />
        <GridsProjects
          class="flex-1"
          :headline="t('inactiveProjects')"
          :projects="inactiveProjects"
          :drop-zone-state="ProjectState.Inactive"
          :dragged-item-id="draggedItemId"
          :deleting-id="deletingId"
          @drag-start="handleDragStart"
          @drag-end="handleDragEnd"
          @drop="handleDrop"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </template>
      <template v-else>
        <GridsProjects
          class="flex-1"
          :headline="t('completedProjects')"
          :projects="completedProjects"
          :drop-zone-state="ProjectState.Completed"
          :dragged-item-id="draggedItemId"
          :deleting-id="deletingId"
          @drag-start="handleDragStart"
          @drag-end="handleDragEnd"
          @drop="handleDrop"
          @edit="handleEdit"
          @delete="handleDelete"
        />
        <GridsProjects
          class="flex-1"
          :headline="t('cancelledProjects')"
          :projects="cancelledProjects"
          :drop-zone-state="ProjectState.Cancelled"
          :dragged-item-id="draggedItemId"
          :deleting-id="deletingId"
          @drag-start="handleDragStart"
          @drag-end="handleDragEnd"
          @drop="handleDrop"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import { ProjectState, type Project } from '@shared/types'
import { useUserStore } from '~/stores/user-store'

const { t } = useI18n()
const config = useRuntimeConfig()
const userStore = useUserStore()
const router = useRouter()

const currentTab = ref<number>(0)
const deletingId = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

const projects = ref<Project[]>([])

const API_BASE = config.public.baseApiUrl

const activeProjects = computed(() =>
  projects.value.filter(project => project.state == ProjectState.Active),
)
const inactiveProjects = computed(() =>
  projects.value.filter(project => project.state == ProjectState.Inactive),
)
const completedProjects = computed(() =>
  projects.value.filter(project => project.state == ProjectState.Completed),
)
const cancelledProjects = computed(() =>
  projects.value.filter(project => project.state == ProjectState.Cancelled),
)

// drag and drop composable functions
const { draggedItemId, handleDragStart, handleDragEnd, handleDrop: handleDropComposable } = useDragAndDrop<Project, ProjectState>({
  onDrop: async (project, targetState) => {
    // update project state
    const oldState = project.state
    project.state = targetState

    try {
      await updateProjectState(project._id, targetState)
    }
    catch (error) {
      // revert on error
      project.state = oldState
      throw error
    }
  },
  getItemState: project => project.state as ProjectState,
  getItemId: project => project._id,
})

const handleDrop = (targetState: ProjectState) => {
  handleDropComposable(targetState)
}

// get projects from API for current user
const fetchProjects = async () => {
  try {
    if (!userStore.user?._id)
      throw new Error('Benutzer nicht authentifiziert')

    const response = await fetch(`${API_BASE}/api/projects/user/${userStore.user._id}`)
    if (response.status === 404) {
      projects.value = []
      return
    }
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unbekannter Fehler')
      throw new Error(`Fehler beim Laden der Projekte: ${errorText}`)
    }
    const data = await response.json()
    projects.value = (Array.isArray(data) ? data : []).map((project: Project & { state?: string }) => ({
      ...project,
      state: project.state,
    }))
  }
  catch (err) {
    console.error(err as Error)
    projects.value = []
  }
}

// update specific project state via API
const updateProjectState = async (projectId: string, newState: ProjectState) => {
  const response = await fetch(`${API_BASE}/api/projects/${projectId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ state: newState }),
  })

  if (!response.ok) {
    throw new Error('Fehler beim Aktualisieren des Projektstatus')
  }

  return response.json()
}

const handleEdit = (project: Project) => {
  if (!project._id) {
    errorMessage.value = t('projectLoadError')
    return
  }
  router.push(`/projects/${project._id}`)
}

const handleDelete = async (project: Project) => {
  if (!project._id) {
    errorMessage.value = t('projectDeleteError')
    return
  }
  if (deletingId.value) {
    return
  }
  try {
    errorMessage.value = null
    deletingId.value = project._id
    const response = await fetch(`${API_BASE}/api/projects/${project._id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Delete failed')
    }
    projects.value = projects.value.filter(item => item._id !== project._id)
  }
  catch (error) {
    errorMessage.value = t(error as string)
  }
  finally {
    deletingId.value = null
  }
}

onMounted(() => {
  fetchProjects()
})
</script>
