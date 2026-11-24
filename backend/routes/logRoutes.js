const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

router.get('/', logController.listar);
router.get('/usuario/:id_usuario', logController.listarPorUsuario);
router.get('/tabla/:tabla', logController.listarPorTabla);
router.get('/accion/:accion', logController.listarPorAccion);
router.get('/:id', logController.obtenerPorId);
router.post('/registrar', logController.registrar);
router.delete('/:id', logController.eliminar);

module.exports = router;