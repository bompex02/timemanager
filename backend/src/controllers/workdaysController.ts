import { getDb } from '../lib/mongoClient.js';
import type { Workday } from '@shared/types'

export const listWorkdays = async (_req, res, next) => {
  try {
    const db = await getDb();
    const workdays = await db.collection<Workday>('workdays').find().toArray();
    if (!workdays.length) {
      return res.status(404).json({ message: 'Keine Einträge gefunden' });
    }
    res.json(workdays);
  } catch (error) {
    next(error);
  }
};

export const createWorkday = async (req, res, next) => {
  const workday = req.body || {} as Workday;
  try {
    const db = await getDb();
    const result = await db.collection('workdays').insertOne(workday);
    res.status(201).json({ ...workday, _id: result.insertedId });
  } catch (error) {
    next(error);
  }
};

export const getWorkdaysByUserAndDate = async (req, res, next) => {
  const { userId, date } = req.params;
  try {
    const db = await getDb();
    const workdays = await db.collection('workdays').find({ userId, date }).toArray();
    res.json(workdays);
  } catch (error) {
    next(error);
  }
};

export const getWorkdaysByUserAndMonth = async (req, res, next) => {
  const { userId, year, month } = req.params;

  if (!year || !month) {
    return res.status(400).json({ message: 'year und month Parameter sind erforderlich' });
  }

  const parsedYear = Number.parseInt(year, 10);
  const parsedMonth = Number.parseInt(month, 10);

  if (Number.isNaN(parsedYear) || Number.isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
    return res.status(400).json({ message: 'Ungültige year/month Parameter' });
  }

  const monthIndex = parsedMonth - 1;
  const startDate = new Date(parsedYear, monthIndex, 1, 0, 0, 0, 0);
  const endDate = new Date(parsedYear, monthIndex + 1, 1, 0, 0, 0, 0);
  const monthPrefix = `${parsedYear}-${String(parsedMonth).padStart(2, '0')}`;

  try {
    const db = await getDb();
    const workdays = await db.collection<Workday>('workdays').find({
      userId,
      $or: [
        { date: { $regex: `^${monthPrefix}` } },
        { date: { $gte: startDate, $lt: endDate } },
      ],
    } as any).toArray();

    res.json(workdays);
  } catch (error) {
    next(error);
  }
};

export const getWorkdaysByUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const db = await getDb();
    const workdays = await db.collection('workdays').find({ userId }).toArray();
    res.json(workdays);
  } catch (error) {
    next(error);
  }
};

export const getWorkday = async (req, res, next) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    const workday = await db.collection('workdays').findOne({ _id: id });
    if (!workday) {
      return res.status(404).json({ message: 'Kein Eintrag gefunden' });
    }
    res.json(workday);
  } catch (error) {
    next(error);
  }
};

export const updateWorkday = async (req, res, next) => {
  const { userId } = req.params;
  const { date, hoursWorked, homeOffice } = req.body || {};

  if (!date) {
    return res.status(400).json({ message: 'Datum fehlt' });
  }

  try {
    const db = await getDb();
    const result = await db.collection('workdays').updateOne(
      { userId, date: { $regex: `^${date}` } },
      { $set: { hoursWorked, homeOffice } },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Kein Workday gefunden' });
    }

    res.json({ message: 'Workday aktualisiert' });
  } catch (error) {
    next(error);
  }
};

export const deleteWorkday = async (req, res, next) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    const result = await db.collection('workdays').deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Kein Eintrag gefunden' });
    }

    res.json({ message: 'Eintrag gelöscht' });
  } catch (error) {
    next(error);
  }
};

export const getHomeOfficeForUserByDate = async (req, res, next) => {
  const { userId, date } = req.params;
  try {
    const db = await getDb();
    const workday = await db.collection<Workday>('workdays').findOne({ userId, date: { $regex: `^${date}` } });
    if (!workday) {
      return res.status(404).json({ message: 'Kein Eintrag gefunden' });
    }
    res.json({ homeOffice: workday.homeOffice });
  } catch (error) {
    next(error);
  }
};

export const getHomeOfficeForUserByDateRange = async (req, res, next) => {
  const { userId } = req.params;
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ message: 'Fehlende from- oder to-Parameter' });
  }

  try {
    const db = await getDb();
    const workdays = await db.collection<Workday>('workdays').find({ userId }).toArray();

    const normalizeDateKey = (value?: string) => {
      if (!value) return '';
      return value.slice(0, 10);
    };

    const result: Record<string, boolean> = {};
    for (const workday of workdays) {
      const dateKey = normalizeDateKey(workday.date);
      if (!dateKey) continue;
      if (dateKey < from || dateKey > to) continue;
      if (result[dateKey] !== undefined) continue;
      result[dateKey] = Boolean(workday.homeOffice);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getWorkdaysOfLast2WeeksByUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const db = await getDb();
    const allWorkdays = await db.collection<Workday>('workdays').find({ userId }).toArray();
    
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 14);
    const filteredWorkdays = allWorkdays.filter(workday => {
      const workdayDate = new Date(workday.date);
      return workdayDate >= pastDate && workdayDate <= today;
    });

    res.json(filteredWorkdays);
  } catch (error) {
    next(error);
  }
};
