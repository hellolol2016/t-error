import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import MongoDBService from './db/connection.js';
import LogService from './db/db.js';


const COLLECTION_NAME = "errorLogs";

const app = express();
const port = 3000;

const mongodbService = new MongoDBService();
await mongodbService.connect();
const logService = new LogService();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route to receive error data
app.post('/errors', async (req, res) => {
  try {
    const { uniqueId, errorData } = req.body;

    // Validate input
    if (!uniqueId || !errorData) {
      return res.status(400).json({ message: 'uniqueId and errorData are required.' });
    }

    logService.writeErrorLog({ uniqueId, errorData });

    console.log('Received and saved error data:', errorData);
    res.status(201).json({ message: 'Error data received and saved.', id: 0 });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate uniqueId error
      res.status(409).json({ message: 'uniqueId already exists.' });
    } else {
      console.error('Error saving data:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
});

// Route to retrieve error data by uniqueId
app.get('/errors/:uniqueId', async (req, res) => {
  try {
    const { uniqueId } = req.params;

    const errorLog = await logService.readErrorLogs({});

    if (!errorLog) {
      return res.status(404).json({ message: 'Error data not found.' });
    }

    res.status(200).json(errorLog);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Basic route to test server
app.get('/', (req, res) => {
  res.send('Enhanced Error Monitoring Server is running.');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
