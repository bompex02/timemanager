<template>
    <div class="h-[200px] w-[350px] flex-shrink-0 p-6 bg-white shadow-lg rounded-2xl m-2">
      <h2 class="text-xl text-center font-semibold text-gray-800 mb-4">Zeiterfassung</h2>
      <p class="mt-4 border-t pt-4 space-y-2 text-gray-700"></p>
      
      <!-- Buttons mit vertikalem Abstand -->
      <div class="flex flex-col gap-2">
        <button
          @click="toggleClock('in')"
          class="w-full py-2 text-white font-medium rounded-lg transition bg-green-600 hover:bg-green-700">
          Einstempeln
        </button>
        
        <button
          @click="toggleClock('out')"
          class="w-full py-2 text-white font-medium rounded-lg transition bg-red-600 hover:bg-red-700">
          Ausstempeln
        </button>
      </div>
    </div>
</template>

  
<script setup>
  import { ref } from 'vue'; 

  const isClockedIn = ref(false); 
  const emit = defineEmits(['update-time-entry']); // Emit event to update time entry
  const currentDateTime = ref(new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()); // Current date and time
  import { showSuccess, showError } from '@/utils/toastService';
  
  // Toggle between 'in' and 'out' states based on which button is clicked
  const toggleClock = (action) => {
    if (action === 'in') {
        if (isClockedIn.value) {
            showError('Sie sind bereits eingestempelt!');       
            return;
        }
      isClockedIn.value = true;
      emit('update-time-entry', {
        type: 'Einstempeln',
        time: currentDateTime.value,
      });
      showSuccess('Einstempeln erfolgreich!');
    } else if (action === 'out') {
        if (!isClockedIn.value) {
            showError('Bereits ausgestempelt!');
            return;
        }
      isClockedIn.value = false;
      emit('update-time-entry', {
        type: 'Ausstempeln',
        time: currentDateTime.value,
      });
      showSuccess('Ausstempeln erfolgreich!');
    }
  };

</script>
  