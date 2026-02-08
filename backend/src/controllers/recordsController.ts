import { getDb } from '../lib/mongoClient.js';
import type { TimeRecord } from '@shared/types'

export const listRecords = async (_req, res, next) => {
  try {
    const db = await getDb();
    const records = await db.collection<TimeRecord>('timeRecords').find().toArray();
    if (!records.length) {
      return res.status(404).json({ message: 'Keine Einträge gefunden' });
    }
    res.json(records);
  } catch (error) {
    next(error);
  }
};

export const createRecord = async (req, res, next) => {
  const record = req.body || {} as TimeRecord;
  try {
    const db = await getDb();
    const result = await db.collection('timeRecords').insertOne(record);
    res.status(201).json({ ...record, _id: result.insertedId });
  } catch (error) {
    next(error);
  }
};

export const getRecordsByUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const db = await getDb();
    const records = await db.collection('timeRecords').find({ userId }).toArray();
    res.json(records);
  } catch (error) {
    next(error);
  }
};

export const getRecord = async (req, res, next) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    const record = await db.collection('timeRecords').findOne({ _id: id });
    if (!record) {
      return res.status(404).json({ message: 'Kein Eintrag gefunden' });
    }
    res.json(record);
  } catch (error) {
    next(error);
  }
};

export const updateRecord = async (req, res, next) => {
  const { id } = req.params;
  const record = req.body || {};
  try {
    const db = await getDb();
    const result = await db.collection('timeRecords').updateOne({ _id: id }, { $set: record });
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Kein Eintrag gefunden' });
    }
    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: 'Keine Änderungen vorgenommen' });
    }
    res.json({ message: 'Eintrag aktualisiert' });
  } catch (error) {
    next(error);
  }
};

export const deleteRecord = async (req, res, next) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    const result = await db.collection('timeRecords').deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Kein Eintrag gefunden' });
    }
    res.json({ message: 'Eintrag gelöscht' });
  } catch (error) {
    next(error);
  }
};
