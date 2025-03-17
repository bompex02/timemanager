import { WorkMonth } from "../models/WorkMonth";
import { TimeRecordService } from "./TimeRecordService";

const timeRecordService = new TimeRecordService();

export class WorkMonthService {
    private static instance: WorkMonthService;

    constructor() {} // Prevent direct instantiation

    static getInstance(): WorkMonthService {
        if (!WorkMonthService.instance) {
            WorkMonthService.instance = new WorkMonthService();
        }
        return WorkMonthService.instance;
    }

    getWorkMonth(year: number, month: number): WorkMonth {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let hoursWorked = 0;
        let hoursShouldWork = 0;

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            
            // check if date is a weekday (Monday to Friday)
            if (date.getDay() !== 0 && date.getDay() !== 6) {
                hoursWorked += timeRecordService.getRecordsByDate(date)
                    .reduce((sum, record) => sum + 8, 0); // Dummy workhours (8 hours per day)
                hoursWorked += Math.floor(Math.random() * (8 - 4) + 4); // Random workhours between 4 and 8
                hoursShouldWork += 8; // Dummy workhours (8 hours per day)
            }
        }

        return new WorkMonth(year, month, hoursWorked, hoursShouldWork);
    }  
}