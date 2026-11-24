const db = require('../config/db');

const LogModel = {
  async listarTodos(limite = 100) {
    const [rows] = await db.query(
      `SELECT l.*,
              u.nombre_usuario,
              r.nombre_rol
       FROM logs l
       INNER JOIN usuario u ON l.id_usuario = u.id_usuario
       INNER JOIN roles r ON u.id_rol = r.id_rol
       ORDER BY l.fecha_hora DESC, l.id_log DESC
       LIMIT ?`,
      [Number(limite) || 100]
    );
    return rows;
  },

  async buscarPorId(idLog) {
    const [rows] = await db.query(
      `SELECT l.*,
              u.nombre_usuario,
              r.nombre_rol
       FROM logs l
       INNER JOIN usuario u ON l.id_usuario = u.id_usuario
       INNER JOIN roles r ON u.id_rol = r.id_rol
       WHERE l.id_log = ? LIMIT 1`,
      [idLog]
    );
    return rows[0] || null;
  },

  async listarPorUsuario(idUsuario) {
    const [rows] = await db.query(
      `SELECT l.*,
              u.nombre_usuario
       FROM logs l
       INNER JOIN usuario u ON l.id_usuario = u.id_usuario
       WHERE l.id_usuario = ?
       ORDER BY l.fecha_hora DESC, l.id_log DESC`,
      [idUsuario]
    );
    return rows;
  },

  async listarPorTabla(tablaAfectada) {
    const [rows] = await db.query(
      `SELECT l.*,
              u.nombre_usuario
       FROM logs l
       INNER JOIN usuario u ON l.id_usuario = u.id_usuario
       WHERE l.tabla_afectada = ?
       ORDER BY l.fecha_hora DESC, l.id_log DESC`,
      [tablaAfectada]
    );
    return rows;
  },

  async listarPorAccion(accion) {
    const [rows] = await db.query(
      `SELECT l.*,
              u.nombre_usuario
       FROM logs l
       INNER JOIN usuario u ON l.id_usuario = u.id_usuario
       WHERE l.accion = ?
       ORDER BY l.fecha_hora DESC, l.id_log DESC`,
      [accion]
    );
    return rows;
  },

  async registrar({ id_usuario, accion, tabla_afectada, descripcion_detalle }) {
    const [result] = await db.query(
      `INSERT INTO logs
        (id_usuario, accion, tabla_afectada, descripcion_detalle)
       VALUES (?, ?, ?, ?)`,
      [
        id_usuario,
        accion,
        tabla_afectada,
        descripcion_detalle || null
      ]
    );
    return result.insertId;
  },

  async eliminar(idLog) {
    const [result] = await db.query(
      'DELETE FROM logs WHERE id_log = ?',
      [idLog]
    );
    return result.affectedRows;
  }
};

module.exports = LogModel;