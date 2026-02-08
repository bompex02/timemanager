<template>
  <div
    class="group rounded-lg border border-surface-300 bg-surface-200/70 p-3 transition-opacity"
    :class="props.isDragging ? 'opacity-50' : ''"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="text-sm font-semibold text-text-100">
          {{ props.project.name || '—' }}
        </div>
        <p v-if="props.project.description" class="text-xs text-text-300">
          {{ props.project.description }}
        </p>
      </div>
      <div ref="menuContainer" class="relative flex items-center text-xs text-text-300">
        <button
          type="button"
          class="flex items-center justify-center rounded-md p-1 transition-colors hover:bg-surface-300/60 hover:text-text-100"
          @click.stop="toggleMenu"
          @mousedown.stop
          @dragstart.stop
        >
          <EllipsisVerticalIcon class="size-6" />
        </button>
        <div
          v-if="isMenuOpen"
          class="absolute right-0 top-7 z-10 w-36 rounded-md border border-surface-300 bg-surface-200 shadow-lg shadow-surface-300"
          @click.stop
        >
          <button
            type="button"
            class="flex w-full items-center justify-between px-3 py-2 text-left text-xs text-text-200 transition-colors hover:bg-surface-300/60 hover:text-text-100"
            @click="emitEdit"
            @mousedown.stop
          >
            {{ t('projectEdit') }}
          </button>
          <button
            type="button"
            class="flex w-full items-center justify-between px-3 py-2 text-left text-xs text-red-200 transition-colors hover:bg-red-500/10"
            :disabled="isDeleting"
            @click="openDeleteConfirm"
            @mousedown.stop
          >
            {{ t('projectDelete') }}
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="confirmingDelete"
      class="mt-3 rounded-md border border-red-500/30 bg-red-500/10 p-2 text-xs text-red-100"
    >
      <div class="font-semibold">
        {{ t('projectDeleteConfirm') }}
      </div>
      <div class="text-red-200/80">
        {{ t('projectDeleteWarning') }}
      </div>
      <div class="mt-2 flex items-center gap-2">
        <button
          type="button"
          class="rounded-md bg-red-500/20 px-2 py-1 text-xs text-red-100 transition-colors hover:bg-red-500/30"
          :disabled="isDeleting"
          @click.stop="confirmDelete"
          @mousedown.stop
          @dragstart.stop
        >
          {{ t('projectDelete') }}
        </button>
        <button
          type="button"
          class="rounded-md px-2 py-1 text-xs text-text-300 transition-colors hover:bg-surface-300/60"
          @click.stop="cancelDelete"
          @mousedown.stop
          @dragstart.stop
        >
          {{ t('projectCancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EllipsisVerticalIcon } from '@heroicons/vue/24/outline'
import type { Project } from '@shared/types'

const props = defineProps<{
  project: Project
  isDragging?: boolean
  deletingId?: string | null
}>()

const emit = defineEmits<{
  (event: 'drag-start', project: Project, eventObj?: DragEvent): void
  (event: 'drag-end', project: Project): void
  (event: 'edit', project: Project): void
  (event: 'delete', project: Project): void
}>()

const menuContainer = ref<HTMLElement | null>(null)
const isMenuOpen = ref(false)
const confirmingDelete = ref(false)
const isDeleting = computed(() =>
  Boolean(props.deletingId && (props.project._id ?? props.project.name) === props.deletingId)
)

const handleDragStart = (event: DragEvent) => {
  emit('drag-start', props.project, event)
}

const handleDragEnd = () => {
  emit('drag-end', props.project)
}

const emitEdit = () => {
  isMenuOpen.value = false
  emit('edit', props.project)
}

const openDeleteConfirm = () => {
  isMenuOpen.value = false
  confirmingDelete.value = true
}

const cancelDelete = () => {
  confirmingDelete.value = false
}

const confirmDelete = () => {
  confirmingDelete.value = false
  emit('delete', props.project)
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleDocumentClick = (event: MouseEvent) => {
  if (!isMenuOpen.value) {
    return
  }
  const target = event.target as Node
  if (menuContainer.value && !menuContainer.value.contains(target)) {
    isMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})

const { t } = useI18n()
</script>
