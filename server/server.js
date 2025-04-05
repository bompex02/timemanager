import express from 'express';
import { ObjectId } from 'mongodb';
import cors from 'cors';
import { getDb } from './mongoClient.js';

const app = express();
app.use(cors());
app.use(express.json());

// default route
app.get('/', (req, res) => {
    res.json({"message":"Server is running"});
});

// gets all records of the mongoDb collection 'timeRecords'
app.get('/records', async (req, res) => {
    try {
        const db = await getDb();
        const records = await db.collection('timeRecords').find().toArray();

        if(!records || records.length === 0) {
            return res.status(404).json({ message: 'Keine Einträge gefunden' });
        }

        res.json(records);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Serverfehler', error: error.message });
    }
});

// adds new record to the mongoDb collection 'timeRecords' and returns the added record
app.post('/records', async (req, res) => {
    const record = req.body;

    try {
        const db = await getDb();
        await db.collection('timeRecords').insertOne(record);
        res.status(201).json(record);
    } catch (error) {
        console.error('Fehler beim Hinzufügen:', error);
        res.status(500).json({ message: 'Serverfehler', error: error.message });
    }
});

// gets the record of a specific id from the mongoDb collection 'timeRecords'
app.get('/records/:id', async (req, res) => {
    const { id } = req.params;
  
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Ungültige ID' });
    }
  
    try {
        const db = await getDb();
        // find the record by id in the mongoDb collection 'timeRecords'
        const record = await db.collection('timeRecords').findOne({ _id: ObjectId.createFromHexString(id) });
  
        // if record is not found, return 404
        if (!record) {
            return res.status(404).json({ message: 'Kein Eintrag gefunden' });
        }
    
        // if record is found, return the record
        res.json(record);
    } catch (error) { // catch any error with 500 status code (server error)
        console.error('Fehler beim Abrufen:', error);
        res.status(500).json({ message: 'Serverfehler', error: error.message });
    }
  });

  // updates the record of a specific id in the mongoDb collection 'timeRecords'
  app.put('/records/:id', async (req, res) => {
    const { id } = req.params;
    const record = req.body;

    // check if the id is valid, if not, return 400
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Ungültige ID' });
    }

    try{
        const db = await getDb();
        
        const result = await db.collection('timeRecords').updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: record });
        
        // if no record is found, return 404
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Kein Eintrag gefunden' });
        }

        // if no record is updated, return 400
        if (result.modifiedCount === 0) {
            return res.status(400).json({ message: 'Keine Änderungen vorgenommen' });
        }
        // if record is updated, return 200
        res.status(200).json({ message: 'Eintrag aktualisiert' });

    } catch (error) {
        console.error('Fehler beim Aktualisieren:', error);
        res.status(500).json({ message: 'Serverfehler', error: error.message });
    }
});

// deletes the record of a specific id in the mongoDb collection 'timeRecords'
app.delete('/records/:id', async (req, res) => {
    const { id } = req.params;

    // check if the id is valid, if not, return 400
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Ungültige ID' });
    }

    try {
        const db = await getDb();
        const result = await db.collection('timeRecords').deleteOne({ _id: ObjectId.createFromHexString(id) });

        // if no record is found, return 404
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Kein Eintrag gefunden' });
        }

        // if record is deleted, return 200
        res.status(200).json({ message: 'Eintrag gelöscht' });
        
    } catch (error) {
        console.error('Fehler beim Löschen:', error);
        res.status(500).json({ message: 'Serverfehler', error: error.message });
    }
});

// gets all records from the mongoDb collection 'timeRecords' for a specific user by userId
app.get('/records/user/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const db = await getDb();

        // find all records for the user by userId 
        const records = await db.collection('timeRecords').find({ userId: userId }).toArray();

        res.json(records);

    } catch (error) {
        console.error('Fehler beim Abrufen:', error);
        res.status(500).json({ message: 'Serverfehler', error: error.message });
    }
});
  

// returns that the server is running on specified port
app.listen(3000, () => {
    console.log('Server is running on port 3000');
    try {
        const db = getDb();
        db.then(() => {
            console.log('✅ MongoDB verbunden');
        }).catch((error) => {
            console.error('❌ MongoDB nicht verbunden:', error);
        });
    } catch (error) {
        console.error('❌ MongoDB nicht verbunden:', error);
    }
});