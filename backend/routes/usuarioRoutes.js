const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/', usuarioController.listar);
router.get('/roles', usuarioController.listarRoles);
router.get('/:id', usuarioController.obtenerPorId);
router.post('/login', usuarioController.login);
router.post('/registrar', usuarioController.crear);
router.put('/:id', usuarioController.actualizar);
router.patch('/:id/clave', usuarioController.cambiarClave);
router.delete('/:id', usuarioController.eliminar);

module.exports = router;