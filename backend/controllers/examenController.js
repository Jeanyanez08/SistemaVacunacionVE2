const ExamenModel = require('../models/examenModel');
const PacienteModel = require('../models/pacienteModel');

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
      const { cedula, nombre_archivo, ruta_archivo, archivo_url, tipo_examen } = req.body;
      const rutaFinal = ruta_archivo || archivo_url || '';
      const nombreFinal = nombre_archivo || tipo_examen || 'examen';

      if (!cedula || !cedula.trim() || (!rutaFinal && !nombreFinal)) {
        return res.status(400).json({
          ok: false,
          mensaje: 'La cédula y los datos del archivo o examen son obligatorios'
        });
      }

      const paciente = await PacienteModel.buscarPorCedula(cedula.trim());
      if (!paciente) {
        return res.status(404).json({
          ok: false,
          mensaje: 'Paciente no encontrado para anexar el examen'
        });
      }

      const idPersonas = paciente.id_personas ?? paciente.id;
      const idExamen = await ExamenModel.crearExamen({
        id_personas: idPersonas,
        nombre_archivo: nombreFinal,
        ruta_archivo: rutaFinal
      });

      return res.status(201).json({
        ok: true,
        mensaje: 'Examen externo anexado y enviado a la Subregión',
        id: idExamen
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
      const { nombre_archivo, ruta_archivo, archivo_url } = req.body;
      const rutaFinal = ruta_archivo || archivo_url || '';

      if (!nombre_archivo && !rutaFinal) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Debe indicar nombre_archivo o ruta_archivo para actualizar'
        });
      }

      const actualizados = await ExamenModel.actualizarArchivo(id, {
        nombre_archivo: nombre_archivo || 'examen',
        ruta_archivo: rutaFinal
      });

      if (actualizados === 0) {
        return res.status(404).json({ ok: false, mensaje: 'Solicitud no encontrada' });
      }

      return res.status(200).json({
        ok: true,
        mensaje: 'Registro de examen actualizado correctamente'
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al procesar el dictamen de Subregión',
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
        mensaje: 'Error al eliminar examen',
        error: error.message
      });
    }
  }
};

module.exports = examenController;