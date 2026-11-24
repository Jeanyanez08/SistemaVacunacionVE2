const express = require('express');
const router = express.Router();
const centroController = require('../controllers/centroController');

router.get('/', centroController.listar);
router.get('/parroquia/:id_parroquia', centroController.listarPorParroquia);
router.get('/:id', centroController.obtenerPorId);
router.post('/registrar', centroController.crear);
router.put('/:id', centroController.actualizar);
router.delete('/:id', centroController.eliminar);

module.exports = router;