<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Meine Projekte</h1>
      <button class="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">Projekt hinzufügen</button>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-4">
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
      />
    </div>
  </div>
</template>
  
<script setup lang="ts">
import ProjectCard from '../components/ProjectCard.vue'
import { ProjectState } from '../models/Project';

const projects = [
  {
    id: 1,
    name: 'Projekt Alpha',
    description: 'Entwicklung eines internen Zeiterfassungstools für das Unternehmen, inklusive mobiler App und Web-Interface. Ziel ist es, Prozesse zu automatisieren und Transparenz über geleistete Stunden zu schaffen.',
    state: ProjectState.Active,
    userId: '1'
  },
  {
    id: 2,
    name: 'Projekt Beta',
    description: 'Analyse und Refactoring einer bestehenden Legacy-Codebasis in einem Kundenprojekt. Fokus liegt auf der Verbesserung der Performance, Reduktion technischer Schulden und Dokumentation.',
    state: ProjectState.Inactive,
    userId: '2'
  },
  {
    id: 3,
    name: 'Projekt Gamma',
    description: 'Erstellung eines umfassenden Jahresberichts inklusive Diagrammen, Datenvisualisierung und Drucklayout für die Geschäftsführung. Das Projekt ist abgeschlossen und wurde erfolgreich publiziert.',
    state: ProjectState.Completed,
    userId: '1'
  },
  {
    id: 4,
    name: 'Projekt Delta',
    description: 'Konzeption und Entwicklung einer neuen Mandantenverwaltung für die HR-Abteilung. Enthält Features wie Rollen- und Rechtemanagement, Dokumentenablage und DSGVO-konformes Logging.',
    state: ProjectState.Active,
    userId: '2'
  },
  {
    id: 5,
    name: 'Projekt Epsilon',
    description: 'Interne Fortbildungsplattform zur Schulung neuer Mitarbeiter. Ziel ist es, Onboarding-Prozesse zu standardisieren und Lerninhalte modular bereitzustellen.',
    state: ProjectState.Cancelled,
    userId: '3'
  },
  {
    id: 6,
    name: 'Projekt Zeta',
    description: 'Koordination und Umsetzung eines internationalen Rollouts der CRM-Software mit Fokus auf Mehrsprachigkeit, Regionaleinstellungen und Anpassbarkeit.',
    state: ProjectState.Active,
    userId: '1'
  }
];

</script>
  