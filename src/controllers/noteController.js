const { Note, Folder } = require('../models/Note');

/* ════════════════════════════════
   NOTES
════════════════════════════════ */
exports.getAllNotes = (req, res) => {
  const folderId = req.query.folder_id || null;
  Note.getAll({ folderId }, (err, notes) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(notes);
  });
};

exports.getNoteById = (req, res) => {
  Note.getById(req.params.id, (err, note) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  });
};

exports.createNote = (req, res) => {
  Note.create(req.body, (err, note) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(note);
  });
};

exports.updateNote = (req, res) => {
  Note.update(req.params.id, req.body, (err, note) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  });
};

exports.deleteNote = (req, res) => {
  Note.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).send();
  });
};

/* ════════════════════════════════
   FOLDERS
════════════════════════════════ */
exports.getAllFolders = (req, res) => {
  Folder.getAll((err, folders) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(folders);
  });
};

exports.createFolder = (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Folder name is required.' });
  }
  Folder.create(name, (err, folder) => {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(409).json({ error: 'A folder with that name already exists.' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(folder);
  });
};

exports.renameFolder = (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Folder name is required.' });
  }
  Folder.rename(req.params.id, name, (err, folder) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(folder);
  });
};

exports.deleteFolder = (req, res) => {
  Folder.delete(req.params.id, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    res.status(204).send();
  });
};
