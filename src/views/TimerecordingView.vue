<template>
  <div class="flex gap-5">
    <TimeRecording @update-time-entry="addTimeEntry"/>
    <TimeEntryList :entries="timeEntries" />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import TimeEntryList from '@/components/TimeEntryList.vue';
  import TimeRecording from '@/components/TimeRecording.vue';
  
  const timeEntries = ref([]);

  const addTimeEntry = (entry) => {
    timeEntries.value.unshift(entry); // unshift setzt den neuen Eintrag am Anfang der Liste
  }

</script>
