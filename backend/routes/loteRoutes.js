const express = require('express');
const router = express.Router();
const loteController = require('../controllers/loteController');

router.get('/', loteController.listar);
router.get('/numero/:numero_lote', loteController.buscarPorNumero);
router.get('/:id', loteController.obtenerPorId);
router.post('/registrar', loteController.crear);
router.put('/:id', loteController.actualizar);
router.patch('/:id/descontar', loteController.descontar);
router.delete('/:id', loteController.eliminar);

module.exports = router;