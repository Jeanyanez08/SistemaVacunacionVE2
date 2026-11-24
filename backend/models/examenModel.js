const db = require('../config/db');

const ExamenModel = {
  async listarTodos() {
    const [rows] = await db.query(
      `SELECT e.*, p.cedula, p.nombres, p.apellidos
       FROM examenes e
       INNER JOIN personas p ON e.id_personas = p.id_personas
       ORDER BY e.id_examenes DESC`
    );
    return rows;
  },

  async crearExamen({ id_personas, nombre_archivo, ruta_archivo }) {
    const [result] = await db.query(
      `INSERT INTO examenes
        (id_personas, nombre_archivo, ruta_archivo)
       VALUES (?, ?, ?)`,
      [id_personas, nombre_archivo, ruta_archivo]
    );
    return result.insertId;
  },

  async actualizarArchivo(idExamenes, { nombre_archivo, ruta_archivo }) {
    const [result] = await db.query(
      `UPDATE examenes
       SET nombre_archivo = ?, ruta_archivo = ?
       WHERE id_examenes = ?`,
      [nombre_archivo, ruta_archivo, idExamenes]
    );
    return result.affectedRows;
  },

  async eliminar(idExamenes) {
    const [result] = await db.query(
      'DELETE FROM examenes WHERE id_examenes = ?',
      [idExamenes]
    );
    return result.affectedRows;
  }
};

module.exports = ExamenModel;