<template>
  <div class="space-y-2 h-full flex flex-col">
    <GridsProjectsHeader
      :headline="props.headline"
    />
    <div
      v-if="props.projects.length"
      class="flex-1 space-y-2 overflow-y-auto rounded-xl bg-surface-200 p-3 shadow shadow-surface-300 transition-colors"
      :class="isDragOver ? 'bg-accent-100/60 ring-2 ring-accent-300' : ''"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="onDrop"
    >
      <GridsProjectsItem
        v-for="project in props.projects"
        :key="project._id ?? project.name"
        :project="project"
        :is-dragging="isDragging(project)"
        :deleting-id="props.deletingId"
        @drag-start="emitDragStart"
        @drag-end="emitDragEnd"
        @edit="emitEdit"
        @delete="emitDelete"
      />
    </div>
    <div
      v-else
      class="text-disabled flex-1 flex flex-col text-center justify-center h-full bg-surface-200 rounded-xl shadow shadow-surface-300 transition-colors"
      :class="isDragOver ? 'bg-accent-100/60 ring-2 ring-accent-300' : ''"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="onDrop"
    >
      {{ t('noProjects') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProjectState, type Project } from '@shared/types'
import { useDropZone } from '~/composables/useDragAndDrop'
import GridsProjectsItem from './Item.vue'

const props = defineProps<{
  headline: string
  projects: Project[]
  dropZoneState: ProjectState
  draggedItemId?: string | null
  deletingId?: string | null
}>()

const emit = defineEmits<{
  (event: 'drop', state: ProjectState): void
  (event: 'drag-start', project: Project, eventObj?: DragEvent): void
  (event: 'drag-end', project: Project): void
  (event: 'edit', project: Project): void
  (event: 'delete', project: Project): void
}>()

const { isDragOver, handleDragOver, handleDragLeave, handleDrop: handleDropZone } = useDropZone()

const onDrop = (event: DragEvent) => {
  handleDropZone(event, () => emit('drop', props.dropZoneState))
}

const emitDragStart = (project: Project, event?: DragEvent) => {
  emit('drag-start', project, event)
}

const emitDragEnd = (project: Project) => {
  emit('drag-end', project)
}

const emitEdit = (project: Project) => {
  emit('edit', project)
}

const emitDelete = (project: Project) => {
  emit('delete', project)
}

const isDragging = (project: Project): boolean => {
  return Boolean(props.draggedItemId && (project._id ?? project.name) === props.draggedItemId)
}

const { t } = useI18n()
</script>
