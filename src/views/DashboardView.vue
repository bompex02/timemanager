<template>
    <div class="grid grid-cols-3 gap-6 p-6">
      <!-- Linke Spalte: Alle Einträge (1/3 der Breite) -->
      <div class="col-span-1">
        <AllRecordList class="h-full" />
      </div>
  
      <!-- Rechte Spalte: Diagramme (2/3 der Breite) -->
      <div class="col-span-2 grid grid-rows-2 gap-6">
        <!-- Balkendiagramm (Gearbeitete Stunden pro Tag) -->
        <div class="row-span-1">
          <DailyWorkHoursChart class="h-full" />
        </div>
  
        <!-- Vergleichsdiagramm (Geleistete vs. Geplante Stunden) -->
        <div class="row-span-1">
          <ComparisonWorkhoursChart class="h-full" />
        </div>
      </div>
    </div>
  </template>
  
<script setup lang="ts">
import AllRecordList from '../components/AllRecordList.vue';
import DailyWorkHoursChart from '../components/DailyWorkHoursChart.vue';
import ComparisonWorkhoursChart from '../components/ComparisonWorkhoursChart.vue';
import { TimeRecordService } from '../services/TimeRecordService';

const timeRecordService = TimeRecordService.getInstance();
const timeRecords = timeRecordService.getRecords();

</script>
 