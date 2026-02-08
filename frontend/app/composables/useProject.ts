import { ProjectState } from '@shared/types'
import { useUserStore } from '~/stores/user-store'

export const useProjectForm = () => {
  const { t } = useI18n()
  const config = useRuntimeConfig()
  const router = useRouter()
  const userStore = useUserStore()

  const API_BASE = config.public.baseApiUrl

  const form = reactive({
    name: '',
    description: '',
    state: ProjectState.Active,
  })

  const error = ref<string | null>(null)
  const loading = ref(false)
  const saving = ref(false)

  const cancel = () => {
    router.push('/projects')
  }

  const validate = () => {
    if (!form.name.trim()) {
      error.value = t('allFieldsRequired')
      return false
    }
    return true
  }

  const buildPayload = () => ({
    name: form.name.trim(),
    description: form.description.trim(),
    state: form.state,
  })

  const createProject = async () => {
    try {
      error.value = null
      if (!validate()) {
        return
      }

      if (!userStore.user?._id) {
        error.value = t('loginError')
        return
      }

      saving.value = true
      const payload = {
        userId: userStore.user._id,
        ...buildPayload(),
      }

      const response = await fetch(`${API_BASE}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unbekannter Fehler')
        throw new Error(errorText)
      }

      await router.push('/projects')
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten'
    } finally {
      saving.value = false
    }
  }

  const loadProject = async (projectId: string) => {
    try {
      error.value = null
      loading.value = true
      const response = await fetch(`${API_BASE}/api/projects/${projectId}`)
      if (!response.ok) {
        throw new Error('Load failed')
      }
      const data = await response.json()
      form.name = data.name ?? ''
      form.description = data.description ?? ''
      form.state = data.state ?? ProjectState.Active
    } catch (_err) {
      error.value = t('projectLoadError')
    } finally {
      loading.value = false
    }
  }

  const updateProject = async (projectId: string) => {
    try {
      error.value = null
      if (!validate()) {
        return
      }

      saving.value = true
      const response = await fetch(`${API_BASE}/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      })

      if (!response.ok) {
        throw new Error('Update failed')
      }

      await router.push('/projects')
    } catch (_err) {
      error.value = t('projectUpdateError')
    } finally {
      saving.value = false
    }
  }

  return {
    form,
    error,
    loading,
    saving,
    cancel,
    createProject,
    loadProject,
    updateProject,
  }
}
