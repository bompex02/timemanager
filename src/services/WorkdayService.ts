import { reactive } from "vue";
import type { Workday } from "../models/WorkModels";
import { TimeRecordService } from "./TimeRecordService";
import { DateService } from "./DateService";
import { UserService } from "./UserService";

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
          const workdaysFromApi = await this.fetchWorkdaysFromApiForUser(this.currentUser.id);
      
          // clear the existing workdays array and add the new workdays from the API
          this.workdays.splice(0, this.workdays.length, ...workdaysFromApi);
      
          console.log("Alle Arbeitstage für User:", this.workdays);
        } catch (error) {
          console.error("Fehler beim Laden der Arbeitstage:", error);
        }
      }

    // fetches all workdays for a specific user from the backend API via userId param
    private async fetchWorkdaysFromApiForUser(userId: string): Promise<Workday[]> {
        const groupedRecords = await timeRecordService.getGroupedRecordsForUser(userId);
    
        // get the grouped records for the user and map them to workdays 
        const workdays: Workday[] = await Promise.all(Object.keys(groupedRecords).map(async dateKey => {
            const recordsForDay = groupedRecords[dateKey];
            const date = dateService.parseDateFromString(dateKey)
    
            // getting the total hours worked and home office status for the user on that day
            let totalHoursWorked = 0;
            let homeOffice = false;
            for (const record of recordsForDay) {
                if(totalHoursWorked === 0) {
                    totalHoursWorked = await this.getHoursWorkedForUserByDay(record.timestamp);
                }
                homeOffice = this.getHomeOfficeForUserByDay(record.timestamp);
            }
    
            // returns the workday object
            return {
                userId: userId,
                date: new Date(date),
                hoursWorked: totalHoursWorked,
                homeOffice: homeOffice,
            };
        }));
    
        // returns all build workdays for the user
        return workdays;
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
    getWorkdayForUserByDate(date: Date): Workday | undefined {
        return this.workdays.find(workday => workday.date.getTime() === date.getTime());
    }

    // creates a new workday object
    createWorkday(date: Date, hoursWorked: number, homeOffice: boolean): Workday {
        let workday = {
            userId: this.currentUser?.id || '', 
            date: date,
            hoursWorked: hoursWorked,
            homeOffice: homeOffice
        };
        return workday;
    }

    // gets hours worked for a specific user by day
    async getHoursWorkedForUserByDay(date: Date): Promise<number> {
        const userId = this.currentUser?.id || ''; // get the current user id
        const records = await timeRecordService.getRecordsForDateByUser(userId, date);

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

    // check, if the user worked from home on a specific day
    // returns true if the user worked from home, false otherwise
    getHomeOfficeForUserByDay(date: Date): boolean {
        const workday = this.workdays.find(workday => workday.date.getTime() === date.getTime());
        if (workday) return workday.homeOffice;
        else return false;
    }
}
