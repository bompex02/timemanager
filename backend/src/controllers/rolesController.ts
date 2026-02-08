import { getDb } from '../lib/mongoClient.js';
import type { Role } from '@shared/types'

export const listRoles = async (_req, res, next) => {
  try {
    const db = await getDb();
    const roles = await db.collection<Role>('roles').find().toArray();
    res.json(roles);
  } catch (error) {
    next(error);
  }
};

export const getRole = async (req, res, next) => {
  const roleId = req.params.id;
  if (roleId === null) {
    return res.status(400).json({ message: 'Ungültige ID' });
  }

  try {
    const db = await getDb();
    const role = await db.collection('roles').findOne({ _id: roleId });
    if (!role) {
      return res.status(404).json({ message: 'Rolle nicht gefunden' });
    }
    res.json(role);
  } catch (error) {
    next(error);
  }
};

export const createRole = async (req, res, next) => {
  const role = req.body || {} as Role;
  try {
    const db = await getDb();
    const result = await db.collection('roles').insertOne(role);
    res.status(201).json({ ...role, _id: result.insertedId });
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (req, res, next) => {
  const roleId = req.params.id;
  if (roleId === null) {
    return res.status(400).json({ message: 'Ungültige ID' });
  }

  const role = req.body || {};
  try {
    const db = await getDb();
    const result = await db.collection('roles').updateOne({ _id: roleId }, { $set: role });
    if (result.modifiedCount === 1) {
      return res.json(role);
    }
    return res.status(500).json({ message: 'Fehler beim Aktualisieren der Rolle in MongoDB' });
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async (req, res, next) => {
  const roleId = req.params.id;
  if (roleId === null) {
    return res.status(400).json({ message: 'Ungültige ID' });
  }

  try {
    const db = await getDb();
    const result = await db.collection('roles').deleteOne({ _id: roleId });
    if (result.deletedCount === 1) {
      return res.json({ message: 'Rolle erfolgreich gelöscht' });
    }
    return res.status(500).json({ message: 'Fehler beim Löschen der Rolle in MongoDB' });
  } catch (error) {
    next(error);
  }
};
