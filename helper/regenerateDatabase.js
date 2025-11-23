import { MongoClient } from 'mongodb';
import { randomInt } from 'crypto';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

dotenv.config();

const uri = process.env.MONGODB_CONNECTION_STRING;

const client = new MongoClient(uri);

const DB_NAME = 'timemanager';
const USERS = ['DtgouehyVjaHHxFTnscyEXEmlvJ2', 'ykCZaAbIWSaZHIDcpSznAytXp0h1', 'dZhuDsoivdQGoAlyTjkljvNZBN62'];
const ENTRIES_PER_USER = 176;

const getMidnightToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const isWeekday = (date) => date.getDay() !== 0 && date.getDay() !== 6;

async function regenerateAllData() {
  try {
    await client.connect();
    const db = client.db(DB_NAME);

    const timeRecords = db.collection('timeRecords');
    const workdays = db.collection('workdays');
    const projects = db.collection('projects');

    // Clean up existing data
    await timeRecords.deleteMany({});
    await workdays.deleteMany({});
    await projects.deleteMany({});
    console.log('🗑️  Alte Daten in TimeRecords, Workdays und Projects gelöscht.');

    const timeRecordOps = [];
    const workdayOps = [];
    const projectOps = [];

    let recordId = 1;

    for (const userId of USERS) {
      let entriesGenerated = 0;
      let date = getMidnightToday();

      const recordsByDay = {};

      while (entriesGenerated < ENTRIES_PER_USER) {
        date.setDate(date.getDate() - 1);
        if (!isWeekday(date)) continue;

        const start = new Date(date);
        start.setHours(randomInt(8, 9), randomInt(0, 60));

        const lunchStart = new Date(start);
        lunchStart.setHours(12, randomInt(0, 15));

        const lunchEnd = new Date(lunchStart);
        lunchEnd.setMinutes(lunchStart.getMinutes() + randomInt(30, 45));

        const end = new Date(start);
        end.setHours(17 + randomInt(0, 2), randomInt(0, 30));

        const recordDateKey = date.toISOString().split('T')[0];
        recordsByDay[recordDateKey] = { timestamps: [] };

        const stamps = [
          { recordType: 'Einstempeln', time: start },
          { recordType: 'Ausstempeln', time: lunchStart },
          { recordType: 'Einstempeln', time: lunchEnd },
          { recordType: 'Ausstempeln', time: end },
        ];

        for (const { recordType, time } of stamps) {
          timeRecordOps.push({
            insertOne: {
              document: {
                id: recordId++,
                userId,
                recordType,
                timestamp: time.toISOString(),
              }
            }
          });
          recordsByDay[recordDateKey].timestamps.push(time.getTime());
        }

        entriesGenerated += 4;
      }

      // Generate workdays from above timestamps
      for (const [dateStr, { timestamps }] of Object.entries(recordsByDay)) {
        if (timestamps.length !== 4) continue;
        const sorted = timestamps.sort();
        const totalMsWorked = (sorted[1] - sorted[0]) + (sorted[3] - sorted[2]);
        const hoursWorked = +(totalMsWorked / (1000 * 60 * 60)).toFixed(2);

        workdayOps.push({
          insertOne: {
            document: {
              userId,
              date: new Date(dateStr).toISOString(),
              hoursWorked,
              homeOffice: Math.random() < 0.5,
            },
          }
        });
      }

      // Generate 6–10 test projects
      const projectCount = randomInt(6, 11);
      const states = ['Aktiv', 'Inaktiv', 'Abgeschlossen', 'Abgebrochen'];

      for (let i = 1; i <= projectCount; i++) {
        projectOps.push({
          insertOne: {
            document: {
              userId,
              name: `Testprojekt ${i}`,
              description: `Dies ist ein automatisch erstelltes Testprojekt #${i}`,
              state: states[randomInt(0, states.length)],
              createdAt: new Date().toISOString(),
            }
          }
        });
      }
    }

    // Perform all scripts
    if (timeRecordOps.length) {
      await timeRecords.bulkWrite(timeRecordOps);
      console.log(`✅ ${timeRecordOps.length} TimeRecords erstellt.`);
    }

    if (workdayOps.length) {
      await workdays.bulkWrite(workdayOps);
      console.log(`✅ ${workdayOps.length} Workdays erstellt.`);
    }

    if (projectOps.length) {
      await projects.bulkWrite(projectOps);
      console.log(`✅ ${projectOps.length} Testprojekte erstellt.`);
    }

  } catch (err) {
    console.error('❌ Fehler:', err);
  } finally {
    await client.close();
    console.log('🔒 Verbindung zur Datenbank geschlossen.');
  }
}

regenerateAllData();