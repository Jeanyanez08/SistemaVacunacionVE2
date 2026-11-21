const db = require('../config/db');

const ExamenModel = {
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
  }
};

module.exports = ExamenModel;