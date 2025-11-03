<template>
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4">Neues Projekt erstellen</h2>
        <form @submit.prevent="submit">
          <input v-model="name" placeholder="Projektname" class="w-full p-2 border rounded mb-3" />
          <textarea v-model="description" placeholder="Projektbeschreibung" class="w-full p-2 border rounded mb-3" />
          <select v-model="state" class="w-full p-2 border rounded mb-4">
            <option disabled value="">Status wählen</option>
            <option value="Aktiv">Aktiv</option>
            <option value="Inaktiv">Inaktiv</option>
            <option value="Abgeschlossen">Abgeschlossen</option>
            <option value="Abgebrochen">Abgebrochen</option>
          </select>
          <div class="flex justify-end gap-2">
            <button type="button" @click="$emit('closeComponent')" class="px-4 py-2 rounded bg-gray-200"><i class="pi pi-times pr-1"></i>Abbrechen</button>
            <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white"><i class="pi pi-save pr-1"></i>Speichern</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import { Project, ProjectState } from '../models/Project'

  const props = defineProps<{ project?: Project | null }>()
  
  const emit = defineEmits(['saveProject', 'closeComponent', 'saveEditProject'])
  
  const name = ref('')
  const description = ref('')
  const state = ref<ProjectState | ''>('')

  watch(
  () => props.project,
  (p) => {
    if (p) {
      name.value = p.name
      description.value = p.description
      state.value = p.state
    } else {
      name.value = ''
      description.value = ''
      state.value = ProjectState.Active
    }
  },
  { immediate: true }
)
  
  const submit = () => {
    if (!name.value || !description.value || !state.value) return
    if (props.project) {
      emit('saveEditProject', {
        id: props.project.id,
        name: name.value,
        description: description.value,
        state: state.value
      })
    } else
    emit('saveProject', {
      name: name.value,
      description: description.value,
      state: state.value
    })
    name.value = ''
    description.value = ''
    state.value = ''
  }
</script>