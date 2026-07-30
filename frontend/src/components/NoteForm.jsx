import { useState } from "react";

export default function NoteForm({ refreshNotes }) {
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContents, setNoteContents] = useState('');
    const [error, setError] = useState('Create your own notes here!')
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    const getNonce = () => {
        let nonce = localStorage.getItem('user_auth_nonce');

        if (!nonce) {
            // create new nonce if not found
            const array = new Uint8Array(32);
            window.crypto.getRandomValues(array);
            nonce = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
            localStorage.setItem('user_auth_nonce', nonce);
        }

        return nonce;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!noteTitle || !noteContents) { 
            setError('Please fill in all fields');
            return; 
        }

        const rawNonce = getNonce();

        try {
            const res = await fetch(`${BACKEND_URL}/api/notes`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    noteTitle,
                    noteContents,
                    rawNonce
                })
            });

            if (!res.ok) {
                throw new Error('Failed to create note');
            }

            setNoteTitle('');
            setNoteContents('');
            
            setError('Your note was successfully uploaded!')
            refreshNotes();
        }
        catch (err) { setError(err.message); }
    }

    return (
        <div id='NoteForm'>
            {error && <div id='Error'>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Note title: </label>
                    <input type="text" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} placeholder="enter title" />
                </div>
                <div>
                    <label>Note contents: </label>
                    <input type="text" value={noteContents} onChange={(e) => setNoteContents(e.target.value)} placeholder="enter your note" />
                </div>
                <div>
                    <button type="submit">Create your note</button>
                </div>
            </form>
        </div>
    );
}

