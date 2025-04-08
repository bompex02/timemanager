export class DateService {
    private static instance: DateService;
    private currentDisplayDate: Date = new Date();

    constructor() {} // prevent direct instantiation

    static getInstance(): DateService {
        if (!DateService.instance) {
            DateService.instance = new DateService();
        }
        return DateService.instance;
    }

    // display values for month names
    private monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // returns current month name from the monthNames array
    getCurrentMonthString(): string {
        const date = new Date(Date.now());
        return this.monthNames[date.getMonth()]; 
    }


    getCurrentDate(): Date {
        return this.currentDisplayDate;
    }

    jumpToPreviousMonth(): void {
        const newDate = new Date(this.currentDisplayDate);
        newDate.setMonth(newDate.getMonth() - 1);
        this.currentDisplayDate = newDate;
    }

    jumpToNextMonth(): void {
        const newDate = new Date(this.currentDisplayDate);
        newDate.setMonth(newDate.getMonth() + 1);
        this.currentDisplayDate = newDate;
    }

    setCurrentDate(date: Date): void {
        this.currentDisplayDate = new Date(date);
    }

    getCurrentTime(): string {
        return new Date(Date.now()).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });   
    }

    // returns date in DD.MM.YYYY format
    normalizeDate(date: Date): string {
        // if date is type string convert it to date (mongoDB returns date as string)
        if (typeof date === "string") {
            date = new Date(date);
        }

        const day = String(date.getDate()).padStart(2, '0');   // day two-digit
        const month = String(date.getMonth() + 1).padStart(2, '0'); // month two-digit
        const year = date.getFullYear(); // year four-digit
        return `${day}.${month}.${year}`; // return date in DD.MM.YYYY format
    }

    // returns time of datetime in HH:MM:SS format
    getTimeString(date: Date): string {
        // if date is type string convert it to date (mongoDB returns date as string)
        if (typeof date === "string") {
            date = new Date(date);
        }
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    }

    getDateString(date: Date): string {
        return `${date.getDate().toString().padStart(2, '0')}.${date.getMonth().toString().padStart(2, '0')}.${date.getFullYear().toString().padStart(4, '0')}`;
    }


    parseDateFromString(dateStr: string): Date {
        if (!dateStr) {
            console.warn("'dateStr` ist leer oder undefined!");
            return new Date("Invalid Date");
        }
    
        const parts = dateStr.includes('.') ? dateStr.split('.') : dateStr.split('-'); 
    
        if (parts.length !== 3) {
            console.warn("Ungültiges Datumsformat für `dateStr`:", dateStr);
            return new Date("Invalid Date");
        }
    
        return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0])); // convert string to date
    }

    getStartOfWeek(date: Date, offset?: number): Date {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1) + (offset || 0); // adjust when day is sunday & add offset optinal to jump to next/previous week
        return new Date(date.setDate(diff));
    }

    getEndOfWeek(date: Date): Date {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? 0 : 7); // adjust when day is sunday
        return new Date(date.setDate(diff));
    }  
}