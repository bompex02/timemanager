export type currentUserStatus = 'Eingestempelt' | 'Ausgestempelt';

export class User {
    id: string;
    email: string;
    password: string;
    role?: string;
    department?: string;
    currentStatus?: currentUserStatus;
    firstName?: string;
    lastName?: string;

    constructor(params: {
        id: string;
        email: string;
        password: string;
        role?: string;
        department?: string;
        currentStatus?: currentUserStatus;
        firstName?: string;
        lastName?: string;
    }) {
        this.id = params.id;
        this.email = params.email;
        this.password = params.password;
        this.role = params.role;
        this.department = params.department;
        this.currentStatus = params.currentStatus;
        this.firstName = params.firstName;
        this.lastName = params.lastName;
    }

    public getDisplayName(): string {
        if (this.firstName && this.lastName) {
            return `${this.firstName} ${this.lastName}`;
        } else {
            return this.email;
        }
    }
}
