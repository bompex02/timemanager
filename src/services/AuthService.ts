import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updatePassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { UserService } from "./UserService";
import { showSuccess, showError } from '../services/ToastService';
import { User, defaultUserPreferences } from "../models/User";

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

    // register new user
    async registerUser(email: string, password: string, firstName: string, lastName: string, router: any): Promise<void> {
        try {
            // create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // generate user object
            const appUser = new User({
                id: userCredential.user.uid,
                email,
                roleId: 2, // roleId 2  = normal user (default)
                firstName,
                lastName,
                preferences: { ...defaultUserPreferences },
            });

            // save user in backend database
            await userService.addUser(appUser);
            // set current user
            userService.setCurrentUser(appUser);
            
            showSuccess(`Willkommen ${firstName}! Account erfolgreich erstellt.`);
            console.log('✅ User erfolgreich registriert:', appUser);
            await router.push('/dashboard');

        } catch (error: any) {
            console.error('❌ Fehler bei Registrierung:', error);
            
            const errorMessage = this.getErrorMessage(error);
            showError(errorMessage);
            
            throw error;
        }
    }

    // login user
    async logInUser(email: string, password: string, router: any): Promise<void> {       
        try {
            // connect to Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // load user profile from backend
            const storedUser = await userService.getUserById(userCredential.user.uid);
            
            if (!storedUser) {
                throw new Error('Kein Benutzerprofil im Backend gefunden');
            }
            
            // set current user
            userService.setCurrentUser(storedUser);
            
            showSuccess(`Willkommen zurück, ${storedUser.firstName}!`);
            
            await router.push('/dashboard');

        } catch (error: any) {
            console.error('❌ Fehler beim Login:', error);
            
            const errorMessage = this.getErrorMessage(error);
                showError(errorMessage);
            
            throw error;
        }
    }

    // logout user
    async logOutUser(router: any): Promise<void> {
        try {
            await signOut(auth);
            userService.setCurrentUser(null);
            
            console.log('✅ User erfolgreich ausgeloggt');
            showSuccess('Erfolgreich ausgeloggt');

            await router.push('/login');
        } catch (error: any) {
            console.error('❌ Fehler beim Logout:', error);
            showError('Fehler beim Ausloggen');
            throw error;
        }
    }

    // helper to map Firebase Auth errors to user-friendly messages
    private getErrorMessage(error: any): string {
        const errorCode = error?.code || '';
        
        const errorMessages: Record<string, string> = {
            'auth/invalid-credential': 'Email oder Passwort ist falsch',
            'auth/user-not-found': 'Kein Benutzer mit dieser Email gefunden',
            'auth/wrong-password': 'Falsches Passwort',
            'auth/weak-password': 'Passwort muss mindestens 6 Zeichen lang sein',
            'auth/email-already-in-use': 'Diese Email-Adresse wird bereits verwendet',
            'auth/invalid-email': 'Ungültige Email-Adresse',
            'auth/too-many-requests': 'Zu viele Versuche. Bitte später nochmal versuchen',
            'auth/user-disabled': 'Dieser Account wurde deaktiviert',
            'auth/network-request-failed': 'Netzwerkfehler. Bitte Verbindung prüfen',
        };

        return errorMessages[errorCode] || error?.message || 'Ein unbekannter Fehler ist aufgetreten';
    }

    async changeUserPassword(newPassword: string): Promise<void> {
        const user = auth.currentUser;
        if (user) {
            return updatePassword(user, newPassword)
                .then(() => {
                    console.log("User password updated successfully");
                })
                .catch((error) => {
                    console.error("Error updating user password", error);
                    throw error;
                }
            );
        }
    }
}