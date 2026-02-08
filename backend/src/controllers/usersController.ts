import { deleteUser as deleteFirebaseUser } from 'firebase/auth';
import { auth } from '../config/firebase.js';
import { getDb } from '../lib/mongoClient.js';
import type { User } from '@shared/types'

// Shared helper to find a user by firebase id for controllers/services.
export const getUserById = async ({ id }: { id?: string } = {}) => {
  try {
    if (!id) {
      return null;
    }
    const db = await getDb();
    const user = await db.collection<User>('users').findOne({ _id: id });
    return user;
  } catch (error) {
    throw error;
  }
};

// Shared helper to insert a user document, ensuring Firebase UID sits in `_id` only.
export const insertUserDocument = async (user: User) => {
  const db = await getDb();
  const doc = { ...user };

  const result = await db.collection<User>('users').insertOne(doc);
  return { result, user: doc };
};

// Gets all users from MongoDB
export const getUsers = async (_req, res, next) => {
  try {
    const db = await getDb();
    const users = await db.collection<User>('users').find().toArray();
    res.json(users);
  } catch (error) {
    next(error);
  }
};


// Inserts a new user document into MongoDB
export const createUser = async (req, res, next) => {
  const user = req.body || {};

  try {
    const { result, user: insertedUser } = await insertUserDocument(user);
    if (result.acknowledged) {
      return res.status(201).json(insertedUser);
    }
    return res.status(500).json({ message: 'Fehler beim Hinzufügen des Users in MongoDB' });
  } catch (error) {
    next(error);
  }
};

// Updates a user document in MongoDB by its Firebase UID
export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const user = req.body || {};

  try {
    const db = await getDb();
    const updatePayload = { ...user };
    delete updatePayload._id;
    delete updatePayload.id;

    const result = await db.collection<User>('users').updateOne({ _id: id }, { $set: updatePayload });

    if (result.modifiedCount === 1) {
      return res.json({ message: 'User erfolgreich aktualisiert' });
    }
    return res.status(500).json({ message: 'Fehler beim Aktualisieren des User in MongoDB' });
  } catch (error) {
    next(error);
  }
};

// Deletes a user both from Firebase Auth and MongoDB along with related data
export const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      return res.status(401).json({ message: 'Nicht eingeloggt' });
    }
    if (firebaseUser.uid !== id) {
      return res.status(403).json({ message: 'Nicht autorisiert, diesen Benutzer zu löschen' });
    }

    await deleteFirebaseUser(firebaseUser);

    const db = await getDb();
    await db.collection('timeRecords').deleteMany({ userId: id });
    await db.collection('workdays').deleteMany({ userId: id });
    await db.collection('projects').deleteMany({ userId: id });
    const result = await db.collection<User>('users').deleteOne({ _id: id });

    if (result.deletedCount === 1) {
      return res.json({ message: 'Benutzerkonto erfolgreich gelöscht' });
    }
    return res.status(500).json({ message: 'Fehler beim Löschen des User in MongoDB' });
  } catch (error) {
    next(error);
  }
};

// Updates user preferences in MongoDB
export const updatePreferences = async (req, res, next) => {
  const { id } = req.params;
  const preferences = req.body || {};

  try {
    const db = await getDb();
    const result = await db.collection<User>('users').updateOne({ _id: id }, { $set: { preferences } });
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }

    res.json({ message: 'Präferenzen gespeichert', preferences });
  } catch (error) {
    next(error);
  }
};

// Gets user preferences from MongoDB
export const getPreferences = async (req, res, next) => {
  const { id } = req.params;

  try {
    const db = await getDb();
    const user = await db.collection<User>('users').findOne(
      { _id: id },
      { projection: { preferences: 1 } }
    );
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }
    res.json(user.preferences ?? {});
  } catch (error) {
    next(error);
  }
};
