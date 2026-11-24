const express = require('express');
const router = express.Router();
const certSaludController = require('../controllers/certSaludController');

router.get('/', certSaludController.listar);
router.get('/persona/:id_personas', certSaludController.listarPorPersona);
router.get('/estatus/:estatus', certSaludController.listarPorEstatus);
router.get('/:id', certSaludController.obtenerPorId);
router.post('/registrar', certSaludController.crear);
router.patch('/:id/estatus', certSaludController.actualizarEstatus);
router.put('/:id', certSaludController.actualizar);
router.delete('/:id', certSaludController.eliminar);

module.exports = router;