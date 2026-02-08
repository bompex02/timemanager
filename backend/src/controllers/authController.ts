import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updatePassword } from 'firebase/auth';
import { auth } from '../config/firebase.js';
import { getUserById, insertUserDocument } from './usersController.js';
import { User, defaultUserPreferences } from '@shared/types'

// Register a user in Firebase Auth and then persist the profile in MongoDB
export const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body || {};

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Email, Passwort, Vorname und Nachname sind erforderlich' });
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    const appUser: User = {
      _id: userCredential.user.uid,
      email,
      firstName: firstName,
      lastName: lastName,
      roleId: 2, // always default to normal user on registration
      preferences: defaultUserPreferences,
    };

    const { result, user: insertedUser } = await insertUserDocument(appUser);
    if (!result.acknowledged) {
      return res.status(500).json({ message: 'Fehler beim Anlegen des Benutzers' });
    }

    return res.status(201).json({ user: insertedUser });
  } catch (error) {
    const message = mapFirebaseError(error);
    if (message) {
      return res.status(400).json({ message });
    }
    next(error);
  }
}

// Login endpoint mirroring the v1 AuthService: verifies the Firebase credentials and returns the stored profile
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email und Passwort erforderlich' });
    }

    if (email && password) {
      // connect to Firebase Auth
      const credential = await signInWithEmailAndPassword(auth, email, password);
      
      // fetch the stored user profile from MongoDB
      const storedUser = await getUserById({ id: credential.user.uid });
      
      if (!storedUser) {
        return res.status(404).json({ message: 'Benutzerprofil nicht gefunden' });
      }
      return res.json({ user: storedUser });
    }

    return res.status(400).json({ message: 'Email und Passwort sind erforderlich' });
  } catch (error) {
    const message = mapFirebaseError(error);
    if (message) {
      return res.status(400).json({ message });
    }
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await signOut(auth);
    return res.status(204).send();
  } catch (error) {
    const message = mapFirebaseError(error);
    if (message) {
      return res.status(400).json({ message });
    }
    next(error);
  }
};

// Change password for the current user
export const changePassword = async (req, res, next) => {
  try {
    const { email, password, newPassword } = req.body || {};

    if (!email || !password || !newPassword) {
      return res.status(400).json({ message: 'Email, aktuelles Passwort und neues Passwort sind erforderlich' });
    }

    // Re-authenticate user for security reasons before changing password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Update to the new password to Firebase Auth
    await updatePassword(userCredential.user, newPassword);

    return res.json({ message: 'Passwort erfolgreich aktualisiert' });
  } catch (error) {
    const message = mapFirebaseError(error);
    if (message) {
      return res.status(400).json({ message });
    }
    next(error);
  }
};

// Map Firebase Auth errors to user-friendly messages
const mapFirebaseError = (error) => {
  const errorCode = error?.code || '';
  const errorMessages = {
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

  return errorMessages[errorCode];
};
