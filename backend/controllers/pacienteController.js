const PacienteModel = require('../models/pacienteModel');

const pacienteController = {
  async listarPacientes(req, res) {
    try {
      const pacientes = await PacienteModel.listarTodos();
      return res.status(200).json({ ok: true, data: pacientes });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al listar pacientes',
        error: error.message
      });
    }
  },

  async consultarPorCedula(req, res) {
    try {
      const { cedula } = req.params;
      if (!cedula || !cedula.trim()) {
        return res.status(400).json({ ok: false, mensaje: 'La cédula es obligatoria' });
      }

      const paciente = await PacienteModel.buscarPorCedula(cedula.trim());
      if (!paciente) {
        return res.status(404).json({ ok: false, mensaje: 'Ciudadano no encontrado en el registro' });
      }

      const personaId = paciente.id_personas ?? paciente.id;
      const vacunas = await PacienteModel.obtenerVacunasPorPacienteId(personaId);

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

      if (!cedula?.trim() || !nombres?.trim() || !apellidos?.trim()) {
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
  },

  async actualizarPaciente(req, res) {
    try {
      const { id } = req.params;
      const { cedula, nombres, apellidos, fecha_nacimiento, correo, telefono, ubicacion } = req.body;

      if (!cedula?.trim() || !nombres?.trim() || !apellidos?.trim()) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Cédula, nombres y apellidos son requeridos'
        });
      }

      const actualizados = await PacienteModel.actualizar(id, {
        cedula: cedula.trim(),
        nombres: nombres.trim(),
        apellidos: apellidos.trim(),
        fecha_nacimiento,
        correo,
        telefono,
        ubicacion
      });

      if (actualizados === 0) {
        return res.status(404).json({ ok: false, mensaje: 'Paciente no encontrado' });
      }

      return res.status(200).json({ ok: true, mensaje: 'Paciente actualizado con éxito' });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al actualizar paciente',
        error: error.message
      });
    }
  },

  async eliminarPaciente(req, res) {
    try {
      const { id } = req.params;
      const eliminados = await PacienteModel.eliminar(id);

      if (eliminados === 0) {
        return res.status(404).json({ ok: false, mensaje: 'Paciente no encontrado' });
      }

      return res.status(200).json({ ok: true, mensaje: 'Paciente eliminado con éxito' });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al eliminar paciente',
        error: error.message
      });
    }
  }
};

module.exports = pacienteController;