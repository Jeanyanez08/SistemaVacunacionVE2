const db = require('../config/db');

const PacienteModel = {
  async listarTodos() {
    const [rows] = await db.query('SELECT * FROM pacientes ORDER BY id DESC');
    return rows;
  },

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
      [cedula, nombres, apellidos, fecha_nacimiento || null, correo || null, telefono || null, ubicacion || null]
    );
    return result.insertId;
  },

  async actualizar(id, { cedula, nombres, apellidos, fecha_nacimiento, correo, telefono, ubicacion }) {
    const [result] = await db.query(
      `UPDATE pacientes
       SET cedula = ?, nombres = ?, apellidos = ?, fecha_nacimiento = ?, correo = ?, telefono = ?, ubicacion = ?
       WHERE id = ?`,
      [cedula, nombres, apellidos, fecha_nacimiento || null, correo || null, telefono || null, ubicacion || null, id]
    );
    return result.affectedRows;
  },

  async eliminar(id) {
    const [result] = await db.query('DELETE FROM pacientes WHERE id = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = PacienteModel;