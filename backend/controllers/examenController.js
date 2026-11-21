const ExamenModel = require('../models/examenModel');
const PacienteModel = require('../models/pacienteModel');

const examenController = {
  async anexarExamen(req, res) {
    try {
      const { cedula, tipo_examen, archivo_url, observacion } = req.body;

      if (!cedula || !tipo_examen) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Cédula y tipo de examen son obligatorios'
        });
      }

      const paciente = await PacienteModel.buscarPorCedula(cedula.trim());
      if (!paciente) {
        return res.status(404).json({
          ok: false,
          mensaje: 'Paciente no encontrado para anexar el examen'
        });
      }

      const idExamen = await ExamenModel.crearExamen({
        paciente_id: paciente.id,
        tipo_examen,
        archivo_url,
        observacion
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
      const { estado_promesa, dictamen_subregion } = req.body;

      if (!['aprobado', 'rechazado', 'pendiente'].includes(estado_promesa)) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Estado de promesa no válido'
        });
      }

      const actualizados = await ExamenModel.actualizarDictamen(id, {
        estado_promesa,
        dictamen_subregion: dictamen_subregion || ''
      });

      if (actualizados === 0) {
        return res.status(404).json({ ok: false, mensaje: 'Solicitud no encontrada' });
      }

      return res.status(200).json({
        ok: true,
        mensaje: `Dictamen actualizado a: ${estado_promesa}`
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al procesar el dictamen de Subregión',
        error: error.message
      });
    }
  }
};

module.exports = examenController;