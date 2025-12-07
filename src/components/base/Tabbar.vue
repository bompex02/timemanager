<script setup lang="ts">
import { TabsRoot, TabsList, TabsTrigger } from 'reka-ui'
import {ref, computed} from 'vue'

const props = withDefaults(defineProps<{
  tabs: Array<{ text: string, disabled?: boolean } | string>
  dense?: boolean
}>(), {
  dense: false,
})
const selectedIndex = defineModel<number | undefined>()

const tabsAsObjects = computed(() => {
  return props.tabs.map((tab) => {
    if (typeof tab === 'string') {
      return { text: tab }
    }
    return tab
  })
})

const bar = ref<HTMLDivElement | undefined>()
</script>

<template>
  <div class="flex items-center">
    <TabsRoot
      v-model="selectedIndex"
      as-child
    >
      <TabsList as-child>
        <div
          ref="bar"
          class="relative grid flex-1 snap-x snap-proximity grid-flow-col overflow-x-auto scroll-smooth scrollbar-hidden"
          style="grid-auto-columns: 1fr"
          :class="dense ? 'gap-x-2' : 'gap-x-4'"
          tabindex="-1"
        >
          <TabsIndicator class="absolute bottom-0 left-0 h-1 w-(--reka-tabs-indicator-size) translate-x-(--reka-tabs-indicator-position) bg-blue-500 transition-[translate] duration-400" />
          <TabsTrigger
            v-for="(tab, index) in tabsAsObjects"
            :key="tab.text"
            :value="index"
            :disabled="tab.disabled"
            class="snap-start border-b-2 hover:bg-white rounded-t-lg border-white px-2 whitespace-nowrap transition-[font-weight] duration-400
              select-none not-disabled:hover:border-tab-hover focus:outline-hidden disabled:text-button-on-secondary-disabled
              data-[state=active]:border-tab-hover data-[state=active]:font-semibold"
            :class="[dense ? 'py-2' : 'py-4', selectedIndex === index ? 'border-zinc-900': '']"
          >
            {{ tab.text }}
          </TabsTrigger>
        </div>
      </TabsList>
    </TabsRoot>
  </div>
</template>
