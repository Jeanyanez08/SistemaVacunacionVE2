const db = require('../config/db');

const UsuarioModel = {
  async listarTodos() {
    const [rows] = await db.query(
      `SELECT u.id_usuario,
              u.nombre_usuario,
              u.id_rol,
              r.nombre_rol,
              u.id_centros,
              c.nombre AS nombre_centro
       FROM usuario u
       INNER JOIN roles r ON u.id_rol = r.id_rol
       LEFT JOIN centros c ON u.id_centros = c.id_centros
       ORDER BY u.id_usuario DESC`
    );
    return rows;
  },

  async buscarPorId(idUsuario) {
    const [rows] = await db.query(
      `SELECT u.id_usuario,
              u.nombre_usuario,
              u.id_rol,
              r.nombre_rol,
              u.id_centros,
              c.nombre AS nombre_centro
       FROM usuario u
       INNER JOIN roles r ON u.id_rol = r.id_rol
       LEFT JOIN centros c ON u.id_centros = c.id_centros
       WHERE u.id_usuario = ? LIMIT 1`,
      [idUsuario]
    );
    return rows[0] || null;
  },

  async buscarPorNombreUsuario(nombreUsuario) {
    const [rows] = await db.query(
      `SELECT u.*,
              r.nombre_rol,
              c.nombre AS nombre_centro
       FROM usuario u
       INNER JOIN roles r ON u.id_rol = r.id_rol
       LEFT JOIN centros c ON u.id_centros = c.id_centros
       WHERE u.nombre_usuario = ? LIMIT 1`,
      [nombreUsuario]
    );
    return rows[0] || null;
  },

  async listarRoles() {
    const [rows] = await db.query(
      'SELECT * FROM roles ORDER BY id_rol ASC'
    );
    return rows;
  },

  async crear({ nombre_usuario, clave, id_rol, id_centros }) {
    const [result] = await db.query(
      `INSERT INTO usuario (nombre_usuario, clave, id_rol, id_centros)
       VALUES (?, ?, ?, ?)`,
      [nombre_usuario, clave, id_rol, id_centros || null]
    );
    return result.insertId;
  },

  async actualizar(idUsuario, { nombre_usuario, id_rol, id_centros }) {
    const [result] = await db.query(
      `UPDATE usuario
       SET nombre_usuario = ?, id_rol = ?, id_centros = ?
       WHERE id_usuario = ?`,
      [nombre_usuario, id_rol, id_centros || null, idUsuario]
    );
    return result.affectedRows;
  },

  async actualizarClave(idUsuario, clave) {
    const [result] = await db.query(
      `UPDATE usuario
       SET clave = ?
       WHERE id_usuario = ?`,
      [clave, idUsuario]
    );
    return result.affectedRows;
  },

  async eliminar(idUsuario) {
    const [result] = await db.query(
      'DELETE FROM usuario WHERE id_usuario = ?',
      [idUsuario]
    );
    return result.affectedRows;
  }
};

module.exports = UsuarioModel;