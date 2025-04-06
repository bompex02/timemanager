export type currentUserStatus = 'Eingestempelt' | 'Ausgestempelt';

export class User {
    id: string;
    email: string;
    password: string;
    role: string;
    department: string;
    currentStatus: currentUserStatus;

    constructor(id: string, email: string, password: string, role: string, department: string, currentStatus: currentUserStatus) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
        this.department = department;
        this.currentStatus = currentStatus;
    }
}