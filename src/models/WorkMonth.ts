export class WorkMonth {
    year: number;
    month: number;
    hoursWorked: number;
    hoursShouldWork: number;

    constructor(year: number, month: number, hoursWorked: number, hoursShouldWork: number) {
        this.year = year;
        this.month = month;
        this.hoursWorked = hoursWorked;
        this.hoursShouldWork = hoursShouldWork;
    }
}