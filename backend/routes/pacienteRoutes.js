const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

router.get('/:cedula', pacienteController.obtenerPacientePorCedula);
router.post('/registrar', pacienteController.registrarPaciente);

module.exports = router;