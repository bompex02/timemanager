<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Meine Projekte</h1>
      <button class="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700" @click="showAddProjectComponent" ><i class="pi pi-plus pr-1"></i>Projekt hinzufügen</button>
    </div>

    <!-- Project Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-4">
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
      />
    </div>
  </div>

  <!-- Add Project Component (is only visible when showAddProject is true) -->
  <AddProject v-if="showAddProject" @closeComponent="showAddProject = false" @saveProject="handleSaveProject" />
</template>
  
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ProjectCard from '../components/ProjectCard.vue'
import AddProject from '../components/AddProject.vue'
import { Project,ProjectState } from '../models/Project';
import { ProjectService } from '../services/ProjectService';
import { UserService } from '../services/UserService';

const userService = UserService.getInstance()
const projectService = ProjectService.getInstance()

const currentUserId = userService.getCurrentUser()?.id || '';

// bool reference to show/hide the add project component
const showAddProject = ref(false)

const showAddProjectComponent = () => {
  console.log('Projekt hinzufügen angeklickt')
  showAddProject.value = true
}

const handleSaveProject = async (projectData: { name: string; description: string; state: ProjectState }) => {
  // get all projects for the current user
  // and create a new project with the next id
  const allProjects = await projectService.getAllProjectsForUser(currentUserId);

  // new project object to push into mongoDB via the backend API
  const newProject = new Project(
    allProjects.length + 1, 
    projectData.name, 
    projectData.description, 
    projectData.state, 
    currentUserId)

  // add the new project object to the backend API  
  await projectService.addProject(newProject);
  projects.value.push(newProject)
  console.log('Neues Projekt gespeichert:', newProject); // DEBUG
  // close the add project component
  showAddProject.value = false
}

// all projects for the current user
const projects = ref<Project[]>([]);

// get all projects for the current user on component mount
onMounted(async () => {
  const allProjects = await projectService.getAllProjectsForUser(currentUserId);
  console.log('All projects for user:', allProjects); // DEBUG
  projects.value = allProjects;
});

</script>
  