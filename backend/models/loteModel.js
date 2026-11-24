const db = require('../config/db');

const LoteModel = {
  async listarTodos() {
    const [rows] = await db.query(
      `SELECT l.*, v.nombre AS nombre_vacuna, c.nombre AS nombre_centro
       FROM lote_vacuna l
       INNER JOIN vacunas v ON l.id_vacunas = v.id_vacunas
       INNER JOIN centros c ON l.id_centros = c.id_centros
       ORDER BY l.id_lote DESC`
    );
    return rows;
  },

  async buscarPorId(idLote) {
    const [rows] = await db.query(
      'SELECT * FROM lote_vacuna WHERE id_lote = ? LIMIT 1',
      [idLote]
    );
    return rows[0] || null;
  },

  async buscarPorNumeroLote(numeroLote) {
    const [rows] = await db.query(
      `SELECT l.*, v.nombre AS nombre_vacuna, c.nombre AS nombre_centro
       FROM lote_vacuna l
       INNER JOIN vacunas v ON l.id_vacunas = v.id_vacunas
       INNER JOIN centros c ON l.id_centros = c.id_centros
       WHERE l.numero_lote = ? LIMIT 1`,
      [numeroLote]
    );
    return rows[0] || null;
  },

  async crear({
    id_vacunas,
    numero_lote,
    fecha_vencimiento,
    cantidad_recibida,
    cantidad_disponible,
    id_centros
  }) {
    const disponibleFinal =
      cantidad_disponible !== undefined && cantidad_disponible !== null
        ? cantidad_disponible
        : cantidad_recibida;

    const [result] = await db.query(
      `INSERT INTO lote_vacuna
        (id_vacunas, numero_lote, fecha_vencimiento, cantidad_recibida, cantidad_disponible, id_centros)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id_vacunas,
        numero_lote,
        fecha_vencimiento,
        cantidad_recibida,
        disponibleFinal,
        id_centros
      ]
    );
    return result.insertId;
  },

  async actualizar(idLote, {
    id_vacunas,
    numero_lote,
    fecha_vencimiento,
    cantidad_recibida,
    cantidad_disponible,
    id_centros
  }) {
    const [result] = await db.query(
      `UPDATE lote_vacuna
       SET id_vacunas = ?, numero_lote = ?, fecha_vencimiento = ?,
           cantidad_recibida = ?, cantidad_disponible = ?, id_centros = ?
       WHERE id_lote = ?`,
      [
        id_vacunas,
        numero_lote,
        fecha_vencimiento,
        cantidad_recibida,
        cantidad_disponible,
        id_centros,
        idLote
      ]
    );
    return result.affectedRows;
  },

  async descontarDisponibles(idLote, cantidad = 1) {
    const [result] = await db.query(
      `UPDATE lote_vacuna
       SET cantidad_disponible = cantidad_disponible - ?
       WHERE id_lote = ? AND cantidad_disponible >= ?`,
      [cantidad, idLote, cantidad]
    );
    return result.affectedRows;
  },

  async eliminar(idLote) {
    const [result] = await db.query(
      'DELETE FROM lote_vacuna WHERE id_lote = ?',
      [idLote]
    );
    return result.affectedRows;
  }
};

module.exports = LoteModel;