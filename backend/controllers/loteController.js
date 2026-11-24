const LoteModel = require('../models/loteModel');
const LogModel = require('../models/logModel');

const LoteController = {
  async listar(req, res) {
    try {
      const lotes = await LoteModel.listarTodos();
      return res.status(200).json({ ok: true, data: lotes });
    } catch (error) {
      console.error('Error al listar lotes:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const lote = await LoteModel.buscarPorId(id);
      if (!lote) {
        return res.status(404).json({ ok: false, message: 'Lote no encontrado' });
      }
      return res.status(200).json({ ok: true, data: lote });
    } catch (error) {
      console.error('Error al buscar lote por ID:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async buscarPorNumero(req, res) {
    try {
      const { numero_lote } = req.params;
      const lote = await LoteModel.buscarPorNumeroLote(numero_lote);
      if (!lote) {
        return res.status(404).json({ ok: false, message: 'Número de lote no encontrado' });
      }
      return res.status(200).json({ ok: true, data: lote });
    } catch (error) {
      console.error('Error al buscar por número de lote:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async crear(req, res) {
    try {
      const {
        id_vacunas,
        numero_lote,
        fecha_vencimiento,
        cantidad_recibida,
        cantidad_disponible,
        id_centros,
        id_usuario
      } = req.body;

      if (!id_vacunas || !numero_lote || !fecha_vencimiento || !cantidad_recibida || !id_centros) {
        return res.status(400).json({
          ok: false,
          message: 'Faltan campos obligatorios para registrar el lote'
        });
      }

      const idLote = await LoteModel.crear({
        id_vacunas,
        numero_lote,
        fecha_vencimiento,
        cantidad_recibida,
        cantidad_disponible,
        id_centros
      });

      const usuarioLog = id_usuario || req.usuario?.id_usuario;
      if (usuarioLog) {
        await LogModel.registrar({
          id_usuario: usuarioLog,
          accion: 'INSERT',
          tabla_afectada: 'lote_vacuna',
          descripcion_detalle: `Lote ${numero_lote} (ID ${idLote}) registrado`
        });
      }

      return res.status(201).json({
        ok: true,
        message: 'Lote registrado correctamente',
        id_lote: idLote
      });
    } catch (error) {
      console.error('Error al crear lote:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const {
        id_vacunas,
        numero_lote,
        fecha_vencimiento,
        cantidad_recibida,
        cantidad_disponible,
        id_centros,
        id_usuario
      } = req.body;

      const actualizado = await LoteModel.actualizar(id, {
        id_vacunas,
        numero_lote,
        fecha_vencimiento,
        cantidad_recibida,
        cantidad_disponible,
        id_centros
      });

      if (actualizado === 0) {
        return res.status(404).json({ ok: false, message: 'Lote no encontrado' });
      }

      const usuarioLog = id_usuario || req.usuario?.id_usuario;
      if (usuarioLog) {
        await LogModel.registrar({
          id_usuario: usuarioLog,
          accion: 'UPDATE',
          tabla_afectada: 'lote_vacuna',
          descripcion_detalle: `Lote ID ${id} actualizado`
        });
      }

      return res.status(200).json({ ok: true, message: 'Lote actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar lote:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async descontar(req, res) {
    try {
      const { id } = req.params;
      const cantidad = Number(req.body.cantidad) || 1;

      const descontado = await LoteModel.descontarDisponibles(id, cantidad);
      if (descontado === 0) {
        return res.status(400).json({
          ok: false,
          message: 'No hay suficientes dosis disponibles o el lote no existe'
        });
      }

      return res.status(200).json({
        ok: true,
        message: 'Disponibilidad del lote actualizada'
      });
    } catch (error) {
      console.error('Error al descontar dosis del lote:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      const eliminado = await LoteModel.eliminar(id);
      if (eliminado === 0) {
        return res.status(404).json({ ok: false, message: 'Lote no encontrado' });
      }

      const usuarioLog = req.body?.id_usuario || req.usuario?.id_usuario;
      if (usuarioLog) {
        await LogModel.registrar({
          id_usuario: usuarioLog,
          accion: 'DELETE',
          tabla_afectada: 'lote_vacuna',
          descripcion_detalle: `Lote ID ${id} eliminado`
        });
      }

      return res.status(200).json({ ok: true, message: 'Lote eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar lote:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  }
};

module.exports = LoteController;