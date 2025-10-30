<template>
    <div class="h-[250px] w-[350px] flex-shrink-0 p-6 bg-white shadow-lg rounded-2xl m-2">
      <h2 class="text-xl text-center font-semibold text-gray-800 mb-4">Zeiterfassung</h2>
      <p class="mt-4 border-t pt-4 space-y-2 text-gray-700"></p>

      <div class="mb-4 text-center pb-2">
        <div class="flex justify-center gap-6 text-3xl">
          <button
            :class="workLocation === 'office' ? 'ring-2 ring-blue-500 rounded-full p-1' : 'opacity-60'"
            @click="workLocation = 'office'"
          >
            🏢
          </button>
          <button
            :class="workLocation === 'homeoffice' ? 'ring-2 ring-blue-500 rounded-full p-1' : 'opacity-60'"
            @click="workLocation = 'homeoffice'"
          >
            🏠
          </button>
        </div>
      </div>
      
      <div class="flex flex-col gap-2">
        <button
          @click="toggleClock('in')"
          class="w-full py-2 text-white font-medium rounded-lg transition bg-green-600 hover:bg-green-700 cursor-pointer">
          Einstempeln
        </button>
        
        <button
          @click="toggleClock('out')"
          class="w-full py-2 text-white font-medium rounded-lg transition bg-red-600 hover:bg-red-700 cursor-pointer">
          Ausstempeln
        </button>
      </div>
      <span class="pt-1.5 flex items-center gap-1 text-sm font-medium text-gray-900 me-3">
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
  import { WorkdayService } from '../services/WorkdayService';
  import { TimeRecord, RecordType } from '../models/TimeRecord';
  import type { currentUserStatus } from '../models/User';

  const workLocation = ref<'office' | 'homeoffice'>('office'); // Default work location is office
  const isClockedIn = ref(localStorage.getItem('currentStatus') === 'Eingestempelt'); // Check if the user is clocked in or out
  const emit = defineEmits(['update-time-record']); // Emit event to update time record

  // Singeltons
  const timeRecordService = TimeRecordService.getInstance(); 
  const userService = UserService.getInstance();
  const dateService = DateService.getInstance();
  const workdayService = WorkdayService.getInstance();

  // gets the current user id from the user service
  const userId = userService.getCurrentUser()?.id || '';

  // when component is mounted
  onMounted(() => {
    currentUserStatus.value = userService.getCurrentUserStatus();
    console.log('Current User Status:', currentUserStatus.value);
  });

  // status of current user from the user service
  const currentUserStatus = userService.currentStatus;
    
  // toggle between 'in' and 'out' states based on which button is clicked
  const toggleClock = async (action: string) => {
    const allRecords = await timeRecordService.getAllRecordsForUser(userId);

    // gets the current date time from the date service
    const currentDateTime = dateService.getCurrentDate();  

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

      // Check if it's the first record of the day for the user
      // If it is, create a new workday for the user
      if (await isFirstRecordOfTheDay()) {
        // Create a new workday for the user (current date, 0 hours worked, always in office)
        let location = workLocation.value === 'homeoffice' ? true : false; // 0 for office, 1 for homeoffice
        let workDay = workdayService.createWorkdayForCurrentUser(dateService.getCurrentDate(), 0, location); // TODO: add homeoffice option

        // add workday to the mongodb via backend service
        workdayService.addWorkday(workDay);
        console.log('New Workday created:', workDay);
      }

      const record = new TimeRecord(
        allRecords.length + 1, // ID
        userId, 
        RecordType.Einstempeln,
        currentDateTime
      );

      timeRecordService.addTimeRecord(record);
      userService.setCurrentUserStatus('Eingestempelt');
      showSuccess('Einstempeln erfolgreich!');
      emit('update-time-record', record); // Emit event to update time record

    } else if (action === 'out') {
        if (!isClockedIn.value) {
            showError('Bereits ausgestempelt!');
            return;
        }

      isClockedIn.value = false;
      
      const record = new TimeRecord(
        allRecords.length + 1, // ID
        userId, 
        RecordType.Ausstempeln, 
        currentDateTime 
      );

      timeRecordService.addTimeRecord(record);
      userService.setCurrentUserStatus('Ausgestempelt');
      showSuccess('Ausstempeln erfolgreich!');
      emit('update-time-record', record); // Emit event to update time record

      updateHoursWorkedInWorkday(allRecords, currentDateTime)
        .then(() => {
          console.log('Workday updated successfully!');
        })
        .catch((error) => {
          console.error('Error updating workday:', error);
        });
    }
  };

  // check if it's the first record of the day for the user
  async function isFirstRecordOfTheDay() : Promise<boolean> {
    // fetch all records for the current user by day
    const todaysUserRecords = await timeRecordService.getRecordsForUserByDay(userId, dateService.getCurrentDate());
    // if there are no records, return true (it is the first record of the day), otherwise false is returned
    return todaysUserRecords.length === 0 ? true: false;
  }

  async function updateHoursWorkedInWorkday(allRecords: TimeRecord[], currentDateTime: Date) {
    // greps all records for the current user and filters them by date
    const todaysRecords = allRecords.filter(record => {
        return (
          record.userId === userId &&
          record.timestamp === currentDateTime
        );
      });

      // sorts the records by timestamp
      const sorted = todaysRecords.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      let totalMsWorked = 0;
      for (let i = 0; i < sorted.length - 1; i += 2) {
          const start = new Date(sorted[i].timestamp);
          const end = new Date(sorted[i + 1].timestamp);
          totalMsWorked += end.getTime() - start.getTime();
      }

      const updatedHoursWorked = +(totalMsWorked / (1000 * 60 * 60)).toFixed(2); // for example 7.75 hours 

      // object to update the workday with the new hours worked
      const updateWorkday = {
        userId: userId, 
        date: dateService.getCurrentDate(), 
        hoursWorked: updatedHoursWorked, // updated total hours worked
        homeOffice: workLocation.value === 'homeoffice' ? true : false, // 0 for office, 1 for homeoffice
      }
      // update the hours worked for the current user in the workday service
      await workdayService.updateWorkday(updateWorkday);
  }

</script>
