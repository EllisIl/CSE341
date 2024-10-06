// server.js
require('dotenv').config();

const express = require('express');
const app = express();
const port = 8080;
const { MongoClient, ObjectId } = require('mongodb');

// Middleware to parse JSON request bodies
app.use(express.json());

async function startup() {
    const client = new MongoClient(process.env.MONGO);

    try {
        // Connect to the MongoDB cluster
        await client.connect();
        await listDatabases(client);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}

// Function to retrieve data from the 'contacts' collection
async function getContactsFromDB() {
    const client = new MongoClient(process.env.MONGO);

    try {
        await client.connect();
        const database = client.db('CSE341');
        const collection = database.collection('contacts');

        const contacts = await collection.find({}).toArray();
        return contacts;

    } catch (e) {
        console.error("Error retrieving contacts:", e);
        return [];
    } finally {
        await client.close();
    }
}

// POST route to create a new contact
app.post('/api/contacts', async (req, res) => {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    const client = new MongoClient(process.env.MONGO);

    try {
        await client.connect();
        const database = client.db('CSE341');
        const collection = database.collection('contacts');

        const newContact = {
            firstName,
            lastName,
            email,
            favoriteColor,
            birthday
        };

        const result = await collection.insertOne(newContact);
        res.status(201).json({ id: result.insertedId });
    } catch (err) {
        console.error("Error creating contact:", err);
        res.status(500).json({ message: 'Error creating contact' });
    } finally {
        await client.close();
    }
});

// PUT route to update a contact
app.put('/api/contacts/:id', async (req, res) => {
    const { id } = req.params; // Get the contact ID from the URL
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    const client = new MongoClient(process.env.MONGO);

    try {
        await client.connect();
        const collection = client.db('CSE341').collection('contacts'); 

        // Update the contact in the database
        const result = await collection.updateOne(
            { _id: new ObjectId(id) }, // Use ObjectId for querying
            { $set: { firstName, lastName, email, favoriteColor, birthday } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.sendStatus(204); // No content to return, just status
    } catch (err) {
        console.error("Error updating contact:", err);
        res.status(500).json({ message: 'Error updating contact' });
    } finally {
        await client.close();
    }
});

// DELETE route to delete a contact
app.delete('/api/contacts/:id', async (req, res) => {
    const { id } = req.params;

    const client = new MongoClient(process.env.MONGO);

    try {
        await client.connect();
        const collection = client.db('CSE341').collection('contacts');

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.sendStatus(200); // Successfully deleted
    } catch (err) {
        console.error("Error deleting contact:", err);
        res.status(500).json({ message: 'Error deleting contact' });
    } finally {
        await client.close();
    }
});

// GET route to retrieve all contacts
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await getContactsFromDB();
        res.json(contacts); // Send the contact data as JSON
    } catch (err) {
        res.status(500).json({ message: 'Error fetching contacts from MongoDB', error: err });
    }
});

// Start the server
app.listen(port, async () => {
    await startup();
    console.log(`Server is running on http://localhost:${port}`);
});
