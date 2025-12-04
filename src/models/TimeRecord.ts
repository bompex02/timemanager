export enum RecordType {
    Einstempeln = "Einstempeln",
    Ausstempeln = "Ausstempeln"
}

export class TimeRecord {
    userId: string;
    recordType: RecordType;
    timestamp: Date;

    constructor(userId: string, recordType: RecordType, timestamp: Date) {
        this.userId = userId,
        this.recordType = recordType,
        this.timestamp = timestamp
    } 
    
    // Create a TimeRecord instance from a database (MongoDB) document
    static fromDBObject(doc: any): TimeRecord {
        const userId = String(doc.userId ?? '');
        const recordType = (doc.recordType ?? '') as RecordType;
        const timestamp = new Date(doc.timestamp ?? Date.now());

        return new TimeRecord(userId, recordType, timestamp);
    }
}