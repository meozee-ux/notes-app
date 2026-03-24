const db = require('../config/database');

/* ════════════════════════════════
   FOLDER MODEL
════════════════════════════════ */
const Folder = {
  getAll(callback) {
    db.all(
      `SELECT f.*, COUNT(n.id) as note_count
       FROM folders f
       LEFT JOIN notes n ON n.folder_id = f.id
       GROUP BY f.id
       ORDER BY f.id ASC`,
      [],
      callback
    );
  },

  getById(id, callback) {
    db.get(`SELECT * FROM folders WHERE id = ?`, [id], callback);
  },

  create(name, callback) {
    db.run(
      `INSERT INTO folders (name) VALUES (?)`,
      [name.trim()],
      function (err) {
        if (err) return callback(err);
        Folder.getById(this.lastID, callback);
      }
    );
  },

  delete(id, callback) {
    if (parseInt(id) === 1) {
      return callback(new Error('Cannot delete the Uncategorized folder.'));
    }
    // Move notes to Uncategorized before deleting folder
    db.run(`UPDATE notes SET folder_id = 1 WHERE folder_id = ?`, [id], (err) => {
      if (err) return callback(err);
      db.run(`DELETE FROM folders WHERE id = ?`, [id], callback);
    });
  },

  rename(id, name, callback) {
    if (parseInt(id) === 1) {
      return callback(new Error('Cannot rename the Uncategorized folder.'));
    }
    db.run(
      `UPDATE folders SET name = ? WHERE id = ?`,
      [name.trim(), id],
      function (err) {
        if (err) return callback(err);
        Folder.getById(id, callback);
      }
    );
  },
};

/* ════════════════════════════════
   NOTE MODEL
════════════════════════════════ */
const Note = {
  getAll({ folderId } = {}, callback) {
    if (typeof folderId === 'function') { callback = folderId; folderId = null; }
    const sql = folderId
      ? `SELECT * FROM notes WHERE folder_id = ? ORDER BY pinned DESC, updated_at DESC`
      : `SELECT * FROM notes ORDER BY pinned DESC, updated_at DESC`;
    const params = folderId ? [folderId] : [];
    db.all(sql, params, callback);
  },

  getById(id, callback) {
    db.get(`SELECT * FROM notes WHERE id = ?`, [id], callback);
  },

  create({ title, content, color, folder_id }, callback) {
    db.run(
      `INSERT INTO notes (title, content, color, folder_id)
       VALUES (?, ?, ?, ?)`,
      [title || 'Untitled', content || '', color || '#ffffff', folder_id || 1],
      function (err) {
        if (err) return callback(err);
        Note.getById(this.lastID, callback);
      }
    );
  },

  update(id, { title, content, color, pinned, folder_id }, callback) {
    db.run(
      `UPDATE notes
       SET title      = COALESCE(?, title),
           content    = COALESCE(?, content),
           color      = COALESCE(?, color),
           pinned     = COALESCE(?, pinned),
           folder_id  = COALESCE(?, folder_id),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, content, color, pinned, folder_id, id],
      function (err) {
        if (err) return callback(err);
        Note.getById(id, callback);
      }
    );
  },

  delete(id, callback) {
    db.run(`DELETE FROM notes WHERE id = ?`, [id], callback);
  },
};

module.exports = { Note, Folder };
