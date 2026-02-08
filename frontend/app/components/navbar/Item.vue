<template>
  <NuxtLink
    class="text-white text-xl flex items-center hover:bg-button-hover/10 rounded-lg gap-4 py-4 px-2.5"
    :class="[
      isActiveNavItem ? 'bg-button-hover/10' : '',
    ]"
    :to="props.item.path"
  >
    <component
      :is="props.item.icon"
      v-if="isOpen"
      class="size-8 shrink-0"
    />
    <Transition>
      <NavbarHoverCard
        v-if="!isOpen"
      >
        <template #trigger>
          <component
            :is="props.item.icon"
            class="size-8 shrink-0 ml-0.5"
          />
        </template>
        <template #content>
          <p>
            {{ t(props.item.text) }}
          </p>
        </template>
      </NavbarHoverCard>
    </Transition>
    <Transition name="fade-slide">
      <p
        v-if="props.isOpen"
        class="whitespace-nowrap"
      >
        {{ t(props.item.text) }}
      </p>
    </Transition>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { MenuItem } from './nav-menus'

const props = defineProps<{
  item: MenuItem
  isOpen: boolean
}>()

const route = useRoute()
const { t } = useI18n()

const isActiveNavItem = computed(() => route.path === props.item.path)
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
