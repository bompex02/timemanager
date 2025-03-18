export class User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: string;
    department: string;
    currentStatus: string;

    constructor(id: number, username: string, email: string, password: string, role: string, department: string, currentStatus: string) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.department = department;
        this.currentStatus = currentStatus;
    }
}