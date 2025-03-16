export class Workday{
    date: Date;
    hoursWorked: number;
    homeOffice: boolean;

    constructor(date: Date, hoursWorked: number, homeOffice: boolean) {
        this.date = date;
        this.hoursWorked = hoursWorked;
        this.homeOffice = homeOffice;
    }
}