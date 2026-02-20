<template>
  <div
    class="text-white p-4 px-8 flex items-center w-full gap-3"
    :class="props.isOpen ? 'justify-start' : 'justify-center px-4'"
  >
    <UserAvatar
      v-if="props.isOpen"
      :size="40"
      class="ring-2 ring-white/20 shadow-md"
    />
    <Transition name="fade-slide">
      <p
        v-if="props.isOpen"
        class="flex-1 text-xl"
      >
        {{ userStore.displayName }}
      </p>
    </Transition>
    <BaseButton
      variant="text"
      :class="props.isOpen ? 'ml-auto' : ''"
      @click="logout"
    >
      <ArrowRightEndOnRectangleIcon class="size-8" />
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { ArrowRightEndOnRectangleIcon } from '@heroicons/vue/24/outline'
import UserAvatar from '../User-Avatar.vue'

const { logout } = useAuth()
const userStore = useUserStore()

const props = defineProps<{
  isOpen: boolean
}>()
</script>

<style scoped>
.fade-slide-enter-active {
  transition: all 0.2s ease-out;
}

.fade-slide-leave-active {
  transition: all 0.1s ease-in;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-6px);
}

.fade-slide-leave-to {
  opacity: 0;
}
</style>
