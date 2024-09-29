const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;

async function connectToDatabase() {
  const client = new MongoClient(uri);
  await client.connect();
  return client.db('contacts'); 
}

router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const contacts = await db.collection('contacts').find().toArray();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const contact = await db.collection('contacts').findOne({ _id: new ObjectId(req.params.id) });

    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
