<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Meine Projekte</h1>
      <button class="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 cursor-pointer" @click="showAddProjectComponent" ><i class="pi pi-plus pr-1"></i>Projekt hinzufügen</button>
    </div>

    <!-- Project Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-4">
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
        @delete="handleDeleteProject"
        @edit="handleEditProject"
        @statusChange="handleStatusChange"
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
import { projectCountEvent } from '../eventBus';

const userService = UserService.getInstance()
const projectService = ProjectService.getInstance()

const currentUserId = userService.getCurrentUser()?.id || '';

// bool reference to show/hide the add project component
const showAddProject = ref(false)

const showAddProjectComponent = () => {
  showAddProject.value = true
}

const handleSaveProject = async (projectData: { name: string; description: string; state: ProjectState }) => {
  // get all projects for the current user
  // and create a new project with the next id
  const allProjects = await projectService.getAllProjectsForUser(currentUserId);

  // new project object to push into mongoDB via the backend API
  const newProject = new Project(
    projectData.name, 
    projectData.description, 
    projectData.state, 
    currentUserId)

  // add the new project object to the backend API  
  await projectService.addProject(newProject);
  projects.value.push(newProject)
  projectCountEvent.value++;  // increse value from event bus to notify other components
  showAddProject.value = false
}

const handleDeleteProject = async (projectId: string) => {
  try {
    await projectService.deleteProject(projectId);
    // only show projects which are not deleted
    projects.value = projects.value.filter(p => p.id !== projectId);
    projectCountEvent.value--; // decrese value from event bus to notify other components
  } catch (error) {
    console.error('Fehler beim Löschen des Projekts:', error);
  }
};

const handleEditProject = (project: Project) => {
  console.log('edit project', project)
  // TODO: implement edit project functionality
}

const handleStatusChange = (payload: { projectId: string; newState: ProjectState }) => {
  const project = projects.value.find(p => p.id === payload.projectId);
  if (project) {
    project.state = payload.newState;
  }
};

// all projects for the current user
const projects = ref<Project[]>([]);

// get all projects for the current user on component mount
onMounted(async () => {
  const allProjects = await projectService.getAllProjectsForUser(currentUserId);
  projects.value = allProjects;
  console.log('Loaded projects:', allProjects);
});

</script>
  