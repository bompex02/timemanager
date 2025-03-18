import { reactive } from "vue";
import { Workday } from "../models/Workday";
import { TimeRecordService } from "./TimeRecordService";
import { DateService } from "./DateService";

const timeRecordService = TimeRecordService.getInstance();
const dateService = DateService.getInstance();

export class WorkdayService{
    private static instance: WorkdayService
    private workdays = reactive<Workday[]>([])

    constructor() {
        this.generateDummyWorkdays();
    } // prevent direct instantiation

    static getInstance(): WorkdayService {
        if (!WorkdayService.instance) {
            WorkdayService.instance = new WorkdayService();
        }
        return WorkdayService.instance;
    }    

    // generates dummy workdays for testing purposes
    generateDummyWorkdays() {    
        this.workdays.length = 0; // 🔥 Leere alte Workdays
    
        const today = new Date();
        let workdaysAdded = 0;
        let daysBack = 0;
    
        while (workdaysAdded < 10 || daysBack < 14) { // Mindestens 10 Werktage, max. 14 Tage
            const day = new Date(today);
            day.setDate(today.getDate() - daysBack);
    
            // ✅ Falls Wochenende: Als leerer Workday speichern (damit im Chart nichts angezeigt wird)
            if (day.getDay() === 6 || day.getDay() === 0) {
                // Math.floor(Math.random() * (8 - 4) + 4) => random workhours between 4 and 8
                // Math.floor(Math.random() * 2) === 1) => random boolean for homeOffice
                this.workdays.push(new Workday(new Date(day), Math.floor(Math.random() * (8 - 4) + 4), Math.floor(Math.random() * 2) === 1)); 
            } else {
                // dummy workday
                this.workdays.push(new Workday(
                    new Date(day),
                    Math.floor(Math.random() * (8 - 4) + 4), 
                    false
                ));
                workdaysAdded++; // only increment if it's a workday
            }
    
            daysBack++; // count days back
        }
    }
    

    // get all workdays
    getWorkdays(): Workday[] {
        return this.workdays;
    }

    // get workdays of the current week
    getWorkdaysOfCurrentWeek(): Workday[] {
        const today = new Date();
        const startOfWeek = dateService.getStartOfWeek(today);
        const endOfWeek = dateService.getEndOfWeek(today);
    
        return this.workdays
            .filter(workday => workday.date >= startOfWeek && workday.date <= endOfWeek)
            .sort((a, b) => a.date.getTime() - b.date.getTime()); // sort by date
            }


    // get workdays of the last 2 weeks
    getWorkdaysOfLast2Weeks(): Workday[] {
        if (this.workdays.length < 10) {
            console.warn("!DEBUG!: Keine Workdays gefunden! Generiere Dummy-Daten...");
            this.generateDummyWorkdays();
        }
    
        return [...this.workdays]
            .sort((a, b) => a.date.getTime() - b.date.getTime()) // sort by date
            .slice(-14); // get only the last 14 workdays
    }

    // create workday
    createWorkday(date: Date, hoursWorked: number, homeOffice: boolean): Workday {
        return new Workday(date, hoursWorked, homeOffice);
    }

    // get all workdays for the specified date
    getHoursWorkedForDay(workday: Workday): number {
        const records = timeRecordService.getRecordsByDate(workday.date);
    
        if (records.length < 2) return 0; // min 2 records to calculate hours worked
    
        let totalHours = 0;
    
        // loop through records
        for (let i = 0; i < records.length; i += 2) {
            if (records[i + 1]) {
                const startTime = new Date(records[i].timestamp).getTime();
                const endTime = new Date(records[i + 1].timestamp).getTime();
                totalHours += (endTime - startTime) / (1000 * 60 * 60); // return hours
            }
        }
    
        return totalHours;
    }

    getHomeOfficeForDay(date : Date): boolean {
        const workday = this.workdays.find(workday => workday.date.getTime() === date.getTime());
        if (workday) return workday.homeOffice;
        else return false;
    }
}