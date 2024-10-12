const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/errorDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema and model
const errorSchema = new mongoose.Schema({
  uniqueId: { type: String, required: true, unique: true },
  errorData: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now },
});

const ErrorLog = mongoose.model('ErrorLog', errorSchema);

// Route to receive error data
app.post('/errors', async (req, res) => {
  try {
    const { uniqueId, errorData } = req.body;

    // Validate input
    if (!uniqueId || !errorData) {
      return res.status(400).json({ message: 'uniqueId and errorData are required.' });
    }

    // Create a new error log entry
    const errorLog = new ErrorLog({ uniqueId, errorData });
    await errorLog.save();

    console.log('Received and saved error data:', errorData);
    res.status(201).json({ message: 'Error data received and saved.', id: errorLog._id });
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

    const errorLog = await ErrorLog.findOne({ uniqueId });

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
