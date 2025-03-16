import { reactive } from 'vue';
import { TimeRecord } from '../models/TimeRecord';
import { DateService } from './DateService';

const dateService = DateService.getInstance();

// Used as singelton
export class TimeRecordService {
  private static instance: TimeRecordService;
  private records = reactive<TimeRecord[]>([]);
  

  constructor() {} // Prevent direct instantiation

  static getInstance(): TimeRecordService {
    if (!TimeRecordService.instance) {
      TimeRecordService.instance = new TimeRecordService();
    }
    return TimeRecordService.instance;
  }

  addRecord(record: TimeRecord): void {
    this.records.unshift(record);
  }

  getRecords(): TimeRecord[] {
    return this.records;
  }

  getRecordsByDate(date: Date): TimeRecord[] {
    return this.records.filter(record => record.timestamp.toDateString() === date.toDateString());
  }


  // groups records by date
  getGroupedRecordsByDate(): Record<string, TimeRecord[]> {
    return this.records.reduce((acc: Record<string, TimeRecord[]>, record: TimeRecord) => {
        const normalizedDate = dateService.normalizeDate(record.timestamp); // normalize date to DD.MM.YYYY format
        if (!acc[normalizedDate]) {
            acc[normalizedDate] = [];
        }
        acc[normalizedDate].push(record);
        return acc;
    }, {});
  }

  // return all records in the current week
  getRecordsInCurrentWeek(): TimeRecord[] {
    const today = dateService.getCurrentDate();
    const startOfWeek = dateService.getStartOfWeek(today);
    const endOfWeek = dateService.getEndOfWeek(today);
    return this.records.filter(record => record.timestamp >= startOfWeek && record.timestamp <= endOfWeek);
  }  
}
