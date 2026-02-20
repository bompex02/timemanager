<template>
  <div
    class="avatar"
    :style="{
      backgroundColor: avatarColor,
      width: size + 'px',
      height: size + 'px',
      fontSize: size * 0.4 + 'px',
    }"
  >
    {{ initials }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  size?: number
}>()

const size = computed(() => props.size ?? 40)

// get the displayname of the current user
const userStore = useUserStore()
const displayName = computed(() => userStore.displayName)

// create initials from user displyname
const initials = computed(() => {
  const name = displayName.value.trim()
  if (!name || name === '-') return '?'

  return name
    .split(' ')
    .map(n => n.trim())
    .filter(Boolean)
    .map(n => n.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

// choose random avatar color
const avatarColor = computed(() => {
  const colors = [
    '#4F46E5', '#7C3AED', '#DB2777', '#DC2626',
    '#D97706', '#059669', '#0284C7', '#0891B2',
  ]

  const str = displayName.value || '?'
  const hash = [...str].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return colors[hash % colors.length]
})
</script>

<style scoped>
.avatar {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  letter-spacing: 0.05em;
  flex-shrink: 0;
  user-select: none;
}
</style>
