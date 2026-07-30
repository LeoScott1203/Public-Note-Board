const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const eventRouter = require('./routes/router');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const mongoURL = 'mongodb+srv://lpeckera_db_user:gMKd9gb0g45DbDn0@cluster0.ukpxnby.mongodb.net/?appName=Cluster0&retryWrites=true&w=majority';

mongoose.connect(mongoURL)
    .then(() => { console.log('Connected to MongoDB') })
    .catch(err => { console.error('Error connecting to MongoDB:', err) });
    
app.use('/api', eventRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});