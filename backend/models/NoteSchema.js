const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    noteTitle: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 20,
        trim: true
    },
    noteContents: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 1000
    },
    authHash: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Note', noteSchema, 'notes');