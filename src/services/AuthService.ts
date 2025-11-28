import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { UserService } from "./UserService";
import { User } from "../models/User";

const userService = UserService.getInstance();

export class AuthService {
    private static instance: AuthService;

    constructor() {} // prevent another instantiation

    // Singleton pattern to ensure only one instance of AuthService exists
    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    // register new user with username + password via firebase auth
    async registerUser(email: string, password: string, firstName: string, lastName: string): Promise<void> {
        return createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const appUser = new User({
                    id: userCredential.user.uid,
                    email,
                    password,
                    firstName,
                    lastName,
                });        
                userService.setCurrentUser(appUser); // Set current user;
                userService.addUser(appUser);
                console.log("User registered successfully", appUser);
            })
            .catch((error) => {
                console.error("Error registering user", error);
                throw error;
            }
        );
    }

    // login user with username + password via firebase auth
    async logInUser(email: string, password: string, router?: any): Promise<void> {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // Try to fetch the full user profile (including firstName/lastName) from backend
            let storedUser: any = null;
            try {
                storedUser = await userService.getUserById(userCredential.user.uid);
            } catch (e) {
                // If backend fetch fails, we'll fallback to basic user created from auth
                console.warn('Could not fetch full user profile from backend:', e);
            }

            if (storedUser && storedUser.id) {
                userService.setCurrentUser(storedUser);
                console.log('User logged in successfully (profile loaded)', storedUser);
            } else {
                const appUser = new User({
                    id: userCredential.user.uid,
                    email,
                    password,
                });
                userService.setCurrentUser(appUser);
                console.log('User logged in successfully (basic)', appUser);
            }

            if (router) {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Error logging in user', error);
            throw error;
        }
}

    // logout user via firebase auth and reset current user in userService
    // param router is nullable (optional)
    async logOutUser(router? : any): Promise<void> {
        return signOut(auth)
            .then(() => {
                userService.setCurrentUser(null); // Set current user to null
                console.log("User logged out successfully");
                router.push('/login');
            })
            .catch((error) => {
                console.error("Error logging out user", error);
                throw error;
            }
        );
    }
}
