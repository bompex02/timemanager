export type currentUserStatus = 'Eingestempelt' | 'Ausgestempelt';

export class User {
    id: string;
    email: string;
    roleId?: number;
    department?: string;
    currentStatus?: currentUserStatus;
    firstName?: string;
    lastName?: string;

    constructor(params: {
        id: string;
        email: string;
        roleId?: number;
        department?: string;
        currentStatus?: currentUserStatus;
        firstName?: string;
        lastName?: string;
    }) {
        this.id = params.id;
        this.email = params.email;
        this.roleId = params.roleId;
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
        });
    }
}
