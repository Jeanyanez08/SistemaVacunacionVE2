const UbicacionModel = require('../models/ubicacionModel');

const UbicacionController = {
  // Estados
  async listarEstados(req, res) {
    try {
      const estados = await UbicacionModel.listarEstados();
      return res.status(200).json({ ok: true, data: estados });
    } catch (error) {
      console.error('Error al listar estados:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async crearEstado(req, res) {
    try {
      const { nombre } = req.body;
      if (!nombre) {
        return res.status(400).json({ ok: false, message: 'El nombre del estado es obligatorio' });
      }
      const idEstado = await UbicacionModel.crearEstado({ nombre });
      return res.status(201).json({ ok: true, id_estado: idEstado });
    } catch (error) {
      console.error('Error al crear estado:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  // Municipios
  async listarMunicipios(req, res) {
    try {
      const municipios = await UbicacionModel.listarMunicipios();
      return res.status(200).json({ ok: true, data: municipios });
    } catch (error) {
      console.error('Error al listar municipios:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async listarMunicipiosPorEstado(req, res) {
    try {
      const { id_estado } = req.params;
      const municipios = await UbicacionModel.listarMunicipiosPorEstado(id_estado);
      return res.status(200).json({ ok: true, data: municipios });
    } catch (error) {
      console.error('Error al listar municipios por estado:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async crearMunicipio(req, res) {
    try {
      const { nombre, id_estado } = req.body;
      if (!nombre || !id_estado) {
        return res.status(400).json({ ok: false, message: 'Nombre e id_estado son obligatorios' });
      }
      const idMunicipio = await UbicacionModel.crearMunicipio({ nombre, id_estado });
      return res.status(201).json({ ok: true, id_municipio: idMunicipio });
    } catch (error) {
      console.error('Error al crear municipio:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  // Parroquias
  async listarParroquias(req, res) {
    try {
      const parroquias = await UbicacionModel.listarParroquias();
      return res.status(200).json({ ok: true, data: parroquias });
    } catch (error) {
      console.error('Error al listar parroquias:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async listarParroquiasPorMunicipio(req, res) {
    try {
      const { id_municipio } = req.params;
      const parroquias = await UbicacionModel.listarParroquiasPorMunicipio(id_municipio);
      return res.status(200).json({ ok: true, data: parroquias });
    } catch (error) {
      console.error('Error al listar parroquias por municipio:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async crearParroquia(req, res) {
    try {
      const { nombre, id_municipio } = req.body;
      if (!nombre || !id_municipio) {
        return res.status(400).json({ ok: false, message: 'Nombre e id_municipio son obligatorios' });
      }
      const idParroquia = await UbicacionModel.crearParroquia({ nombre, id_municipio });
      return res.status(201).json({ ok: true, id_parroquia: idParroquia });
    } catch (error) {
      console.error('Error al crear parroquia:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  // Subregiones
  async listarSubregiones(req, res) {
    try {
      const subregiones = await UbicacionModel.listarSubregiones();
      return res.status(200).json({ ok: true, data: subregiones });
    } catch (error) {
      console.error('Error al listar subregiones:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async listarSubregionesPorMunicipio(req, res) {
    try {
      const { id_municipio } = req.params;
      const subregiones = await UbicacionModel.listarSubregionesPorMunicipio(id_municipio);
      return res.status(200).json({ ok: true, data: subregiones });
    } catch (error) {
      console.error('Error al listar subregiones por municipio:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async crearSubregion(req, res) {
    try {
      const { nombre_subregion, id_municipio } = req.body;
      if (!nombre_subregion || !id_municipio) {
        return res.status(400).json({
          ok: false,
          message: 'nombre_subregion e id_municipio son obligatorios'
        });
      }
      const idSubregion = await UbicacionModel.crearSubregion({ nombre_subregion, id_municipio });
      return res.status(201).json({ ok: true, id_subregion: idSubregion });
    } catch (error) {
      console.error('Error al crear subregión:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  }
};

module.exports = UbicacionController;