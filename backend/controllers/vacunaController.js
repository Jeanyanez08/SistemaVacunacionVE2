const VacunaModel = require('../models/vacunaModel');
const PacienteModel = require('../models/pacienteModel');

const vacunaController = {
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
  },

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

  async actualizarVacuna(req, res) {
    try {
      const { id } = req.params;
      const { vacuna, lote, fecha_aplicacion, centro_salud } = req.body;

      if (!vacuna || !lote) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Vacuna y lote son obligatorios'
        });
      }

      const actualizados = await VacunaModel.actualizar(id, {
        vacuna,
        lote,
        fecha_aplicacion,
        centro_salud
      });

      if (actualizados === 0) {
        return res.status(404).json({ ok: false, mensaje: 'Registro de vacuna no encontrado' });
      }

      return res.status(200).json({ ok: true, mensaje: 'Vacuna actualizada con éxito' });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al actualizar vacuna',
        error: error.message
      });
    }
  },

  async eliminarVacuna(req, res) {
    try {
      const { id } = req.params;
      const eliminados = await VacunaModel.eliminar(id);

      if (eliminados === 0) {
        return res.status(404).json({ ok: false, mensaje: 'Registro de vacuna no encontrado' });
      }

      return res.status(200).json({ ok: true, mensaje: 'Registro de vacuna eliminado con éxito' });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al eliminar vacuna',
        error: error.message
      });
    }
  }
};

module.exports = vacunaController;