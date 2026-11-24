const express = require('express');
const router = express.Router();
const ubicacionController = require('../controllers/ubicacionController');

// Estados
router.get('/estados', ubicacionController.listarEstados);
router.post('/estados', ubicacionController.crearEstado);

// Municipios
router.get('/municipios', ubicacionController.listarMunicipios);
router.get('/municipios/estado/:id_estado', ubicacionController.listarMunicipiosPorEstado);
router.post('/municipios', ubicacionController.crearMunicipio);

// Parroquias
router.get('/parroquias', ubicacionController.listarParroquias);
router.get('/parroquias/municipio/:id_municipio', ubicacionController.listarParroquiasPorMunicipio);
router.post('/parroquias', ubicacionController.crearParroquia);

// Subregiones
router.get('/subregiones', ubicacionController.listarSubregiones);
router.get('/subregiones/municipio/:id_municipio', ubicacionController.listarSubregionesPorMunicipio);
router.post('/subregiones', ubicacionController.crearSubregion);

module.exports = router;