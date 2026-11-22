const db = require('../config/db');

const ExamenModel = {
  async listarTodos() {
    const [rows] = await db.query(
      `SELECT e.*, p.cedula, p.nombres, p.apellidos
       FROM examenes_externos e
       INNER JOIN pacientes p ON e.paciente_id = p.id
       ORDER BY e.id DESC`
    );
    return rows;
  },

  async crearExamen({ paciente_id, tipo_examen, archivo_url, observacion }) {
    const [result] = await db.query(
      `INSERT INTO examenes_externos
        (paciente_id, tipo_examen, archivo_url, observacion, estado_promesa)
       VALUES (?, ?, ?, ?, 'pendiente')`,
      [paciente_id, tipo_examen, archivo_url || null, observacion || '']
    );
    return result.insertId;
  },

  async actualizarDictamen(id, { estado_promesa, dictamen_subregion }) {
    const [result] = await db.query(
      `UPDATE examenes_externos
       SET estado_promesa = ?, dictamen_subregion = ?
       WHERE id = ?`,
      [estado_promesa, dictamen_subregion, id]
    );
    return result.affectedRows;
  },

  async eliminar(id) {
    const [result] = await db.query('DELETE FROM examenes_externos WHERE id = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = ExamenModel;