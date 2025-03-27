import { reactive } from "vue";
import type { User } from "../models/User";

export class UserService {
    private static instance: UserService;
    private users = reactive<User[]>([]);
    private currentUser: User | null = null; // Store the current user object


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
    getUserById(id: string): User | undefined {
        return this.users.find(user => user.id === id);
    }

    // add new user to list 
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

    // set current user
    setCurrentUser(user: User | null): void {
        this.currentUser = user;
    }

    // Get the current user
    getCurrentUser(): User | null {
        return this.currentUser; // Return the current user object
    }

    // delete user by id
    deleteUser (id: string): void {
        this.users = this.users.filter(user => user.id !== id);
    }

    // get current status of user: 'Eingestempelt' or 'Ausgestempelt' : default is 'Ausgestempelt'
    getCurrentStatus(id: string): User["currentStatus"] {
        let currentUser = this.users.find(user => user.id === id);
        if(currentUser){
            if(currentUser.currentStatus) {
                return currentUser.currentStatus;
            }
        }
        return 'Ausgestempelt';;
    }    
}
