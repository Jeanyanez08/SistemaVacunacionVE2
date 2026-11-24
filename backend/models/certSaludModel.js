const db = require('../config/db');

const CertSaludModel = {
  async listarTodos() {
    const [rows] = await db.query(
      `SELECT cs.*,
              p.cedula,
              p.nombres,
              p.apellidos,
              ex.nombre_archivo,
              rd.fecha_aplicacion,
              rd.nro_dosis
       FROM certsalud cs
       INNER JOIN personas p ON cs.id_personas = p.id_personas
       LEFT JOIN examenes ex ON cs.id_examenes = ex.id_examenes
       LEFT JOIN registrodosis rd ON cs.id_registro = rd.id_registro
       ORDER BY cs.id_cert DESC`
    );
    return rows;
  },

  async buscarPorId(idCert) {
    const [rows] = await db.query(
      `SELECT cs.*,
              p.cedula,
              p.nombres,
              p.apellidos,
              ex.nombre_archivo,
              rd.fecha_aplicacion,
              rd.nro_dosis
       FROM certsalud cs
       INNER JOIN personas p ON cs.id_personas = p.id_personas
       LEFT JOIN examenes ex ON cs.id_examenes = ex.id_examenes
       LEFT JOIN registrodosis rd ON cs.id_registro = rd.id_registro
       WHERE cs.id_cert = ? LIMIT 1`,
      [idCert]
    );
    return rows[0] || null;
  },

  async listarPorPersona(idPersonas) {
    const [rows] = await db.query(
      `SELECT cs.*,
              ex.nombre_archivo,
              rd.fecha_aplicacion,
              rd.nro_dosis
       FROM certsalud cs
       LEFT JOIN examenes ex ON cs.id_examenes = ex.id_examenes
       LEFT JOIN registrodosis rd ON cs.id_registro = rd.id_registro
       WHERE cs.id_personas = ?
       ORDER BY cs.id_cert DESC`,
      [idPersonas]
    );
    return rows;
  },

  async listarPorEstatus(estatus) {
    const [rows] = await db.query(
      `SELECT cs.*,
              p.cedula,
              p.nombres,
              p.apellidos
       FROM certsalud cs
       INNER JOIN personas p ON cs.id_personas = p.id_personas
       WHERE cs.estatus = ?
       ORDER BY cs.id_cert DESC`,
      [estatus]
    );
    return rows;
  },

  async crear({
    id_personas,
    id_examenes,
    id_registro,
    estatus,
    observaciones
  }) {
    const [result] = await db.query(
      `INSERT INTO certsalud
        (id_personas, id_examenes, id_registro, estatus, observaciones)
       VALUES (?, ?, ?, ?, ?)`,
      [
        id_personas,
        id_examenes || null,
        id_registro || null,
        estatus || 'Pendiente',
        observaciones || null
      ]
    );
    return result.insertId;
  },

  async actualizarEstatus(idCert, { estatus, observaciones }) {
    const [result] = await db.query(
      `UPDATE certsalud
       SET estatus = ?, observaciones = ?
       WHERE id_cert = ?`,
      [estatus || 'Pendiente', observaciones || null, idCert]
    );
    return result.affectedRows;
  },

  async actualizar(idCert, {
    id_personas,
    id_examenes,
    id_registro,
    estatus,
    observaciones
  }) {
    const [result] = await db.query(
      `UPDATE certsalud
       SET id_personas = ?, id_examenes = ?, id_registro = ?,
           estatus = ?, observaciones = ?
       WHERE id_cert = ?`,
      [
        id_personas,
        id_examenes || null,
        id_registro || null,
        estatus || 'Pendiente',
        observaciones || null,
        idCert
      ]
    );
    return result.affectedRows;
  },

  async eliminar(idCert) {
    const [result] = await db.query(
      'DELETE FROM certsalud WHERE id_cert = ?',
      [idCert]
    );
    return result.affectedRows;
  }
};

module.exports = CertSaludModel;