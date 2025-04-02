export enum RecordType {
    Einstempeln = "Einstempeln",
    Ausstempeln = "Ausstempeln"
}

export class TimeRecord {
    id: number;
    userId: string;
    recordType: RecordType;
    timestamp: Date;

    constructor(id: number, userId: string, recordType: RecordType, timestamp: Date) {
        this.id = id,
        this.userId = userId,
        this.recordType = recordType,
        this.timestamp = timestamp
    }       
}