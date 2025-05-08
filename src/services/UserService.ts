import { reactive, ref } from "vue";
import { User } from "../models/User";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { DateService } from "../services/DateService";
import type { currentUserStatus } from "../models/User";

export class UserService {
    private static instance: UserService;
    private users = reactive<User[]>([]);
    private currentUser: User | null = null;
    public currentStatus = ref<currentUserStatus>('Ausgestempelt');
    private auth = auth;

    private dateService = DateService.getInstance();

    constructor() {
        // Sync with Firebase auth state
        onAuthStateChanged(this.auth, (firebaseUser) => {
            if (firebaseUser) {
                // Convert Firebase user to our User model
                const user = new User(
                    firebaseUser.uid,
                    firebaseUser.email || '',
                    '', // password not available from Firebase auth
                    'user', // default role
                    '', // empty department by default
                    'Ausgestempelt' // default status
                );
                this.setCurrentUser(user);
            } else {
                this.setCurrentUser(null);
            }
            // set current status after auth state is settled
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

    // delete user by id
    deleteUser (id: string): void {
        this.users = this.users.filter(user => user.id !== id);
    }

    // set current user
    setCurrentUser(user: User | null): void {
        this.currentUser = user;
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('currentUser');
        }
    }

    // Get the current user
    getCurrentUser(): User | null {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                this.currentUser = JSON.parse(storedUser) as User;
            } catch (e) {
                localStorage.removeItem('currentUser');
            }
        }
        return this.currentUser;
    }

    // sets or updates the status of the current user and saves it to localStorage
    setCurrentUserStatus(status: User["currentStatus"]): void {
        const today = this.dateService.getCurrentDate().toISOString();

        const statusWithDate = JSON.stringify({ status, date: today });

        if (this.currentUser) {
            this.currentUser.currentStatus = status;
            localStorage.setItem("currentStatus", statusWithDate);
        }
        this.currentStatus.value = status;
    }

    // get current status of user from localstorage: 'Eingestempelt' or 'Ausgestempelt' : default is 'Ausgestempelt' 
    getCurrentUserStatus(): User["currentStatus"] {
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
