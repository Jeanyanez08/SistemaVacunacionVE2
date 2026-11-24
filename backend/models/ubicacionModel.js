const db = require('../config/db');

const UbicacionModel = {
  // --- ESTADOS ---
  async listarEstados() {
    const [rows] = await db.query(
      'SELECT * FROM estado ORDER BY nombre ASC'
    );
    return rows;
  },

  async buscarEstadoPorId(idEstado) {
    const [rows] = await db.query(
      'SELECT * FROM estado WHERE id_estado = ? LIMIT 1',
      [idEstado]
    );
    return rows[0] || null;
  },

  async crearEstado({ nombre }) {
    const [result] = await db.query(
      'INSERT INTO estado (nombre) VALUES (?)',
      [nombre]
    );
    return result.insertId;
  },

  async actualizarEstado(idEstado, { nombre }) {
    const [result] = await db.query(
      'UPDATE estado SET nombre = ? WHERE id_estado = ?',
      [nombre, idEstado]
    );
    return result.affectedRows;
  },

  async eliminarEstado(idEstado) {
    const [result] = await db.query(
      'DELETE FROM estado WHERE id_estado = ?',
      [idEstado]
    );
    return result.affectedRows;
  },

  // --- MUNICIPIOS ---
  async listarMunicipios() {
    const [rows] = await db.query(
      `SELECT m.*, e.nombre AS nombre_estado
       FROM municipio m
       INNER JOIN estado e ON m.id_estado = e.id_estado
       ORDER BY m.nombre ASC`
    );
    return rows;
  },

  async listarMunicipiosPorEstado(idEstado) {
    const [rows] = await db.query(
      `SELECT * FROM municipio
       WHERE id_estado = ?
       ORDER BY nombre ASC`,
      [idEstado]
    );
    return rows;
  },

  async crearMunicipio({ nombre, id_estado }) {
    const [result] = await db.query(
      'INSERT INTO municipio (nombre, id_estado) VALUES (?, ?)',
      [nombre, id_estado]
    );
    return result.insertId;
  },

  async actualizarMunicipio(idMunicipio, { nombre, id_estado }) {
    const [result] = await db.query(
      `UPDATE municipio
       SET nombre = ?, id_estado = ?
       WHERE id_municipio = ?`,
      [nombre, id_estado, idMunicipio]
    );
    return result.affectedRows;
  },

  async eliminarMunicipio(idMunicipio) {
    const [result] = await db.query(
      'DELETE FROM municipio WHERE id_municipio = ?',
      [idMunicipio]
    );
    return result.affectedRows;
  },

  // --- PARROQUIAS ---
  async listarParroquias() {
    const [rows] = await db.query(
      `SELECT pa.*,
              m.nombre AS nombre_municipio,
              e.nombre AS nombre_estado
       FROM parroquia pa
       INNER JOIN municipio m ON pa.id_municipio = m.id_municipio
       INNER JOIN estado e ON m.id_estado = e.id_estado
       ORDER BY pa.nombre ASC`
    );
    return rows;
  },

  async listarParroquiasPorMunicipio(idMunicipio) {
    const [rows] = await db.query(
      `SELECT * FROM parroquia
       WHERE id_municipio = ?
       ORDER BY nombre ASC`,
      [idMunicipio]
    );
    return rows;
  },

  async crearParroquia({ nombre, id_municipio }) {
    const [result] = await db.query(
      'INSERT INTO parroquia (nombre, id_municipio) VALUES (?, ?)',
      [nombre, id_municipio]
    );
    return result.insertId;
  },

  async actualizarParroquia(idParroquia, { nombre, id_municipio }) {
    const [result] = await db.query(
      `UPDATE parroquia
       SET nombre = ?, id_municipio = ?
       WHERE id_parroquia = ?`,
      [nombre, id_municipio, idParroquia]
    );
    return result.affectedRows;
  },

  async eliminarParroquia(idParroquia) {
    const [result] = await db.query(
      'DELETE FROM parroquia WHERE id_parroquia = ?',
      [idParroquia]
    );
    return result.affectedRows;
  },

  // --- SUBREGIONES ---
  async listarSubregiones() {
    const [rows] = await db.query(
      `SELECT s.*,
              m.nombre AS nombre_municipio,
              e.nombre AS nombre_estado
       FROM subregion s
       INNER JOIN municipio m ON s.id_municipio = m.id_municipio
       INNER JOIN estado e ON m.id_estado = e.id_estado
       ORDER BY s.nombre_subregion ASC`
    );
    return rows;
  },

  async listarSubregionesPorMunicipio(idMunicipio) {
    const [rows] = await db.query(
      `SELECT * FROM subregion
       WHERE id_municipio = ?
       ORDER BY nombre_subregion ASC`,
      [idMunicipio]
    );
    return rows;
  },

  async crearSubregion({ nombre_subregion, id_municipio }) {
    const [result] = await db.query(
      'INSERT INTO subregion (nombre_subregion, id_municipio) VALUES (?, ?)',
      [nombre_subregion, id_municipio]
    );
    return result.insertId;
  },

  async actualizarSubregion(idSubregion, { nombre_subregion, id_municipio }) {
    const [result] = await db.query(
      `UPDATE subregion
       SET nombre_subregion = ?, id_municipio = ?
       WHERE id_subregion = ?`,
      [nombre_subregion, id_municipio, idSubregion]
    );
    return result.affectedRows;
  },

  async eliminarSubregion(idSubregion) {
    const [result] = await db.query(
      'DELETE FROM subregion WHERE id_subregion = ?',
      [idSubregion]
    );
    return result.affectedRows;
  }
};

module.exports = UbicacionModel;