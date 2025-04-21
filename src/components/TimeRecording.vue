<template>
    <div class="h-[200px] w-[350px] flex-shrink-0 p-6 bg-white shadow-lg rounded-2xl m-2">
      <h2 class="text-xl text-center font-semibold text-gray-800 mb-4">Zeiterfassung</h2>
      <p class="mt-4 border-t pt-4 space-y-2 text-gray-700"></p>
      
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
      <span class="pt-1.5 flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white me-3">
        <span class="flex w-2.5 h-2.5 rounded-full shrink-0" :class="currentUserStatus === 'Eingestempelt' ? 'bg-green-600' : 'bg-red-600'"></span>
        {{ currentUserStatus }}
      </span>
    </div>
</template>

  
<script setup lang="ts">
  import { ref, onMounted } from 'vue'; 
  import { showSuccess, showError } from '../services/ToastService';
  import { TimeRecordService } from '../services/TimeRecordService';
  import { UserService } from '../services/UserService';
  import { DateService } from '../services/DateService';
  import { TimeRecord, RecordType } from '../models/TimeRecord';
  import type { currentUserStatus } from '../models/User';

  const isClockedIn = ref(localStorage.getItem('currentStatus') === 'Eingestempelt'); // Check if the user is clocked in or out
  const emit = defineEmits(['update-time-record']); // Emit event to update time record

  // Singeltons
  const timeRecordService = TimeRecordService.getInstance(); 
  const userService = UserService.getInstance();
  const dateService = DateService.getInstance();

  onMounted(() => {
    currentUserStatus.value = userService.getCurrentUserStatus();
    console.log('Current User Status:', currentUserStatus.value);
  });

  // status of current user from the user service
  const currentUserStatus = userService.currentStatus;
    
  // Toggle between 'in' and 'out' states based on which button is clicked
  const toggleClock = async (action: string) => {
    const allRecords = await timeRecordService.getAllRecords();

    // gets the current date time from the date service
    const currentDateTime = dateService.getCurrentDate();  

    // gets the current user id from the user service
    const userId = userService.getCurrentUser()?.id || '';

    // checks if there is a id in the current user
    if (!userId) {
        showError('Kein Benutzer angemeldet!');
        return;
    }

    if (action === 'in') {
        if (isClockedIn.value) {
            showError('Sie sind bereits eingestempelt!');       
            return;
        }

      isClockedIn.value = true;

      const record = new TimeRecord(
        allRecords.length + 1, // ID
        userId, // User ID
        RecordType.Einstempeln, // RecordType
        currentDateTime // Date
      );

      timeRecordService.addTimeRecord(record);
      userService.setCurrentUserStatus('Eingestempelt');
      showSuccess('Einstempeln erfolgreich!');

    } else if (action === 'out') {
        if (!isClockedIn.value) {
            showError('Bereits ausgestempelt!');
            return;
        }

      isClockedIn.value = false;
      
      const record = new TimeRecord(
        allRecords.length + 1, // ID
        userId, // User ID
        RecordType.Ausstempeln, // RecordType
        currentDateTime // Date
      );

      timeRecordService.addTimeRecord(record);
      userService.setCurrentUserStatus('Ausgestempelt');
      showSuccess('Ausstempeln erfolgreich!');
    }
  };

</script>
