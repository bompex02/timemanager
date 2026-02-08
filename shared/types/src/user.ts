export type WorkLocationPreference = 'office' | 'homeoffice';

export interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    roleId: number;
    preferences?: UserPreferences;
}

export interface UserPreferences {
    darkMode: boolean;
    defaultLocation: WorkLocationPreference;
    targetHoursPerWeek: number;
    exportFormat: 'csv' | 'xlsx';
    exportDelimiter: 'comma' | 'semicolon';
}

export const defaultUserPreferences: UserPreferences = {
    darkMode: false,
    defaultLocation: 'office',
    targetHoursPerWeek: 40,
    exportFormat: 'csv',
    exportDelimiter: 'semicolon',
};
