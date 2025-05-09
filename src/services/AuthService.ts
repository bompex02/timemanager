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
    async registerUser(email: string, password: string): Promise<void> {
        return createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                let appUser = new User(
                    userCredential.user.uid, 
                    email, 
                    password, 
                    "user", // default role
                    "default", // default department
                    "Ausgestempelt" // default status
                );           
                userService.addUser(appUser);
                console.log("User registered successfully", userCredential);
            })
            .catch((error) => {
                console.error("Error registering user", error);
                throw error;
            }
        );
    }

    // login user with username + password via firebase auth
    async logInUser(email: string, password: string, router?: any): Promise<void> {
        return signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {  
                let appUser = new User(
                    userCredential.user.uid,
                    email,
                    password,
                    "user", // default role
                    "default", // default department
                    "Ausgestempelt" // default status
                );
                userService.setCurrentUser(appUser); // Set current user;        
                console.log("User registered successfully", userCredential);
                router.push('/dashboard');
            })
            .catch((error) => {
                console.error("Error registering user", error);
                throw error;
            }
        );
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
