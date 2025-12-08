<template>
  <div class="p-6 w-full max-w-3xl mx-auto">
    <h1 class="text-2xl font-semibold mb-4">Einstellungen</h1>

    <section class="mb-6 bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h2 class="text-lg font-medium mb-2 text-white">Profil</h2>
      <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">Ändere deinen Anzeigenamen und E-Mail-Adresse.</p>

      <div class="grid grid-cols-1 gap-3">
        <label class="flex flex-col">
          <span class="text-sm mb-1 text-white">Vorname</span>
          <input v-model="form.firstName" class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
        </label>

        <label class="flex flex-col">
          <span class="text-sm mb-1 text-white">Nachname</span>
          <input v-model="form.lastName" class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
        </label>

        <label class="flex flex-col">
          <span class="text-sm mb-1 text-white">E-Mail</span>
          <input v-model="form.email" class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
        </label>

        <div class="flex gap-2 mt-3">
          <button @click="saveProfile" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">Speichern</button>
          <button @click="resetForm" class="px-4 py-2 border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Zurücksetzen</button>
        </div>
      </div>
      <h2 class="text-lg font-medium mb-2 text-white">Präferenzen</h2>
      <div class="flex items-center justify-between">
        <div>
          <div class="text-sm font-medium text-white">Dunkles Design</div>
          <div class="text-sm text-gray-600 dark:text-gray-300">Bevorzugtes Theme speichern</div>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="preferences.darkMode" class="sr-only peer" aria-label="Dark mode toggle" @click="savePreferences" />
          <div class="w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-2 peer-focus:ring-indigo-500 dark:bg-gray-600 peer-checked:bg-indigo-600 transition-colors"></div>
          <div class="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow transform transition-transform peer-checked:translate-x-5 dark:bg-gray-300"></div>
        </label>
      </div>
    </section>

    <section class="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h2 class="text-lg font-medium mb-2 text-white">Sicherheit</h2>
      <p class="text-sm text-gray-600 dark:text-gray-300">Passwort ändern (über Firebase - momentan als Platzhalter)</p>
      <div class="mt-3 grid grid-cols-1 gap-3 max-w-md">
        <input v-model="password.current" placeholder="Aktuelles Passwort" type="password" class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
        <input v-model="password.new" placeholder="Neues Passwort" type="password" class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
        <input v-model="password.confirm" placeholder="Neues Passwort bestätigen" type="password" class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
        <div class="flex gap-2">
          <button @click="authService.changeUserPassword(password.new)" class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md">Passwort ändern</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { UserService } from '@/services/UserService.js';
import { showSuccess, showError } from '@/services/ToastService';
import { AuthService } from 'services/AuthService';

const userService = UserService.getInstance();
const authService = AuthService.getInstance();

onMounted(() => {
  loadCurrentUser();
});

const preferences = reactive({
  darkMode: false
});

const form = reactive({
  id: '',
  email: '',
  firstName: '',
  lastName: '',
  password: ''
});


const password = reactive({ current: '', new: '', confirm: '' });

function loadCurrentUser() {
  const current = userService.getCurrentUser();
  if (current) {
    form.id = current.id || '';
    form.email = current.email || '';
    form.firstName = current.firstName || '';
    form.lastName = current.lastName || '';
  }
}

function resetForm() {
  loadCurrentUser();
}

async function saveProfile() {
  try {
    const updated = {
      id: form.id,
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      password: form.password || ''
    };

    await userService.updateUser(updated);
    userService.setCurrentUser(updated);
    showSuccess('Profil gespeichert');
  } catch (e) {
    console.error(e);
    showError('Fehler beim Speichern des Profils');
  }
}
async function savePreferences() {
  try {
    await userService.saveUserPreferences(form.id, { darkMode: preferences.darkMode });
    showSuccess('Präferenzen gespeichert');
  } catch (e) {
    console.error(e);
    showError('Fehler beim Speichern der Präferenzen');
  }
}


</script> 