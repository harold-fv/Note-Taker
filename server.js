const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Route to notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
  });

// Route to get all notes
app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    res.json(notes);
  });

  // Route to add a new note
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    const lastNoteId = notes.length > 0 ? notes[notes.length - 1].id : 0;
    const id = lastNoteId + 1;
    const note = {
      id: id,
      title: newNote.title,
      text: newNote.text,
    };
    notes.push(note);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.json(note);
  });
  
  // Route to delete a note
app.delete('/api/notes/:id', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    const updatedNotes = notes.filter((note) => note.id !== parseInt(req.params.id));
    fs.writeFileSync('./db/db.json', JSON.stringify(updatedNotes));
    res.send('Note deleted');
  });

  // Route to index page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });
  
  app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
  });