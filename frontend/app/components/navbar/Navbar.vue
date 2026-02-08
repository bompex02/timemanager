<template>
  <nav
    class="flex flex-col bg-primary-500 text-white rounded-xl relative items-center justify-center transition-all duration-500"
    :class="[!isOpen ? 'w-20' : 'w-[20rem]']"
  >
    <NavbarHeader class="absolute top-2 inset-x-0" />
    <!-- refactor to Navbar Item component -->
    <div
      class="flex flex-col w-full gap-2 p-3"
    >
      <NavbarItem
        v-for="item in MenuItems"
        :key="item.path"
        :item="item"
        :is-open="isOpen"
      />
    </div>
    <div
      class="rounded-full p-2 bg-button hover:bg-button-hover text-black absolute -right-4.5 bottom-50"
      @click="toggle"
    >
      <ChevronDoubleRightIcon
        class="size-6 transition duration-300"
        :class="[isOpen ? 'rotate-180' : '']"
      />
    </div>
    <NavbarFooter
      :is-open="isOpen"
      class="absolute bottom-1 inset-x-0"
    />
  </nav>
</template>

<script setup lang="ts">
import { MenuItems } from './nav-menus'
import { ChevronDoubleRightIcon } from '@heroicons/vue/24/outline'

const isOpen = useLocalStorage('isNavbarOpen', true)

async function toggle() {
  isOpen.value = !isOpen.value
}
</script>
