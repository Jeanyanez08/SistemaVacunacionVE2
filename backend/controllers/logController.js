const LogModel = require('../models/logModel');

const LogController = {
  async listar(req, res) {
    try {
      const limite = req.query.limite || 100;
      const logs = await LogModel.listarTodos(limite);
      return res.status(200).json({ ok: true, data: logs });
    } catch (error) {
      console.error('Error al listar logs:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const log = await LogModel.buscarPorId(id);
      if (!log) {
        return res.status(404).json({ ok: false, message: 'Registro de log no encontrado' });
      }
      return res.status(200).json({ ok: true, data: log });
    } catch (error) {
      console.error('Error al buscar log:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async listarPorUsuario(req, res) {
    try {
      const { id_usuario } = req.params;
      const logs = await LogModel.listarPorUsuario(id_usuario);
      return res.status(200).json({ ok: true, data: logs });
    } catch (error) {
      console.error('Error al listar logs por usuario:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async listarPorTabla(req, res) {
    try {
      const { tabla } = req.params;
      const logs = await LogModel.listarPorTabla(tabla);
      return res.status(200).json({ ok: true, data: logs });
    } catch (error) {
      console.error('Error al listar logs por tabla:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async listarPorAccion(req, res) {
    try {
      const { accion } = req.params;
      const logs = await LogModel.listarPorAccion(accion);
      return res.status(200).json({ ok: true, data: logs });
    } catch (error) {
      console.error('Error al listar logs por acción:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async registrar(req, res) {
    try {
      const { id_usuario, accion, tabla_afectada, descripcion_detalle } = req.body;
      if (!id_usuario || !accion || !tabla_afectada) {
        return res.status(400).json({
          ok: false,
          message: 'id_usuario, accion y tabla_afectada son obligatorios'
        });
      }

      const idLog = await LogModel.registrar({
        id_usuario,
        accion,
        tabla_afectada,
        descripcion_detalle: descripcion_detalle || null
      });

      return res.status(201).json({
        ok: true,
        message: 'Log registrado correctamente',
        id_log: idLog
      });
    } catch (error) {
      console.error('Error al registrar log:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      const eliminado = await LogModel.eliminar(id);
      if (eliminado === 0) {
        return res.status(404).json({ ok: false, message: 'Registro de log no encontrado' });
      }
      return res.status(200).json({ ok: true, message: 'Log eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar log:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  }
};

module.exports = LogController;