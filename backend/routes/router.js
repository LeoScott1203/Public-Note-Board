const express = require('express');
const router = express.Router();
const crypto = require('crypto')
const Note = require('../models/NoteSchema');

router.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find({});
        res.status(200).json(notes);
    } 
    catch (err) {
        res.status(500).json({ message: err.message });
        console.error("SERVER ERROR: ", err);
    }
});

const hashNonce = (nonce) => {
    return crypto.createHash('sha256').update(nonce).digest('hex');
}

router.post('/notes', async (req, res) => {
    try {
        const { noteTitle, noteContents, rawNonce } = req.body;

        if (!rawNonce) {
            return res.status(400).json({ error: 'Authentication nonce required' });
        }

        const newNote = new Note({ 
            noteTitle,
            noteContents,
            authHash: hashNonce(rawNonce)
        });

        const savedNote = await newNote.save();
        console.log("Note successfully created")
        res.status(201).json(savedNote);
    }
    catch (err) {
        res.status(500).json({message: err.message });
        console.error("SERVER ERROR: ", err);
    }
});

router.put('/notes/:id', async (req, res) => {
    try {
        const { noteTitle, noteContents, rawNonce } = req.body;
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ error: 'Note not found' });

        if (!rawNonce || hashNonce(rawNonce) !== note.authHash) {
            return res.status(403).json({ error: 'Unauthorized to edit'});
        }

        note.noteTitle = noteTitle || note.noteTitle;
        note.noteContents = noteContents || note.noteContents;

        const updatedNote = await note.save();
        console.log("Note successfully updated")
        res.json(updatedNote)
    } 
    catch (err) {
        res.status(500).json({ message: err.message });
        console.error("SERVER ERROR: ", err);
    }
});

router.delete('/notes/:id', async (req, res) => {
    try {
        const rawNonce = req.headers['x-auth-nonce'];
        const note = await Note.findById(req.params.id);

        if (!note) return res.status(404).json({ error: 'Note not found' });

        if (!rawNonce || hashNonce(rawNonce) !== note.authHash) {
            return res.status(403).json({ error: 'Unauthorized to delete'});
        }

        await Note.findByIdAndDelete(req.params.id);
        console.log("Note successfully deleted")
        res.json({ message: 'Note successfully deleted'})
    } 
    catch (err) {
        res.status(500).json({ message: err.message });
        console.error("SERVER ERROR: ", err);
    }
});

module.exports = router;