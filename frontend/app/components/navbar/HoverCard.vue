<template>
  <HoverCardRoot>
    <HoverCardTrigger>
      <slot name="trigger" />
    </HoverCardTrigger>
    <HoverCardPortal>
      <HoverCardContent
        class="bg-primary-500 p-4 rounded-lg"
        side="right"
        :side-offset="35"
      >
        <slot name="content" />
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>

<script setup lang="ts">
import { HoverCardContent, HoverCardPortal, HoverCardRoot, HoverCardTrigger } from 'reka-ui'
</script>
