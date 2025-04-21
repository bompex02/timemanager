import type { WorkMonth } from "../models/WorkModels";
import { TimeRecordService } from "./TimeRecordService";
import { UserService } from "./UserService";
import { RecordType } from "../models/TimeRecord";

const timeRecordService = TimeRecordService.getInstance();
const userService = UserService.getInstance();

export class WorkMonthService {
    private static instance: WorkMonthService;
    private currentUser = userService.getCurrentUser();

    constructor() {} // Prevent direct instantiation

    static getInstance(): WorkMonthService {
        if (!WorkMonthService.instance) {
            WorkMonthService.instance = new WorkMonthService();
        }
        return WorkMonthService.instance;
    }

    // Fetches the work month for the given year and month (async because of API calls)
    async getWorkMonthByUser(year: number, month: number): Promise<WorkMonth> {
        const userId = this.currentUser?.id || '';
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let hoursWorked = 0;
        let hoursShouldWork = 0;
      
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(year, month, day);
      
          // check if the date is a weekday (Monday to Friday)
            // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
          if (date.getDay() !== 0 && date.getDay() !== 6) {
            const records = await timeRecordService.getRecordsForDateByUser(userId, date);
      
            // sort records by timestamp
            const sorted = records.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
            // calculate daily hours worked
            let dailyMilliseconds = 0;
            for (let i = 0; i < sorted.length - 1; i += 2) {
              const start = sorted[i];
              const end = sorted[i + 1];
      
              // check if the start and end record are valid pairs
              if (start.recordType === RecordType.Einstempeln && end.recordType === RecordType.Ausstempeln) {
                // calculate the difference in milliseconds
                const diff = new Date(end.timestamp).getTime() - new Date(start.timestamp).getTime();
                dailyMilliseconds += diff;
              }
            }
      
            // 
            const dailyHours = dailyMilliseconds / (1000 * 60 * 60); // convert milliseconds to hours
            hoursWorked += dailyHours;
            hoursShouldWork += 8;
          }
        }
      
        // return workMonth object and round the hours worked to 2 decimal places
        return {
            userId,
            year,
            month,
            hoursWorked: parseFloat(hoursWorked.toFixed(2)),
            hoursShouldWork
        };
    }
}