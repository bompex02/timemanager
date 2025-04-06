import { reactive, ref } from "vue";
import { User } from "../models/User";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import type { currentUserStatus } from "../models/User";

export class UserService {
    private static instance: UserService;
    private users = reactive<User[]>([]);
    private currentUser: User | null = null;
    public currentStatus = ref<currentUserStatus>('Ausgestempelt');
    private auth = auth;

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

    // sets or updates the status of the current user
    setCurrentUserStatus(status: User["currentStatus"]): void {
        if (this.currentUser) {
            this.currentUser.currentStatus = status;
        }
        this.currentStatus.value = status;
    }

    // get current status of user: 'Eingestempelt' or 'Ausgestempelt' : default is 'Ausgestempelt'
    getCurrentUserStatus(): User["currentStatus"] {
        let currentUser = this.currentUser;
        if(currentUser){
            if(currentUser.currentStatus) {
                return currentUser.currentStatus;
            }
        }
        return 'Ausgestempelt';;
    }    
}
