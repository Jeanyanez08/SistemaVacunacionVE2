const VacunaModel = require('../models/vacunaModel');
const PacienteModel = require('../models/pacienteModel');

const vacunaController = {
  async registrarVacuna(req, res) {
    try {
      const { cedula, vacuna, lote, fecha_aplicacion, centro_salud } = req.body;

      if (!cedula || !vacuna || !lote) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Cédula, vacuna y número de lote son obligatorios'
        });
      }

      const paciente = await PacienteModel.buscarPorCedula(cedula.trim());
      if (!paciente) {
        return res.status(404).json({
          ok: false,
          mensaje: 'No existe un paciente con esa cédula para asignarle la dosis'
        });
      }

      const idRegistro = await VacunaModel.registrarDosis({
        paciente_id: paciente.id,
        vacuna,
        lote,
        fecha_aplicacion: fecha_aplicacion || new Date().toISOString().slice(0, 10),
        centro_salud: centro_salud || 'Hospital Dr. Israel Ranuárez Balza'
      });

      return res.status(201).json({
        ok: true,
        mensaje: 'Dosis de vacuna registrada con éxito',
        id: idRegistro
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al registrar la vacuna',
        error: error.message
      });
    }
  },

  async obtenerHistorialGeneral(req, res) {
    try {
      const registros = await VacunaModel.listarTodas();
      return res.status(200).json({ ok: true, data: registros });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al obtener historial de vacunas',
        error: error.message
      });
    }
  }
};

module.exports = vacunaController;