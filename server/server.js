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

// returns that the server is running on specified port
app.listen(3000, () => {
    console.log('Server is running on port 3000');
    try {
        const db = getDb();
        db.then(() => {
            console.log('✅ MongoDB verbunden');
        }).catch((error) => {
            console.error('❌ MongoDB nicht verbunden: ', error);
        });
    } catch (error) {
        console.error('❌ Fehler bei Verbindungsversuch zur MongoDB: ', error);
    }
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
        const result = await db.collection('timeRecords').insertOne(record);
        
        if (result.acknowledged) {
            return res.status(201).json(record);
        } else {
            return res.status(500).json({ message: 'Fehler beim Hinzufügen des TimeRecords in MongoDB' });
        }
    } catch (error) {
        console.error('Fehler beim Hinzufügen:', error);
        return res.status(500).json({ message: 'Serverfehler', error: error.message });
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

// gets all records from the mongoDb collection 'workdays'
app.get('/workdays', async (req, res) => {
    try {
        const db = await getDb();
        const workdays = await db.collection('workdays').find().toArray();

        if(!workdays || workdays.length === 0) {
            return res.status(404).json({ message: 'Keine Einträge gefunden' });
        }

        res.json(workdays);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Serverfehler', error: error.message });
    }
});

// gets a specific record from the mongoDb collection 'workdays' by id
app.get('/workdays/:id', async (req, res) => {
    const { id } = req.params;
  
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Ungültige ID' });
    }
  
    try {
        const db = await getDb();
        // find the record by id in the mongoDb collection 'workdays'
        const workday = await db.collection('workdays').findOne({ _id: ObjectId.createFromHexString(id) });
  
        // if record is not found, return 404
        if (!workday) {
            return res.status(404).json({ message: 'Kein Eintrag gefunden' });
        }
    
        // if record is found, return the record
        res.json(workday);
    } catch (error) { // catch any error with 500 status code (server error)
        console.error('Fehler beim Abrufen:', error);
        res.status(500).json({ message: 'Serverfehler', error: error.message });
    }
  });

  // adds a new record to the mongoDb collection 'workdays' and returns the added workday
  app.post('/workdays', async (req, res) => {
    const workday = req.body;

    try {
        const db = await getDb();
        const result = await db.collection('workdays').insertOne(workday);
        // check if the record is added successfully
        if (result.acknowledged) {
            res.status(201).json(workday);
        } else {
            res.status(500).json({ message: 'Fehler beim Hinzufügen des Workdays in MongoDB' });
        }

    } catch (error) {
        console.error('Fehler beim Hinzufügen:', error);
        res.status(500).json({ message: 'Serverfehler', error: error.message });
    }
});

// updates the record of a specific id in the mongoDb collection 'workdays'
app.put('/workdays/:userId', async (req, res) => {
    const { userId } = req.params;
    const { date, hoursWorked, homeOffice } = req.body;

    try {
        const db = await getDb();

        // update the workday record by userId and date
        const result = await db.collection('workdays').updateOne(
            { userId, date: { $regex: `^${date}` } }, // compare date with regex to match the date format
            { $set: { hoursWorked, homeOffice } }
        );

        // if no record is found, return 404
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Kein Workday gefunden' });
        }

        // if it works, return 200
        res.status(200).json({ message: 'Workday aktualisiert' });

    } catch (error) {
        console.error('Fehler beim Aktualisieren:', error);
        res.status(500).json({ message: 'Serverfehler', error: error.message });
    }
});

// deletes the record of a specific id in the mongoDb collection 'workdays'
app.delete('/workdays/:id', async (req, res) => {
    const { id } = req.params;

    // check if the id is valid, if not, return 400
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Ungültige ID' });
    }

    try {
        const db = await getDb();
        const result = await db.collection('workdays').deleteOne({ _id: ObjectId.createFromHexString(id) });

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

// gets all records from the mongoDb collection 'workdays' for a specific user by userId
app.get('/workdays/user/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const db = await getDb();

        // find all records for the user by userId 
        const workdays = await db.collection('workdays').find({ userId: userId }).toArray();

        res.json(workdays);

    } catch (error) {
        console.error('Fehler beim Abrufen:', error);
        res.status(500).json({ message: 'Serverfehler', error: error.message });
    }
});

