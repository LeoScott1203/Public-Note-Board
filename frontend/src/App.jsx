import { useState, useEffect } from "react";
import CardList from './components/CardList';
import NoteForm from './components/NoteForm';

function App() {
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notes');
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="App" id='App'>
      <h1>Public Notes</h1>
      <hr />
      <NoteForm refreshNotes={fetchNotes} />
      <hr />
      <CardList fetchNotes={fetchNotes} notes={notes} />
    </div>
  );
}

export default App;