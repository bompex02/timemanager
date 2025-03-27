export type currentStatus = 'Eingestempelt' | 'Ausgestempelt';

export class User {
    id: string;
    email: string;
    password: string;
    role: string;
    department: string;
    currentStatus: currentStatus;

    constructor(id: string, email: string, password: string, role: string, department: string, currentStatus: currentStatus) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
        this.department = department;
        this.currentStatus = currentStatus;
    }
}