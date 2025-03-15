export enum RecordType {
    Einstempeln = "Einstempeln",
    Ausstempeln = "Ausstempeln"
}

export class TimeRecord {
    id: number;
    recordType: RecordType;
    timestamp: Date;

    constructor(id: number, recordType: RecordType, timestamp: Date) {
        this.id = id,
        this.recordType = recordType,
        this.timestamp = timestamp
    }       
}