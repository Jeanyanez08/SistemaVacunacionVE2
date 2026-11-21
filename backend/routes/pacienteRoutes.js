const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

router.get('/:cedula', pacienteController.consultarPorCedula);
router.post('/registrar', pacienteController.registrarPaciente);

module.exports = router;