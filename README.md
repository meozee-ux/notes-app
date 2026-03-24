# 📓 Notes App

A lightweight, fullstack Notes application for your Ubuntu desktop.  
Built with **Node.js + Express + SQLite** — runs entirely offline, no cloud needed.

---

## Features

- ✏️  Create, edit, delete notes with auto-save
- 📌  Pin important notes to the top
- 🎨  Color-code notes (10 pastel colors)
- 🔍  Live search across all notes
- 💾  Persistent local storage via SQLite
- 🖥️  Launches as a standalone desktop app (no browser chrome)

---

## Quick Start

```bash
chmod +x install.sh
./install.sh
```

Then find **Notes** in your Ubuntu App Menu and launch it.

---

## Manual Usage

```bash
npm start          # start the server on http://localhost:3000
npm run dev        # start with nodemon (auto-reload)
```

---

## Project Structure

```
notes-app/
├── data/                   # SQLite database (auto-created)
├── src/
│   ├── public/
│   │   └── index.html      # Frontend UI
│   ├── config/
│   │   └── database.js     # SQLite connection
│   ├── models/
│   │   └── Note.js         # Data access layer
│   ├── controllers/
│   │   └── noteController.js
│   ├── routes/
│   │   └── noteRoutes.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── app.js
│   └── index.js
├── install.sh
├── package.json
└── README.md
```

---

## API Reference

| Method | Endpoint         | Description       |
|--------|-----------------|-------------------|
| GET    | /api/notes      | Get all notes     |
| GET    | /api/notes/:id  | Get single note   |
| POST   | /api/notes      | Create note       |
| PUT    | /api/notes/:id  | Update note       |
| DELETE | /api/notes/:id  | Delete note       |

---

## Systemd Service

The install script creates a systemd user service (`notes-app.service`) that:
- Starts the backend automatically on login
- Restarts on failure

```bash
systemctl --user status notes-app     # check status
systemctl --user restart notes-app    # restart
systemctl --user stop notes-app       # stop
journalctl --user -u notes-app -f     # live logs
```