// gets all records from the mongoDb collection 'workdays' for a specific user by userId and date
app.get('/workdays/user/:userId/:date', async (req, res) => {
    const userId = req.params.userId;
    const date = req.params.date;

    try {
        const db = await getDb();

        // find all records for the user by userId and date
        const workdays = await db.collection('workdays').find({ userId: userId, date: date }).toArray();

        res.json(workdays);

    } catch (error) {
        console.error('Fehler beim Abrufen:', error);
        res.status(500).json({ message: 'Serverfehler', error: error.message });
    }
});

// gets all records from the mongoDb collection 'projects'
app.get('/projects', async (req, res) => {
    try {
        const db = await getDb();
        const projects = await db.collection('projects').find().toArray();

        if(!projects || projects.length === 0) {
            return res.status(404).json({ message: 'Keine Einträge gefunden' });
        }

        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Serverfehler', error: error.message });
    }
});

// fetches a specific project from the mongoDb collection 'projects' by id
// returns the project if found, otherwise returns 404
app.get('/projects/:id', async (req, res) => {
    const { id } = req.params;

    // check if the id is valid, if not, return 400
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Ungültige ID' });
    }

    try {
        const db = await getDb();
        const project = await db.collection('projects').findOne({ _id: ObjectId.createFromHexString(id) });

        // if no record is found, return 404
        if (!project) {
            return res.status(404).json({ message: 'Kein Eintrag gefunden' });
        }

        res.json(project);

    } catch (error) {
        console.error('Fehler beim Abrufen:', error);
        res.status(500).json({ message: 'Serverfehler', error: error.message });
    }
});

// adds a new project to the mongoDb collection 'projects' and returns the added project
// returns 201 if the project is added successfully, otherwise returns 500
app.post('/projects', async (req, res) => {
    const project = req.body;

    try {
        const db = await getDb();
        const result = await db.collection('projects').insertOne(project);
        
        if (result.acknowledged) {
            return res.status(201).json(project);
        } else {
            return res.status(500).json({ message: 'Fehler beim Hinzufügen des Projekts in MongoDB' });
        }
    } catch (error) {
        console.error('Fehler beim Hinzufügen:', error);
        return res.status(500).json({ message: 'Serverfehler', error: error.message });
    }
});

// updates a project in the mongoDb collection 'projects' by id
// returns 200 if the project is updated successfully, otherwise returns 500
app.put('/projects/:id', async (req, res) => {
    const { id } = req.params;
    const project = req.body;

    try {
        const db = await getDb();
        const result = await db.collection('projects').updateOne({ _id: new ObjectId(id) }, { $set: project });
        
        if (result.modifiedCount === 1) {
            return res.status(200).json(project);
        } else {
            return res.status(500).json({ message: 'Fehler beim Aktualisieren des Projekts in MongoDB' });
        }
    } catch (error) {
        console.error('Fehler beim Aktualisieren:', error);
        return res.status(500).json({ message: 'Serverfehler', error: error.message });
    }
});

// deletes a project in the mongoDb collection 'projects' by id
// returns 200 if the project is deleted successfully, otherwise returns 500
app.delete('/projects/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const db = await getDb();
        const result = await db.collection('projects').deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 1) {
            return res.status(200).json({ message: 'Projekt erfolgreich gelöscht' });
        } else {
            return res.status(500).json({ message: 'Fehler beim Löschen des Projekts in MongoDB' });
        }
    } catch (error) {
        console.error('Fehler beim Löschen:', error);
        return res.status(500).json({ message: 'Serverfehler', error: error.message });
    }
});

// gets all records from the mongoDb collection 'projects' for a specific user by userId
// returns the projects if found, otherwise returns 404
app.get('/projects/user/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const db = await getDb();
        const projects = await db.collection('projects').find({ userId }).toArray();

        if (!projects || projects.length === 0) {
            return res.status(404).json({ message: 'Keine Projekte für diesen Benutzer gefunden' });
        }

        res.json(projects);
    } catch (error) {
        console.error('Fehler beim Abrufen der Projekte für Nutzer:', error);
        res.status(500).json({ message: 'Serverfehler', error: error.message });
    }
});

// gets the count of projects from the mongoDb collection 'projects' for a specific user by userId
// returns the count, otherwise returns 500
app.get('/projects/user/:userId/count', async (req, res) => {
    const { userId } = req.params;

    try {
        const db = await getDb();
        const count = await db.collection('projects').countDocuments({ userId });
        
        res.json(count);
    } catch (error) {
        console.error('Fehler beim Abrufen der Projekte für Nutzer:', error);
        res.status(500).json({ message: 'Serverfehler', error: error.message });
    }
});