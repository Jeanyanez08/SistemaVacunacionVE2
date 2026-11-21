const db = require('../config/db');

const VacunaModel = {
  async registrarDosis({ paciente_id, vacuna, lote, fecha_aplicacion, centro_salud }) {
    const [result] = await db.query(
      `INSERT INTO vacunas_aplicadas 
        (paciente_id, vacuna, lote, fecha_aplicacion, centro_salud) 
       VALUES (?, ?, ?, ?, ?)`,
      [paciente_id, vacuna, lote, fecha_aplicacion, centro_salud]
    );
    return result.insertId;
  },

  async listarTodas() {
    const [rows] = await db.query(
      `SELECT v.*, p.cedula, p.nombres, p.apellidos 
       FROM vacunas_aplicadas v
       INNER JOIN pacientes p ON v.paciente_id = p.id
       ORDER BY v.id DESC`
    );
    return rows;
  }
};

module.exports = VacunaModel;