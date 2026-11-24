const db = require('../config/db');

const CentroModel = {
  async listarTodos() {
    const [rows] = await db.query(
      `SELECT c.*,
              pa.nombre AS nombre_parroquia,
              m.nombre AS nombre_municipio,
              e.nombre AS nombre_estado
       FROM centros c
       INNER JOIN parroquia pa ON c.id_parroquia = pa.id_parroquia
       INNER JOIN municipio m ON pa.id_municipio = m.id_municipio
       INNER JOIN estado e ON m.id_estado = e.id_estado
       ORDER BY c.nombre ASC`
    );
    return rows;
  },

  async buscarPorId(idCentro) {
    const [rows] = await db.query(
      `SELECT c.*,
              pa.nombre AS nombre_parroquia,
              m.nombre AS nombre_municipio,
              e.nombre AS nombre_estado
       FROM centros c
       INNER JOIN parroquia pa ON c.id_parroquia = pa.id_parroquia
       INNER JOIN municipio m ON pa.id_municipio = m.id_municipio
       INNER JOIN estado e ON m.id_estado = e.id_estado
       WHERE c.id_centros = ? LIMIT 1`,
      [idCentro]
    );
    return rows[0] || null;
  },

  async listarPorParroquia(idParroquia) {
    const [rows] = await db.query(
      `SELECT * FROM centros
       WHERE id_parroquia = ?
       ORDER BY nombre ASC`,
      [idParroquia]
    );
    return rows;
  },

  async crear({ nombre, direccion, telf, id_parroquia }) {
    const [result] = await db.query(
      `INSERT INTO centros (nombre, direccion, telf, id_parroquia)
       VALUES (?, ?, ?, ?)`,
      [nombre, direccion, telf || null, id_parroquia]
    );
    return result.insertId;
  },

  async actualizar(idCentro, { nombre, direccion, telf, id_parroquia }) {
    const [result] = await db.query(
      `UPDATE centros
       SET nombre = ?, direccion = ?, telf = ?, id_parroquia = ?
       WHERE id_centros = ?`,
      [nombre, direccion, telf || null, id_parroquia, idCentro]
    );
    return result.affectedRows;
  },

  async eliminar(idCentro) {
    const [result] = await db.query(
      'DELETE FROM centros WHERE id_centros = ?',
      [idCentro]
    );
    return result.affectedRows;
  }
};

module.exports = CentroModel;