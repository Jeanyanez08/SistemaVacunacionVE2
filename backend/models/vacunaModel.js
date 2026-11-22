const db = require('../config/db');

const VacunaModel = {
  async listarTodas() {
    const [rows] = await db.query(
      `SELECT v.*, p.cedula, p.nombres, p.apellidos
       FROM vacunas_aplicadas v
       INNER JOIN pacientes p ON v.paciente_id = p.id
       ORDER BY v.id DESC`
    );
    return rows;
  },

  async registrarDosis({ paciente_id, vacuna, lote, fecha_aplicacion, centro_salud }) {
    const [result] = await db.query(
      `INSERT INTO vacunas_aplicadas
        (paciente_id, vacuna, lote, fecha_aplicacion, centro_salud)
       VALUES (?, ?, ?, ?, ?)`,
      [paciente_id, vacuna, lote, fecha_aplicacion, centro_salud]
    );
    return result.insertId;
  },

  async actualizar(id, { vacuna, lote, fecha_aplicacion, centro_salud }) {
    const [result] = await db.query(
      `UPDATE vacunas_aplicadas
       SET vacuna = ?, lote = ?, fecha_aplicacion = ?, centro_salud = ?
       WHERE id = ?`,
      [vacuna, lote, fecha_aplicacion, centro_salud, id]
    );
    return result.affectedRows;
  },

  async eliminar(id) {
    const [result] = await db.query('DELETE FROM vacunas_aplicadas WHERE id = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = VacunaModel;