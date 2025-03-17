export class DateService {
    private static instance: DateService;

    constructor() {} // prevent direct instantiation

    static getInstance(): DateService {
        if (!DateService.instance) {
            DateService.instance = new DateService();
        }
        return DateService.instance;
      }

    getCurrentDate(): Date {
        return new Date(Date.now());
    }

    getCurrentTime(): string {
        return new Date(Date.now()).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });   
    }

    normalizeDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');   // day two-digit
        const month = String(date.getMonth() + 1).padStart(2, '0'); // month two-digit
        const year = date.getFullYear(); // year four-digit
        return `${day}.${month}.${year}`; // return date in DD.MM.YYYY format
    }

    formatTimeString(date: Date): string {
        return new Date(date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });   
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
    
    formatMonthYear(date: Date): string {
        return date.toLocaleDateString('de-DE', { year: 'numeric', month: 'long' });
    }
}