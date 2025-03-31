import { TimeRecord } from '../models/TimeRecord';
import { DateService } from './DateService';

// base url for the backend API
const BASE_URL = 'http://localhost:3000';

const dateService = DateService.getInstance();

// Singleton class for managing time records
// This class is responsible for making API calls to the backend
export class TimeRecordService {
  private static instance: TimeRecordService;

  private constructor() {}

  // Singleton pattern to ensure only one instance of TimeRecordService exists
  static getInstance(): TimeRecordService {
    if (!TimeRecordService.instance) {
      TimeRecordService.instance = new TimeRecordService();
    }
    return TimeRecordService.instance;
  }

  // add a new TimeRecord to the mongodb via the backend API
  async addTimeRecord(record: TimeRecord): Promise<void> {
    const response = await fetch(`${BASE_URL}/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });

    if (!response.ok) {
      throw new Error('Fehler beim Hinzufügen eines TimeRecords');
    }
  }

  // fetch all TimeRecords from the mongodb via the backend API and return them as an array of TimeRecord objects
  async getAllRecords(): Promise<TimeRecord[]> {
    try {
      const response = await fetch(`${BASE_URL}/records`);
      
      if (!response.ok) {
        const errorText = await response.text(); // detailed error message
        throw new Error(`Fehler beim Abrufen der TimeRecords: ${response.status} - ${errorText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("API Fehler:", error);
      throw new Error("Fehler beim Abrufen der TimeRecords");
    }
  }
  

  // returns all time records and groups them by date
  async getRecordsByDate(date: Date): Promise<TimeRecord[]> {
    const all = await this.getAllRecords();
    if (!all) {
      throw new Error('Fehler beim Abrufen der gruppierten TimeRecords: keine TimeRecords gefunden');
      return [];
    }
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    // filter records by date and return them
    return all.filter(record => {
      const ts = new Date(record.timestamp).getTime();
      return ts >= dayStart.getTime() && ts <= dayEnd.getTime();
    });
  }

  // returns all timerecords for the current week
  async getRecordsInCurrentWeek(): Promise<TimeRecord[]> {
    const all = await this.getAllRecords();
    const start = dateService.getStartOfWeek(new Date());
    const end = dateService.getEndOfWeek(new Date());

    // filter records by week and return them
    return all.filter(record => {
      const ts = new Date(record.timestamp).getTime();
      return ts >= start.getTime() && ts <= end.getTime();
    });
  }

  // groups all time records by date and returns them as an object with date keys and arrays of TimeRecord objects
  async getGroupedRecordsByDate(): Promise<Record<string, TimeRecord[]>> {
    const records = await this.getAllRecords();

    // sort records by date
    return records.reduce((acc: Record<string, TimeRecord[]>, record) => {
      const dateKey = dateService.normalizeDate(new Date(record.timestamp));
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(record);
      acc[dateKey].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      return acc;
    }, {});
  }
}
