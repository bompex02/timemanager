export type currentStatus = 'Eingestempelt' | 'Ausgestempelt';

export class User {
    id: string;
    username: string;
    email: string;
    password: string;
    role: string;
    department: string;
    currentStatus: currentStatus;

    constructor(id: string, username: string, email: string, password: string, role: string, department: string, currentStatus: currentStatus) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.department = department;
        this.currentStatus = currentStatus;
    }
}