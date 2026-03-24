const express      = require('express');
const cors         = require('cors');
const path         = require('path');
const noteRoutes   = require('./routes/noteRoutes');
const folderRoutes = require('./routes/folderRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/notes',   noteRoutes);
app.use('/api/folders', folderRoutes);

// Fallback to SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(errorHandler);

module.exports = app;
