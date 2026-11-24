const db = require('../config/db');

const VacunaModel = {
  async listarTodas() {
    const [rows] = await db.query(
      `SELECT r.*, p.cedula, p.nombres, p.apellidos, v.nombre AS nombre_vacuna
       FROM registrodosis r
       INNER JOIN personas p ON r.id_personas = p.id_personas
       LEFT JOIN vacunas v ON r.id_vacunas = v.id_vacunas
       ORDER BY r.id_registro DESC`
    );
    return rows;
  },

  async resolverVacunaId(vacunaEntrada) {
    if (vacunaEntrada === undefined || vacunaEntrada === null || String(vacunaEntrada).trim() === '') {
      return null;
    }

    const valorLimpio = String(vacunaEntrada).trim();

    if (/^\d+$/.test(valorLimpio)) {
      const idNum = Number(valorLimpio);
      const [rows] = await db.query(
        'SELECT id_vacunas FROM vacunas WHERE id_vacunas = ? LIMIT 1',
        [idNum]
      );
      if (rows.length > 0) {
        return rows[0].id_vacunas;
      }
    }

    const [existentes] = await db.query(
      'SELECT id_vacunas FROM vacunas WHERE LOWER(nombre) = LOWER(?) LIMIT 1',
      [valorLimpio]
    );
    if (existentes.length > 0) {
      return existentes[0].id_vacunas;
    }

    const [insertResult] = await db.query(
      'INSERT INTO vacunas (nombre) VALUES (?)',
      [valorLimpio]
    );
    return insertResult.insertId;
  },

  async registrarDosis({ id_personas, id_vacunas, id_lote, id_centros, id_usuario, fecha_aplicacion, nro_dosis }) {
    const [result] = await db.query(
      `INSERT INTO registrodosis
        (id_personas, id_vacunas, id_lote, id_centros, id_usuario, fecha_aplicacion, nro_dosis)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id_personas,
        id_vacunas,
        id_lote,
        id_centros,
        id_usuario || null,
        fecha_aplicacion || null,
        nro_dosis || 1
      ]
    );
    return result.insertId;
  },

  async actualizar(idRegistro, { id_vacunas, id_lote, id_centros, fecha_aplicacion, nro_dosis }) {
    const [result] = await db.query(
      `UPDATE registrodosis
       SET id_vacunas = ?, id_lote = ?, id_centros = ?, fecha_aplicacion = ?, nro_dosis = ?
       WHERE id_registro = ?`,
      [
        id_vacunas,
        id_lote,
        id_centros,
        fecha_aplicacion || null,
        nro_dosis || 1,
        idRegistro
      ]
    );
    return result.affectedRows;
  },

  async eliminar(idRegistro) {
    const [result] = await db.query(
      'DELETE FROM registrodosis WHERE id_registro = ?',
      [idRegistro]
    );
    return result.affectedRows;
  }
};

module.exports = VacunaModel;