<template>
  <div class="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-900 flex justify-center md:items-center py-10">
    <div class="max-w-5xl w-full mx-auto px-6 flex flex-col gap-2">
      <header class="flex flex-col gap-2">
        <p class="text-xs uppercase tracking-[0.2em] text-gray-500">Kontoeinstellungen</p>
        <h1 class="text-3xl font-semibold">Einstellungen</h1>
      </header>

      <section class="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
        <div class="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 class="text-xl font-semibold">Profil</h2>
            <p class="text-sm text-gray-600">Aktualisiere deine Stammdaten.</p>
          </div>
          <BaseButton @click="resetForm">Zurücksetzen</BaseButton>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
          <BaseInput v-model="form.firstName" variant="light" label="Vorname" required />
          <BaseInput v-model="form.lastName" variant="light" label="Nachname" required />
          <BaseInput v-model="form.email" type="email" variant="light" label="E-Mail" class="md:col-span-2" required />
        </div>

        <div class="flex justify-end gap-3 pt-5">
          <BaseButton @click="saveProfile">Speichern</BaseButton>
        </div>
      </section>

      <section class="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl space-y-5">
        <div>
          <h2 class="text-xl font-semibold">Präferenzen</h2>
          <p class="text-sm text-gray-600">Bestimme Theme, Arbeitsort und Exporte.</p>
        </div>

        <div class="flex items-start justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div>
            <div class="text-sm font-semibold text-gray-800">Dunkles Design</div>
            <p class="text-sm text-gray-600">Bevorzugtes Theme speichern.</p>
          </div>
          <label class="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              v-model="preferences.darkMode"
              class="peer sr-only"
              aria-label="Dark mode toggle"
            />
            <div
              class="h-7 w-12 rounded-full bg-gray-300 transition peer-checked:bg-indigo-600 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-indigo-400"
            ></div>
            <div
              class="absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition peer-checked:translate-x-5"
            ></div>
          </label>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-3">
            <span class="text-sm font-medium text-gray-800">Standard-Arbeitsort</span>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                class="rounded-xl border border-gray-200 bg-gray-50 p-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
                :class="preferences.defaultLocation === 'office' ? 'border-indigo-400 bg-indigo-50' : ''"
                @click="preferences.defaultLocation = 'office'"
              >
                <div class="text-sm font-semibold text-gray-900">Büro</div>
                <div class="text-xs text-gray-500">Schreibtisch & Team</div>
              </button>
              <button
                type="button"
                class="rounded-xl border border-gray-200 bg-gray-50 p-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
                :class="preferences.defaultLocation === 'homeoffice' ? 'border-indigo-400 bg-indigo-50' : ''"
                @click="preferences.defaultLocation = 'homeoffice'"
              >
                <div class="text-sm font-semibold text-gray-900">Homeoffice</div>
                <div class="text-xs text-gray-500">Flexibel von zuhause</div>
              </button>
            </div>
          </div>

          <BaseInput
            v-model.number="preferences.targetHoursPerWeek"
            type="number"
            min="1"
            max="60"
            step="0.25"
            variant="light"
            label="Soll-Arbeitszeit pro Woche (Stunden)"
            required
          />

          <label class="w-full flex flex-col gap-2">
            <span class="text-sm font-medium text-gray-800">Export-Format</span>
            <select
              v-model="preferences.exportFormat"
              class="rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-0"
            >
              <option value="csv">CSV</option>
              <option value="xlsx">Excel (.xlsx)</option>
            </select>
          </label>

          <label class="w-full flex flex-col gap-2">
            <span class="text-sm font-medium text-gray-800">Trennzeichen (CSV)</span>
            <select
              v-model="preferences.exportDelimiter"
              class="rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-0"
            >
              <option value="semicolon">Semikolon (;)</option>
              <option value="comma">Komma (,)</option>
            </select>
          </label>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <BaseButton @click="loadPreferences">Zurücksetzen</BaseButton>
          <BaseButton @click="savePreferences">Präferenzen speichern</BaseButton>
        </div>
      </section>

      <section class="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
        <div class="flex flex-col gap-1">
          <h2 class="text-xl font-semibold">Sicherheit</h2>
          <p class="text-sm text-gray-600">Passwort-Update (Platzhalter für Firebase Flow).</p>
        </div>

        <div class="mt-5 grid grid-cols-1 gap-3 md:max-w-md">
          <BaseInput
            v-model="password.current"
            placeholder="Aktuelles Passwort"
            type="password"
            autocomplete="current-password"
            variant="light"
            label="Aktuelles Passwort"
            password
          />
          <BaseInput
            v-model="password.new"
            placeholder="Neues Passwort"
            type="password"
            autocomplete="new-password"
            variant="light"
            label="Neues Passwort"
            password
          />
          <BaseInput
            v-model="password.confirm"
            placeholder="Neues Passwort bestätigen"
            type="password"
            autocomplete="new-password"
            variant="light"
            label="Neues Passwort bestätigen"
            password
          />
          <div class="flex justify-end">
            <BaseButton @click="authService.changeUserPassword(password.new)">Passwort ändern</BaseButton>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { UserService } from '@/services/UserService';
import { AuthService } from '@/services/AuthService';
import { showSuccess, showError } from '@/services/ToastService';
import BaseInput from '@/components/base/Input.vue';
import BaseButton from '@/components/base/Button.vue';

const userService = UserService.getInstance();
const authService = AuthService.getInstance();

onMounted(() => {
  loadCurrentUser();
  loadPreferences();
});

const preferences = reactive({
  darkMode: false,
  defaultLocation: 'office',
  targetHoursPerWeek: 40,
  exportFormat: 'csv',
  exportDelimiter: 'semicolon',
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

function loadPreferences() {
  const saved = userService.getCurrentUserPreferences();
  Object.assign(preferences, saved);
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
    if (!form.id) {
      showError('Kein Benutzer angemeldet');
      return;
    }

    await userService.saveUserPreferences(form.id, { ...preferences });
    showSuccess('Präferenzen gespeichert');
  } catch (e) {
    console.error(e);
    showError('Fehler beim Speichern der Präferenzen');
  }
}

</script> 