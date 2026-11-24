const CentroModel = require('../models/centroModel');
const LogModel = require('../models/logModel');

const CentroController = {
  async listar(req, res) {
    try {
      const centros = await CentroModel.listarTodos();
      return res.status(200).json({ ok: true, data: centros });
    } catch (error) {
      console.error('Error al listar centros:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const centro = await CentroModel.buscarPorId(id);
      if (!centro) {
        return res.status(404).json({ ok: false, message: 'Centro no encontrado' });
      }
      return res.status(200).json({ ok: true, data: centro });
    } catch (error) {
      console.error('Error al buscar centro:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async listarPorParroquia(req, res) {
    try {
      const { id_parroquia } = req.params;
      const centros = await CentroModel.listarPorParroquia(id_parroquia);
      return res.status(200).json({ ok: true, data: centros });
    } catch (error) {
      console.error('Error al listar centros por parroquia:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async crear(req, res) {
    try {
      const { nombre, direccion, telf, id_parroquia, id_usuario } = req.body;
      if (!nombre || !direccion || !id_parroquia) {
        return res.status(400).json({
          ok: false,
          message: 'Nombre, dirección y parroquia son obligatorios'
        });
      }

      const idCentro = await CentroModel.crear({
        nombre,
        direccion,
        telf: telf || null,
        id_parroquia
      });

      const usuarioLog = id_usuario || req.usuario?.id_usuario;
      if (usuarioLog) {
        await LogModel.registrar({
          id_usuario: usuarioLog,
          accion: 'INSERT',
          tabla_afectada: 'centros',
          descripcion_detalle: `Centro "${nombre}" (ID ${idCentro}) creado`
        });
      }

      return res.status(201).json({
        ok: true,
        message: 'Centro registrado correctamente',
        id_centros: idCentro
      });
    } catch (error) {
      console.error('Error al crear centro:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { nombre, direccion, telf, id_parroquia, id_usuario } = req.body;

      const actualizado = await CentroModel.actualizar(id, {
        nombre,
        direccion,
        telf: telf || null,
        id_parroquia
      });

      if (actualizado === 0) {
        return res.status(404).json({ ok: false, message: 'Centro no encontrado' });
      }

      const usuarioLog = id_usuario || req.usuario?.id_usuario;
      if (usuarioLog) {
        await LogModel.registrar({
          id_usuario: usuarioLog,
          accion: 'UPDATE',
          tabla_afectada: 'centros',
          descripcion_detalle: `Centro ID ${id} actualizado`
        });
      }

      return res.status(200).json({ ok: true, message: 'Centro actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar centro:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      const eliminado = await CentroModel.eliminar(id);
      if (eliminado === 0) {
        return res.status(404).json({ ok: false, message: 'Centro no encontrado' });
      }

      const usuarioLog = req.body?.id_usuario || req.usuario?.id_usuario;
      if (usuarioLog) {
        await LogModel.registrar({
          id_usuario: usuarioLog,
          accion: 'DELETE',
          tabla_afectada: 'centros',
          descripcion_detalle: `Centro ID ${id} eliminado`
        });
      }

      return res.status(200).json({ ok: true, message: 'Centro eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar centro:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  }
};

module.exports = CentroController;