export type currentUserStatus = 'Eingestempelt' | 'Ausgestempelt';

export type WorkLocationPreference = 'office' | 'homeoffice';

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

export class User {
    id: string;
    email: string;
    roleId?: number;
    department?: string;
    currentStatus?: currentUserStatus;
    firstName?: string;
    lastName?: string;
    preferences?: UserPreferences;

    constructor(params: {
        id: string;
        email: string;
        roleId?: number;
        department?: string;
        currentStatus?: currentUserStatus;
        firstName?: string;
        lastName?: string;
        preferences?: UserPreferences;
    }) {
        this.id = params.id;
        this.email = params.email;
        this.roleId = params.roleId;
        this.department = params.department;
        this.currentStatus = params.currentStatus;
        this.firstName = params.firstName;
        this.lastName = params.lastName;
        this.preferences = params.preferences;
    }

    public getDisplayName(): string {
        if (this.firstName && this.lastName) {
            return `${this.firstName} ${this.lastName}`;
        } else {
            return this.email;
        }
    }
}

// Create a User instance from a database (MongoDB) document
export namespace User {
    export function fromDBObject(doc: any): User {
        return new User({
            id: String(doc._id ?? doc.id ?? ''),
            email: doc.email ?? '',
            roleId: doc.roleId ? Number(doc.roleId) : undefined,
            department: doc.department,
            currentStatus: doc.currentStatus,
            firstName: doc.firstName,
            lastName: doc.lastName,
            preferences: {
                ...defaultUserPreferences,
                ...(doc.preferences || {}),
            },
        });
    }
}
