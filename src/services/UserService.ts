import { reactive, ref } from "vue";
import { User } from "../models/User";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { DateService } from "../services/DateService";
import type { currentUserStatus } from "../models/User";

const BASE_URL = 'http://localhost:3000';

export class UserService {
    private static instance: UserService;
    private users = reactive<User[]>([]);
    private currentUser: User | null = null;
    public currentStatus = ref<currentUserStatus>('Ausgestempelt');
    private auth = auth;

    private dateService = DateService.getInstance();

    constructor() {
    onAuthStateChanged(this.auth, (firebaseUser) => {
        if (firebaseUser) {
            const user = new User({
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                password: '' // Password is not available from Firebase user
            });

            this.setCurrentUser(user);
        } else {
            this.setCurrentUser(null);
        }

        // currentStatus aus localStorage lesen
        this.currentStatus.value = this.getCurrentUserStatus();
    });
}


    static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    // Initialize auth state
    async initialize(): Promise<void> {
        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(this.auth, () => {
                unsubscribe();
                resolve();
            });
        });
    }

    // get all users
    async getUsers(): Promise<User[]> {
        if(this.users.length !== 0) {
            return this.users;
        } else {
            const response = await fetch(`${BASE_URL}/users`);

            if(response.status === 404) {
                return []; // return an empty array if no records are found
            }
      
            if (!response.ok) {
                const errorText = await response.text(); // detailed error message
                throw new Error(`Fehler beim Abrufen der Users: ${response.status} - ${errorText}`);
            }
        
            return await response.json();
        }
    }

    // get user by id
    async getUserById(id: string): Promise<User | any> {
        if(this.users.find(user => user.id === id)) {
            return this.users.find(user => user.id === id);
        } else {
            const response = await fetch(`${BASE_URL}/users/${id}`);
            if(response.status === 404) {
                return []; // return an empty array if no records are found
            }
      
            if (!response.ok) {
                const errorText = await response.text(); // detailed error message
                throw new Error(`Fehler beim Abrufen des Users: ${response.status} - ${errorText}`);
            }
        
            return await response.json();
        }
    }

    // add new user to list 
    async addUser(user: User): Promise<void> {
        console.log("Adding user:", user);
        this.users.push(user);
        const response = await fetch(`${BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            throw new Error('Fehler beim Hinzufügen eines Users');
        }
    }

    // update user
    async updateUser(user: User): Promise<void> {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            this.users[index] = user;
        }
        const response = await fetch(`${BASE_URL}/users/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        if (!response.ok) {
            console.error("Fehler beim Aktualisieren des Users:", response.statusText);
            throw new Error('Fehler beim Aktualisieren des Users');
        }
    }

    // delete user by id
    async deleteUser (id: string): Promise<void> {
        this.users = this.users.filter(user => user.id !== id);
        const response = await fetch(`${BASE_URL}/users/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            console.error("Fehler beim Löschen des Users:", response.statusText);
            throw new Error('Fehler beim Löschen des Users');
        }
    }

    // set current user
    setCurrentUser(user: User | any | null): void {
        if (user instanceof User) {
            this.currentUser = user;
        } else if (user) {
            this.currentUser = new User({
                id: user.id,
                email: user.email,
                password: user.password ?? '',
                role: user.role,
                department: user.department,
                currentStatus: user.currentStatus,
                firstName: user.firstName,
                lastName: user.lastName
            });
        } else {
            this.currentUser = null;
        }

        if (this.currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    }

    // Get the current user
    getCurrentUser(): User | null {
        const storedUser = localStorage.getItem('currentUser');

        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);

                this.currentUser = new User({
                    id: parsed.id,
                    email: parsed.email,
                    password: parsed.password ?? '',
                    role: parsed.role,
                    department: parsed.department,
                    currentStatus: parsed.currentStatus,
                    firstName: parsed.firstName,
                    lastName: parsed.lastName
                });

            } catch (e) {
                console.warn("Fehler beim Parsen von currentUser aus localStorage:", e);
                localStorage.removeItem('currentUser');
                this.currentUser = null;
            }
        }
        return this.currentUser;
    }

    // sets or updates the status of the current user and saves it to localStorage
    setCurrentUserStatus(status: currentUserStatus): void {
        const today = this.dateService.getCurrentDate().toISOString();

        const statusWithDate = JSON.stringify({ status, date: today });

        if (this.currentUser) {
            this.currentUser.currentStatus = status;
            localStorage.setItem("currentStatus", statusWithDate);
        }
        this.currentStatus.value = status;
    }

    // get current status of user from localstorage: 'Eingestempelt' or 'Ausgestempelt' : default is 'Ausgestempelt' 
    getCurrentUserStatus(): currentUserStatus {
        const stored = localStorage.getItem("currentStatus");
    
        if (stored) {
            try {
                const { status, date } = JSON.parse(stored);
                const today = new Date();
                const savedDate = new Date(date);
    
                // Check if the saved date is today
                // Compare year, month, and day to check if they are the same
                const isSameDay = today.getFullYear() === savedDate.getFullYear()
                    && today.getMonth() === savedDate.getMonth()
                    && today.getDate() === savedDate.getDate();
    
                // if the saved date is today, return the status
                if (isSameDay && (status === "Eingestempelt" || status === "Ausgestempelt")) {
                    if (this.currentUser) {
                        this.currentUser.currentStatus = status;
                    }
                    return status;
                }
            } catch (e) {
                console.warn("Fehler beim Parsen von currentStatus aus localStorage:", e);
            }
        }
    
        // fallback to default value 'Ausgestempelt'
        return "Ausgestempelt";
    }
}
