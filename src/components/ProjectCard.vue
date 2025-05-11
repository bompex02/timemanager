<template>
    <div class="bg-white rounded-2xl shadow p-4 hover:shadow-md transition relative">
      <div class="flex justify-between items-start mb-2">
        <div>
          <h3 class="text-lg font-semibold text-gray-800">{{ project.name }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ project.description }}</p>
        </div>
        <div class="flex items-center gap-2">
            <InfoBadge :text="project?.state ?? ''" :state="project?.state ?? ''" />
            <button @click="toggleMenu" class="text-gray-500 hover:text-gray-700">
            <i class="pi pi-ellipsis-v"></i>
          </button>
        </div>
      </div>
  
      <!-- Optionen Dropdown -->
      <div
        v-if="menuOpen"
        class="absolute right-4 top-12 bg-white border rounded-xl shadow z-10 w-40"
      >
        <button
          class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          @click="$emit('edit', project)"
        >
          ✏️ Bearbeiten
        </button>
        <button
          class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          @click="$emit('delete', project.id)"
        >
          🗑️ Löschen
        </button>
        <div class="border-t my-1"></div>
        <div class="px-4 py-2 text-xs text-gray-400">Status ändern</div>
        <button
          v-for="s in statusOptions"
          :key="s"
          class="block w-full text-left px-4 py-1 text-sm hover:bg-gray-100"
          @click="changeStatus(s)"
        >
          {{ s }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import InfoBadge from '../components/InfoBadge.vue'
  import { Project, ProjectState } from '../models/Project'
  
  const props = defineProps<{
    project: Project
  }>()
  
  const emit = defineEmits(['edit', 'delete', 'statusChange'])
  
  const menuOpen = ref(false)
  const toggleMenu = () => (menuOpen.value = !menuOpen.value)
  
  const statusOptions = Object.values(ProjectState).filter(
    s => s !== props.project.state
  )
  
  const changeStatus = (newState: ProjectState) => {
    emit('statusChange', { id: props.project.id, newState })
    menuOpen.value = false
  }
  </script>
  