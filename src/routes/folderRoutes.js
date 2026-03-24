const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/noteController');

router.get('/',       ctrl.getAllFolders);
router.post('/',      ctrl.createFolder);
router.put('/:id',    ctrl.renameFolder);
router.delete('/:id', ctrl.deleteFolder);

module.exports = router;
