const CertSaludModel = require('../models/certSaludModel');
const LogModel = require('../models/logModel');

const CertSaludController = {
  async listar(req, res) {
    try {
      const certificados = await CertSaludModel.listarTodos();
      return res.status(200).json({ ok: true, data: certificados });
    } catch (error) {
      console.error('Error al listar certificados:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const certificado = await CertSaludModel.buscarPorId(id);
      if (!certificado) {
        return res.status(404).json({ ok: false, message: 'Certificado no encontrado' });
      }
      return res.status(200).json({ ok: true, data: certificado });
    } catch (error) {
      console.error('Error al buscar certificado:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async listarPorPersona(req, res) {
    try {
      const { id_personas } = req.params;
      const certificados = await CertSaludModel.listarPorPersona(id_personas);
      return res.status(200).json({ ok: true, data: certificados });
    } catch (error) {
      console.error('Error al listar certificados por persona:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async listarPorEstatus(req, res) {
    try {
      const { estatus } = req.params;
      const certificados = await CertSaludModel.listarPorEstatus(estatus);
      return res.status(200).json({ ok: true, data: certificados });
    } catch (error) {
      console.error('Error al listar certificados por estatus:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async crear(req, res) {
    try {
      const {
        id_personas,
        id_examenes,
        id_registro,
        estatus,
        observaciones,
        id_usuario
      } = req.body;

      if (!id_personas) {
        return res.status(400).json({
          ok: false,
          message: 'El campo id_personas es obligatorio'
        });
      }

      const idCert = await CertSaludModel.crear({
        id_personas,
        id_examenes: id_examenes || null,
        id_registro: id_registro || null,
        estatus: estatus || 'Pendiente',
        observaciones: observaciones || null
      });

      const usuarioLog = id_usuario || req.usuario?.id_usuario;
      if (usuarioLog) {
        await LogModel.registrar({
          id_usuario: usuarioLog,
          accion: 'INSERT',
          tabla_afectada: 'certsalud',
          descripcion_detalle: `Certificado ID ${idCert} creado para persona ID ${id_personas}`
        });
      }

      return res.status(201).json({
        ok: true,
        message: 'Certificado registrado correctamente',
        id_cert: idCert
      });
    } catch (error) {
      console.error('Error al crear certificado:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async actualizarEstatus(req, res) {
    try {
      const { id } = req.params;
      const { estatus, observaciones, id_usuario } = req.body;

      if (!estatus) {
        return res.status(400).json({ ok: false, message: 'El estatus es obligatorio' });
      }

      const actualizado = await CertSaludModel.actualizarEstatus(id, {
        estatus,
        observaciones: observaciones || null
      });

      if (actualizado === 0) {
        return res.status(404).json({ ok: false, message: 'Certificado no encontrado' });
      }

      const usuarioLog = id_usuario || req.usuario?.id_usuario;
      if (usuarioLog) {
        const accionLog = estatus.toUpperCase() === 'APROBADO' ? 'APROBAR' : 'UPDATE';
        await LogModel.registrar({
          id_usuario: usuarioLog,
          accion: accionLog,
          tabla_afectada: 'certsalud',
          descripcion_detalle: `Certificado ID ${id} cambió a estatus "${estatus}"`
        });
      }

      return res.status(200).json({ ok: true, message: 'Estatus actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar estatus de certificado:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const {
        id_personas,
        id_examenes,
        id_registro,
        estatus,
        observaciones,
        id_usuario
      } = req.body;

      const actualizado = await CertSaludModel.actualizar(id, {
        id_personas,
        id_examenes: id_examenes || null,
        id_registro: id_registro || null,
        estatus: estatus || 'Pendiente',
        observaciones: observaciones || null
      });

      if (actualizado === 0) {
        return res.status(404).json({ ok: false, message: 'Certificado no encontrado' });
      }

      const usuarioLog = id_usuario || req.usuario?.id_usuario;
      if (usuarioLog) {
        await LogModel.registrar({
          id_usuario: usuarioLog,
          accion: 'UPDATE',
          tabla_afectada: 'certsalud',
          descripcion_detalle: `Certificado ID ${id} actualizado`
        });
      }

      return res.status(200).json({ ok: true, message: 'Certificado actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar certificado:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      const eliminado = await CertSaludModel.eliminar(id);
      if (eliminado === 0) {
        return res.status(404).json({ ok: false, message: 'Certificado no encontrado' });
      }

      const usuarioLog = req.body?.id_usuario || req.usuario?.id_usuario;
      if (usuarioLog) {
        await LogModel.registrar({
          id_usuario: usuarioLog,
          accion: 'DELETE',
          tabla_afectada: 'certsalud',
          descripcion_detalle: `Certificado ID ${id} eliminado`
        });
      }

      return res.status(200).json({ ok: true, message: 'Certificado eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar certificado:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  }
};

module.exports = CertSaludController;