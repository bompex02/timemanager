export enum RecordType {
    Einstempeln = "Einstempeln",
    Ausstempeln = "Ausstempeln"
}

export interface TimeRecord {
    _id: string;
    userId: string;
    recordType: RecordType;
    timestamp: Date;
}