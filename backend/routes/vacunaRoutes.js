const express = require('express');
const router = express.Router();
const vacunaController = require('../controllers/vacunaController');

router.get('/', vacunaController.obtenerHistorialGeneral);
router.post('/registrar', vacunaController.registrarVacuna);

module.exports = router;