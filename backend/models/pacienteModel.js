const db = require('../config/db');

const PacienteModel = {
  async listarTodos() {
    const [rows] = await db.query('SELECT * FROM personas ORDER BY id_personas DESC');
    return rows;
  },

  async buscarPorCedula(cedula) {
    const [rows] = await db.query(
      'SELECT * FROM personas WHERE cedula = ? LIMIT 1',
      [cedula]
    );
    return rows[0] || null;
  },

  async obtenerVacunasPorPacienteId(personaId) {
    const [rows] = await db.query(
      'SELECT * FROM registrodosis WHERE id_personas = ? ORDER BY fecha_aplicacion DESC',
      [personaId]
    );
    return rows;
  },

  async crear({ cedula, nombres, apellidos, fecha_nacimiento, correo, telefono }) {
    const [result] = await db.query(
      `INSERT INTO personas
        (cedula, nombres, apellidos, fecha_nacimiento, correo, telefono)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        cedula,
        nombres,
        apellidos,
        fecha_nacimiento || null,
        correo || null,
        telefono || null
      ]
    );
    return result.insertId;
  },

  async actualizar(idPersonas, { cedula, nombres, apellidos, fecha_nacimiento, correo, telefono }) {
    const [result] = await db.query(
      `UPDATE personas
       SET cedula = ?, nombres = ?, apellidos = ?, fecha_nacimiento = ?, correo = ?, telefono = ?
       WHERE id_personas = ?`,
      [
        cedula,
        nombres,
        apellidos,
        fecha_nacimiento || null,
        correo || null,
        telefono || null,
        idPersonas
      ]
    );
    return result.affectedRows;
  },

  async eliminar(idPersonas) {
    const [result] = await db.query('DELETE FROM personas WHERE id_personas = ?', [idPersonas]);
    return result.affectedRows;
  }
};

module.exports = PacienteModel;