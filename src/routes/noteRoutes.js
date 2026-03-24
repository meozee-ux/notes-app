const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/noteController');

/* ── Notes ── */
router.get('/',       ctrl.getAllNotes);
router.get('/:id',    ctrl.getNoteById);
router.post('/',      ctrl.createNote);
router.put('/:id',    ctrl.updateNote);
router.delete('/:id', ctrl.deleteNote);

module.exports = router;
