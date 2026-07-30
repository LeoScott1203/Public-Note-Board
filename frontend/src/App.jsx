import { useState, useEffect } from "react";
import CardList from './components/CardList';
import NoteForm from './components/NoteForm';

function App() {
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/notes`);
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error('Error fetching notes:', err.message);
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