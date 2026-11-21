const express = require('express');
const router = express.Router();
const examenController = require('../controllers/examenController');

router.post('/anexar', examenController.anexarExamen);
router.put('/dictamen/:id', examenController.procesarDictamenSubregion);

module.exports = router;