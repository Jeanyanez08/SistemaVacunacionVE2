const db = require('../config/db');

const PacienteModel = {
  async buscarPorCedula(cedula) {
    const [rows] = await db.query(
      'SELECT * FROM pacientes WHERE cedula = ? LIMIT 1',
      [cedula]
    );
    return rows[0] || null;
  },

  async obtenerVacunasPorPacienteId(pacienteId) {
    const [rows] = await db.query(
      'SELECT * FROM vacunas_aplicadas WHERE paciente_id = ? ORDER BY fecha_aplicacion DESC',
      [pacienteId]
    );
    return rows;
  },

  async crear({ cedula, nombres, apellidos, fecha_nacimiento, correo, telefono, ubicacion }) {
    const [result] = await db.query(
      `INSERT INTO pacientes 
        (cedula, nombres, apellidos, fecha_nacimiento, correo, telefono, ubicacion) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [cedula, nombres, apellidos, fecha_nacimiento, correo, telefono, ubicacion || null]
    );
    return result.insertId;
  }
};

module.exports = PacienteModel;