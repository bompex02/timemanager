import { getDb } from '../lib/mongoClient.js';
import { ObjectId } from 'mongodb';
import type { Project } from '@shared/types'

export const listProjects = async (_req, res, next) => {
  try {
    const db = await getDb();
    const projects = await db.collection<Project>('projects').find().toArray();
    if (!projects.length) {
      return res.status(404).json({ message: 'Keine Einträge gefunden' });
    }
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  const project = req.body || {} as Project;
  try {
    const db = await getDb();
    const result = await db.collection('projects').insertOne(project);
    res.status(201).json({ ...project, _id: new ObjectId(result.insertedId) });
  } catch (error) {
    next(error);
  }
};

export const countProjectsByUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const db = await getDb();
    const count = await db.collection('projects').countDocuments({ userId });
    res.json(count);
  } catch (error) {
    next(error);
  }
};

export const listProjectsByUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const db = await getDb();
    const projects = await db.collection('projects').find({ userId }).toArray();
    if (!projects.length) {
      return res.status(404).json({ message: 'Keine Projekte für diesen Benutzer gefunden' });
    }
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req, res, next) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    const project = await db.collection('projects').findOne({ _id: new ObjectId(id) });
    if (!project) {
      return res.status(404).json({ message: 'Kein Eintrag gefunden' });
    }
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  const { id } = req.params;
  const project = req.body || {};
  try {
    const db = await getDb();
    const result = await db.collection('projects').updateOne({ _id: new ObjectId(id) }, { $set: project });
    if (result.modifiedCount === 1) {
      return res.json(project);
    }
    return res.status(500).json({ message: 'Fehler beim Aktualisieren des Projekts in MongoDB' });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    const result = await db.collection('projects').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      return res.json({ message: 'Projekt erfolgreich gelöscht' });
    }
    return res.status(500).json({ message: 'Fehler beim Löschen des Projekts in MongoDB' });
  } catch (error) {
    next(error);
  }
};
