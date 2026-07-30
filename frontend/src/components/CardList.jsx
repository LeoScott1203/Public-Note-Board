import NoteCard from "./NoteCard";

export default function CardList({ notes, fetchNotes }) {
  if (!notes.length) return;

  return (
    <div id='CardList'>
      {notes.map(note => (<NoteCard key={note._id} note={note} fetchNotes={fetchNotes} />))}
    </div>
  );
}