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

    // generate dummy workdays for 5 days for testing
    private generateDummyWorkdays(): void {
        const today = new Date();
        for (let i = 0; i < 5; i++) {
            const workDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
            this.workdays.push(new Workday(workDate, Math.random() * (8 - 4) + 4, false));
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
            .sort((a, b) => a.date.getTime() - b.date.getTime()); // Nach Datum sortieren
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
}