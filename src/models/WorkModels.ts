/* 
--------------------------------------------------------------------------------------
    This file contains the models for the workday and workmonth objects
--------------------------------------------------------------------------------------
*/

// interface for the workday object
export interface Workday {
    date: Date;
    hoursWorked: number;
    homeOffice: boolean;
}

// interface for the workmonth object
export interface WorkMonth {
    year: number;
    month: number;
    hoursWorked: number;
    hoursShouldWork: number;
}  