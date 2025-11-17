<template>
  <div class="flex items-center justify-center w-full h-screen bg-white">
    <form @submit.prevent="registerUser" class="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
      <h1 class="text-2xl font-bold mb-6 text-center text-black">Register</h1>

      <div class="flex flex-col gap-2 mb-4">
        <label for="firstName" class="text-black">Vorname</label>
        <input
          id="firstName"
          v-model="firstName"
          type="text"
          class="border border-black rounded-md px-3 py-2 text-black"
          autocomplete="Vorname"
          required
        />
      </div>

      <div class="flex flex-col gap-2 mb-4">
        <label for="lastName" class="text-black">Nachname</label>
        <input
          id="lastName"
          v-model="lastName"
          type="text"
          class="border border-black rounded-md px-3 py-2 text-black"
          autocomplete="Nachname"
          required
        />
      </div>

      <div class="flex flex-col gap-2 mb-4">
        <label for="email" class="text-black">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          class="border border-black rounded-md px-3 py-2 text-black"
          autocomplete="email"
          required
        />
      </div>

      <div class="flex flex-col gap-2 mb-4">
        <label for="password" class="text-black">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="border border-black rounded-md px-3 py-2 text-black"
          autocomplete="new-password"
          required
        />
      </div>

      <div class="flex flex-col gap-2 mb-4">
        <label for="password_confirmation" class="text-black">Confirm password</label>
        <input
          id="password_confirmation"
          v-model="passwordConfirmation"
          type="password"
          class="border border-black rounded-md px-3 py-2 text-black"
          autocomplete="new-password"
          required
        />
      </div>

      <div class="border-t h-px my-6 border-black"></div>

      <div class="flex flex-col gap-2">
        <button @click.prevent="registerUser" type="submit"
          class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-indigo-600">
          Register
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { AuthService } from '../services/AuthService';

const authService = AuthService.getInstance();
const router = useRouter();

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');

// Register user
const registerUser = async () => {
  // Check if passwords match
  if (password.value !== passwordConfirmation.value) {
    alert('Passwords do not match');
    return;
  }

  // if passwords match, register user via authService
    try {
    await authService.registerUser(email.value, password.value, firstName.value, lastName.value);
    router.push('/dashboard'); // after successful registration, redirect to dashboard
  } catch (error) {
    console.error('Registrierung fehlgeschlagen', error);
    alert(error);
  }
};
</script>
