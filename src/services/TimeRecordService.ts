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

  // fetches all TimeRecords for a specific user from the backend API via userId param
  async getAllRecordsForUser(userId: string): Promise<TimeRecord[]> {
    try {
      if (!userId) {
        throw new Error('Fehler beim Abrufen der TimeRecords: keine UserId angegeben');
      }

      const response = await fetch(`${BASE_URL}/records/user/${userId}`);
      
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

  async getAllRecordsForUserByDay(userId: string, date: Date): Promise<TimeRecord[]> {
    try {
      if (!userId) {
        throw new Error('Fehler beim Abrufen der TimeRecords: keine UserId angegeben');
      }

      const response = await fetch(`${BASE_URL}/records/user/${userId}`);

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

  // fetches all TimeRecords for a specific user for a specific date from the backend API via userId param and filters them by date
  async getHoursWorkedForUserByDay(userId: string, date: Date): Promise<TimeRecord[]> {
    // fetch all records for the user
    const records = await this.getAllRecordsForUser(userId);
    
    // normalize the target date to ensure consistent comparison
    const normalizedTargetDate = dateService.normalizeDate(date);
  
    // filter records by normalized date
    const filteredRecords = records.filter((record) => {
      const recordDate = dateService.normalizeDate(new Date(record.timestamp));
      return recordDate === normalizedTargetDate;
    });
  
    // sort records by timestamp in ascending order
    filteredRecords.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
    return filteredRecords;
  }
  
  

  // returns all time records and groups them by date
  async getRecordsForDateByUser(userId: string, date: Date): Promise<TimeRecord[]> {
    if (!userId) {
      throw new Error('Fehler beim Abrufen der gruppierten TimeRecords: keine UserId angegeben');
    }
    const all = await this.getAllRecordsForUser(userId);
    if (!all) {
      throw new Error('Fehler beim Abrufen der gruppierten TimeRecords: keine TimeRecords gefunden'); 
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

  // returns all timerecords for the current week for the current user
  async getRecordsInCurrentWeekByUser(userId: string): Promise<TimeRecord[]> {
    const all = await this.getAllRecordsForUser(userId);
    const start = dateService.getStartOfWeek(new Date());
    const end = dateService.getEndOfWeek(new Date());

    // filter records by week and return them
    return all.filter(record => {
      const ts = new Date(record.timestamp).getTime();
      return ts >= start.getTime() && ts <= end.getTime();
    });
  }

  // groups all time records by date for specific user and returns them as an object with date keys and arrays of TimeRecord objects
  async getGroupedRecordsForUser(userId: string): Promise<Record<string, TimeRecord[]>> {
    const records = await this.getAllRecordsForUser(userId);

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
