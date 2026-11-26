const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const examenController = require('../controllers/examenController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const limpio = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${limpio}`);
  }
});

const upload = multer({ storage });

router.get('/', examenController.listarExamenes);
router.post('/anexar', upload.single('archivo'), examenController.anexarExamen);
router.put('/dictamen/:id', examenController.procesarDictamenSubregion);
router.delete('/:id', examenController.eliminarExamen);

module.exports = router;