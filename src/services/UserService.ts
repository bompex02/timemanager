import { reactive } from "vue";
import type { User } from "../models/User";

export class UserService {
    private static instance: UserService;
    private users = reactive<User[]>([]);

    constructor() {} // Prevent direct instantiation

    static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    // get all users
    getUsers(): User[] {
        return this.users;
    }

    // get user by id
    getUserById(id: number): User | undefined {
        return this.users.find(user => user.id === id);
    }

    // add user
    addUser(user: User): void {
        this.users.push(user);
    }

    // update user
    updateUser(user: User): void {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            this.users[index] = user;
        }
    }

    // delete user by id
    deleteUser (id: number): void {
        this.users = this.users.filter(user => user.id !== id);
    }
}