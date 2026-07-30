const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const eventRouter = require('./routes/router');

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const mongoURL = process.env.mongoURL

mongoose.connect(mongoURL)
    .then(() => { console.log('Connected to MongoDB') })
    .catch(err => { console.error('Error connecting to MongoDB:', err) });
    
app.use('/api', eventRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});