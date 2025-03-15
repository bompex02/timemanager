import { TimeRecord } from '../models/TimeRecord';

// Used as singelton
export class TimeRecordService {
  private static instance: TimeRecordService;
  private records: TimeRecord[] = [];

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
}
