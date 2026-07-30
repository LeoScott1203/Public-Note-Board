import { useState, useEffect } from 'react';

export default function NoteCard({ note, fetchNotes }) {
    const [canEdit, setCanEdit] = useState(false)
    const [isEditing, setIsEditing] = useState(false);
    const [noteTitle, setNoteTitle] = useState(note.noteTitle);
    const [noteContents, setNoteContents] = useState(note.noteContents);
    const [error, setError] = useState('');

    const hashNonce = async (nonce) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(nonce);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    useEffect(() => {
        // Check if user has auth for this note
        async function checkNonce() {
            const rawNonce = localStorage.getItem('user_auth_nonce');
            if (!rawNonce) return;

            const hashedNonce = await hashNonce(rawNonce);

            if (hashedNonce === note.authHash) {
                setCanEdit(true);
            }
        }

        checkNonce();
    }, [note.authHash]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');

        const rawNonce = localStorage.getItem('user_auth_nonce');

        try {
            const res = await fetch(`${process.env.BACKEND_URL}/api/notes/${note._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    noteTitle,
                    noteContents,
                    rawNonce
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update note');
            }

            setIsEditing(false);
            fetchNotes();
        }
        catch (err) {
            setError(err.message);
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;

        const rawNonce = localStorage.getItem('user_auth_nonce');

        try {
            const res = await fetch(`${process.env.BACKEND_URL}/api/notes/${note._id}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-nonce': rawNonce
                }
            })

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete note');
            }

            fetchNotes();
        }
        catch (err) {
            setError(err.message)
        }
    }

    return (
        <div id='NoteCard'>
            {error && <div>{error}</div>}

            {isEditing ? (
                <form onSubmit={handleUpdate}>
                    <div>
                        <label>Note title: </label>
                        <input type="text" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} />
                    </div>
                    <div>
                        <label>Note contents: </label>
                        <input type="text" value={noteContents} onChange={(e) => setNoteContents(e.target.value)} />
                    </div>
                    <div>
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </form>
            ) : (
                <>
                    <h3>{note.noteTitle}</h3>
                    <p>{note.noteContents}</p>

                    {canEdit &&
                        (<div>
                            <button onClick={() => setIsEditing(true)}>Edit</button>
                            <button onClick={handleDelete}>Delete</button>
                        </div>)}
                </>  
            )}
        </div>
    )
}