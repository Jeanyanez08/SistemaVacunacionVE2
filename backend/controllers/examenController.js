const ExamenModel = require('../models/examenModel');
const PacienteModel = require('../models/pacienteModel');
const CertSaludModel = require('../models/certSaludModel');
const LogModel = require('../models/logModel');

const examenController = {
  async listarExamenes(req, res) {
    try {
      const examenes = await ExamenModel.listarTodos();
      return res.status(200).json({ ok: true, data: examenes });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al listar exámenes',
        error: error.message
      });
    }
  },

  async anexarExamen(req, res) {
    try {
      const { cedula, nombre_archivo, ruta_archivo, tipo_examen, observaciones, id_usuario } = req.body;

      const nombreFinal = req.file
        ? req.file.originalname
        : (nombre_archivo || tipo_examen || 'examen_clinico.pdf');

      const rutaFinal = req.file
        ? `/uploads/${req.file.filename}`
        : (ruta_archivo || '');

      if (!cedula || !cedula.trim() || !rutaFinal) {
        return res.status(400).json({
          ok: false,
          mensaje: 'La cédula y el archivo o enlace del examen son obligatorios'
        });
      }

      const paciente = await PacienteModel.buscarPorCedula(cedula.trim());
      if (!paciente) {
        return res.status(404).json({
          ok: false,
          mensaje: 'Ciudadano no encontrado para anexar el examen'
        });
      }

      const idPersonas = paciente.id_personas;
      const idExamen = await ExamenModel.crearExamen({
        id_personas: idPersonas,
        nombre_archivo: nombreFinal,
        ruta_archivo: rutaFinal
      });

      const idCert = await CertSaludModel.crear({
        id_personas: idPersonas,
        id_examenes: idExamen,
        id_registro: null,
        estatus: 'Pendiente',
        observaciones: observaciones || 'Pendiente por revisión de Subregión'
      });

      if (id_usuario) {
        await LogModel.registrar({
          id_usuario: Number(id_usuario),
          accion: 'INSERT',
          tabla_afectada: 'examenes',
          descripcion_detalle: `Examen "${nombreFinal}" anexado a cédula ${cedula.trim()}`
        });
      }

      return res.status(201).json({
        ok: true,
        mensaje: 'Examen externo anexado y enviado a Subregión',
        id: idExamen,
        id_cert: idCert
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al anexar examen externo',
        error: error.message
      });
    }
  },

  async procesarDictamenSubregion(req, res) {
    try {
      const { id } = req.params;
      const { nombre_archivo, ruta_archivo } = req.body;

      const actualizados = await ExamenModel.actualizarArchivo(id, {
        nombre_archivo: nombre_archivo || 'examen',
        ruta_archivo: ruta_archivo || ''
      });

      if (actualizados === 0) {
        return res.status(404).json({ ok: false, mensaje: 'Examen no encontrado' });
      }

      return res.status(200).json({
        ok: true,
        mensaje: 'Registro de examen actualizado correctamente'
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al actualizar examen',
        error: error.message
      });
    }
  },

  async eliminarExamen(req, res) {
    try {
      const { id } = req.params;
      const eliminados = await ExamenModel.eliminar(id);

      if (eliminados === 0) {
        return res.status(404).json({ ok: false, mensaje: 'Examen no encontrado' });
      }

      return res.status(200).json({ ok: true, mensaje: 'Examen eliminado con éxito' });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al eliminar examen (puede tener certificado vinculado)',
        error: error.message
      });
    }
  }
};

module.exports = examenController;