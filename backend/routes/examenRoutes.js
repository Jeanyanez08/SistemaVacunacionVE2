const express = require('express');
const router = express.Router();
const examenController = require('../controllers/examenController');

router.get('/', examenController.listarExamenes);
router.post('/anexar', examenController.anexarExamen);
router.put('/dictamen/:id', examenController.procesarDictamenSubregion);
router.delete('/:id', examenController.eliminarExamen);

module.exports = router;