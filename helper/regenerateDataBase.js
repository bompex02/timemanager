// Helper script to regenerate the database with recent time records for testing purposes.
// This script connects to a MongoDB database, deletes existing time records, and generates new time records for two users.
// It creates a total of 176 entries per user, simulating a work schedule with start times, lunch breaks, and end times.

import { MongoClient } from 'mongodb';
import { randomInt } from 'crypto';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const uri = process.env.MONGODB_CONNECTION_STRING;
const client = new MongoClient(uri);

async function regenerateRecentTimeRecords() {
  try {
    await client.connect();
    const db = client.db('timemanager');
    const collection = db.collection('timeRecords');

    // Vorher alles löschen
    await collection.deleteMany({});
    console.log('🗑️ Alle bestehenden Time Records gelöscht.');

    const users = [
      'hDfzloIqeyUBhdoBo7uxLdQdji23',
      'z1cmTuivGIX8HMSvVSji259zzjx2',
    ];

    const bulkOperations = [];
    let recordId = 1;

    // Jeder Benutzer soll 176 Einträge bekommen (44 Tage * 4 Einträge)
    const entriesPerUser = 176;
    const daysNeeded = entriesPerUser / 4;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const userId of users) {
      let entriesGenerated = 0;
      let date = new Date(today);

      while (entriesGenerated < entriesPerUser) {
        // Rückwärts gehen
        date.setDate(date.getDate() - 1);

        if (date.getDay() === 0 || date.getDay() === 6) {
          continue; // Wochenende überspringen
        }

        // Arbeitsbeginn zwischen 08:00 und 09:00 Uhr
        const startHour = randomInt(8, 9);
        const startMinute = randomInt(0, 60);
        const start = new Date(date);
        start.setHours(startHour, startMinute);

        // Mittagspause ca. 12:00–13:00
        const lunchStart = new Date(start);
        lunchStart.setHours(12, randomInt(0, 15));

        const lunchEnd = new Date(lunchStart);
        lunchEnd.setMinutes(lunchStart.getMinutes() + randomInt(30, 45));

        // Feierabend zwischen 17:00 und 18:30
        const end = new Date(start);
        end.setHours(17 + randomInt(0, 2));
        end.setMinutes(randomInt(0, 30));

        const records = [
          { userId, recordType: 'Einstempeln', timestamp: start },
          { userId, recordType: 'Ausstempeln', timestamp: lunchStart },
          { userId, recordType: 'Einstempeln', timestamp: lunchEnd },
          { userId, recordType: 'Ausstempeln', timestamp: end },
        ];

        records.forEach(record => {
          bulkOperations.push({
            insertOne: {
              document: {
                id: recordId++,
                userId: record.userId,
                recordType: record.recordType,
                timestamp: record.timestamp.toISOString(),
              },
            },
          });
        });

        entriesGenerated += 4;
      }
    }

    if (bulkOperations.length > 0) {
      await collection.bulkWrite(bulkOperations);
      console.log(`✅ ${bulkOperations.length} Time Records erfolgreich rückwirkend generiert.`);
    } else {
      console.log('ℹ️ Keine Datensätze zum Einfügen gefunden.');
    }
  } catch (err) {
    console.error('❌ Fehler beim Verarbeiten:', err);
  } finally {
    await client.close();
  }
}

regenerateRecentTimeRecords();
