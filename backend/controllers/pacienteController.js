const PacienteModel = require('../models/pacienteModel');

const pacienteController = {
  async consultarPorCedula(req, res) {
    try {
      const { cedula } = req.params;
      if (!cedula) {
        return res.status(400).json({ ok: false, mensaje: 'La cédula es obligatoria' });
      }

      const paciente = await PacienteModel.buscarPorCedula(cedula.trim());
      if (!paciente) {
        return res.status(404).json({ ok: false, mensaje: 'Ciudadano no encontrado en el registro' });
      }

      const vacunas = await PacienteModel.obtenerVacunasPorPacienteId(paciente.id);

      return res.status(200).json({
        ok: true,
        paciente,
        vacunas
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error interno al consultar paciente',
        error: error.message
      });
    }
  },

  async registrarPaciente(req, res) {
    try {
      const { cedula, nombres, apellidos, fecha_nacimiento, correo, telefono, ubicacion } = req.body;

      if (!cedula || !nombres || !apellidos) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Cédula, nombres y apellidos son requeridos'
        });
      }

      const existente = await PacienteModel.buscarPorCedula(cedula.trim());
      if (existente) {
        return res.status(409).json({
          ok: false,
          mensaje: 'Ya existe un ciudadano registrado con esa cédula'
        });
      }

      const nuevoId = await PacienteModel.crear({
        cedula: cedula.trim(),
        nombres: nombres.trim(),
        apellidos: apellidos.trim(),
        fecha_nacimiento,
        correo,
        telefono,
        ubicacion
      });

      return res.status(201).json({
        ok: true,
        mensaje: 'Ciudadano registrado con éxito',
        id: nuevoId
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al registrar ciudadano',
        error: error.message
      });
    }
  }
};

module.exports = pacienteController;