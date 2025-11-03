import { reactive } from "vue";
import type { Workday } from "../models/WorkModels";
import { TimeRecordService } from "./TimeRecordService";
import { DateService } from "./DateService";
import { UserService } from "./UserService";

// base url for the backend API
const BASE_URL = 'http://localhost:3000';

const timeRecordService = TimeRecordService.getInstance();
const dateService = DateService.getInstance();
const userService = UserService.getInstance();

export class WorkdayService {
    private static instance: WorkdayService;
    private workdays = reactive<Workday[]>([]); // reactive array of workdays
    private currentUser = userService.getCurrentUser(); 

    constructor() {
        if (!this.currentUser) {
            throw new Error("Kein Benutzer angemeldet!");
        }
    }

    // Singleton pattern
    static getInstance(): WorkdayService {
        if (!WorkdayService.instance) {
            WorkdayService.instance = new WorkdayService();
            WorkdayService.instance.loadUserWorkdays(); // Ensure workdays are loaded upon instantiation
        }
        return WorkdayService.instance;
    }

    // load workdays for the current user
    private async loadUserWorkdays() {
        try {
          if (!this.currentUser) throw new Error("Kein Benutzer angemeldet!");

           // fetches all workdays for the current user from the backend API and sets them to the reactive workdays array
          const workdaysFromApi = await this.getWorkdaysForUser(this.currentUser.id);
      
          // clear the existing workdays array and add the new workdays from the API
          this.workdays.splice(0, this.workdays.length, ...workdaysFromApi);
      
        } catch (error) {
          console.error("Fehler beim Laden der Arbeitstage:", error);
        }
      }


    // creates and returns a new workday object 
    ceateWorkday(date: Date, hoursWorked: number, homeOffice: boolean): Workday {
        const workday = {
            userId: this.currentUser?.id || '', 
            date: date,
            hoursWorked: hoursWorked,
            homeOffice: homeOffice
        };
        return workday;
    }

    // fetches all workdays for a specific user from the backend API via userId param
    // returns an array of workdays for the user
    public async getWorkdaysForUser(userId: string): Promise<Workday[]> {
        try {
            if (!userId) {
                throw new Error('Fehler beim Abrufen der Arbeitstage: keine UserId angegeben');
            }
        
            const response = await fetch(`${BASE_URL}/workdays/user/${userId}`);

            // check if the response is empty (404), if so, return an empty array
            if (response.status === 404) {
                return [];
            }
            
            if (!response.ok) {
                const errorText = await response.text(); // detailed error message
                throw new Error(`Fehler beim Abrufen der Arbeitstage: ${response.status} - ${errorText}`);
            }
        
            const data = await response.json();

            // convert the date string to a Date object
            // map the data to workdays
            const parsedData: Workday[] = data.map((w: any) => ({
                ...w,
                date: new Date(w.date),
            }));

            // clear the existing workdays array and add the new workdays from the API
            this.workdays.splice(0, this.workdays.length, ...parsedData);
            return parsedData;
        } catch (error) {
            console.error("API Fehler:", error);
            throw new Error("Fehler beim Abrufen der Workdays");
        }
    }
    
    // gets workdays for a specific user by month and year
    getWorkdaysForUserByMonth(year: number, month: number): Workday[] {
        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 0); // last day of the month
        return this.workdays.filter(workday => workday.date >= startOfMonth && workday.date <= endOfMonth);
    }

    // gets workdays for the current user of the current week
    getWorkdaysOfCurrentWeek(): Workday[] {
        const today = new Date();
        const startOfWeek = dateService.getStartOfWeek(today);
        const endOfWeek = dateService.getEndOfWeek(today);

        return this.workdays
            .filter(workday => workday.date >= startOfWeek && workday.date <= endOfWeek)
            .sort((a, b) => a.date.getTime() - b.date.getTime()); // sort by date
    }

    // gets workdays for the current user of the last 2 weeks
    getWorkdaysOfLast2WeeksByUser(): Workday[] {
        // this.workdays contains all workdays for the current user
        return [...this.workdays]
            .sort((a, b) => a.date.getTime() - b.date.getTime()) // sort by date
            .slice(-14); // only last 14 days (2 weeks)
    }

    // gets workday for the current user on the specific date
    // returns the workday object or undefined if not found
    public getWorkdayForUserByDate(date: Date): Workday | undefined {
        return this.workdays.find(entry => {
          const entryDate = new Date(entry.date);
          return (
            entryDate.getFullYear() === date.getFullYear() &&
            entryDate.getMonth() === date.getMonth() &&
            entryDate.getDate() === date.getDate()
          );
        });
      }
      

    // creates a new workday object
    createWorkdayForCurrentUser(date: Date, hoursWorked: number, homeOffice: boolean): Workday {
        const workday = {
            userId: this.currentUser?.id || '', 
            date: date,
            hoursWorked: hoursWorked,
            homeOffice: homeOffice
        };
        return workday;
    }

    // add new workday object to the mongoDB via the backend API
    async addWorkday(workday: Workday): Promise<void> {
        const response = await fetch(`${BASE_URL}/workdays`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(workday),
        });
    
        if (!response.ok) {
            console.error("Fehler beim Hinzufügen eines Workdays:", response.statusText);
            throw new Error('Fehler beim Hinzufügen eines Workdays');
        }
    }

    // gets hours worked for a specific user by day
    async getHoursWorkedForUserByDay(date: Date): Promise<number> {
        const userId = this.currentUser?.id || ''; // get the current user id
        const records = await timeRecordService.getRecordsForUserByDay(userId, date);

        if (records.length < 2) return 0; // min 2 records needed to calculate hours worked

        let totalHours = 0;

        // foreach record and calculate the hours worked
        for (let i = 0; i < records.length; i += 2) {
            if (records[i + 1]) {
                const startTime = new Date(records[i].timestamp).getTime();
                const endTime = new Date(records[i + 1].timestamp).getTime();
                totalHours += (endTime - startTime) / (1000 * 60 * 60); // calculate hours worked
            }
        }

        return parseFloat(totalHours.toFixed(2)); // return the total hours worked
    }

    // update a workday object in the mongoDB via the backend API
    // returns the updated workday object
    async updateWorkday(workday: Workday): Promise<void> {
        const response = await fetch(`${BASE_URL}/workdays/${workday.userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(workday),
        });
        if (!response.ok) {
            console.error("Fehler beim Aktualisieren des Workdays:", response.statusText);
            throw new Error('Fehler beim Aktualisieren des Workdays');
        }
    }

    // check, if the user worked from home on a specific day
    // returns true if the user worked from home, false otherwise
    public getHomeOfficeForUserByDay(date: Date): boolean {
        const workday = this.getWorkdayForUserByDate(date);
        if(workday) {
            return workday.homeOffice;
        } else {
            return false; // default value if no workday found
        }
    }  
}
