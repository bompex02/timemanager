import { reactive } from 'vue';
import { TimeRecord, RecordType } from '../models/TimeRecord';
import { DateService } from './DateService';

const dateService = DateService.getInstance();

// Used as singelton
export class TimeRecordService {
  private static instance: TimeRecordService;
  private records = reactive<TimeRecord[]>([]);
  

  constructor() {
    this.generateDummyRecords();
  } // Prevent direct instantiation

  static getInstance(): TimeRecordService {
    if (!TimeRecordService.instance) {
      TimeRecordService.instance = new TimeRecordService();
    }
    return TimeRecordService.instance;
  }

  generateDummyRecords(): void {
    const now = new Date();
    for (let i = 0; i < 6; i++) { // 4 Tage
        for (let j = 0; j < 4; j++) { // 10 Einträge pro Tag
            // Zufällige Uhrzeit generieren
            const randomHour = Math.floor(Math.random() * 24); // 0 - 23 Uhr
            const randomMinute = Math.floor(Math.random() * 60); // 0 - 59 Minuten
            const randomSecond = Math.floor(Math.random() * 60); // 0 - 59 Sekunden

            // Neues Datum mit zufälliger Uhrzeit erstellen
            const recordDate = new Date(now);
            recordDate.setDate(now.getDate() - i); // Zurückrechnen auf vergangene Tage
            recordDate.setHours(randomHour, randomMinute, randomSecond, 0);

            // Zufälliger RecordType (Einstempeln oder Ausstempeln)
            const recordType = Math.random() > 0.5 ? RecordType.Einstempeln : RecordType.Ausstempeln;

            // Neuen TimeRecord erstellen und speichern
            let record = new TimeRecord(i * 10 + j, recordType, recordDate);
            this.records.unshift(record);
          }
      }
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
        acc[normalizedDate].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()); // sort records by timestamp 
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
