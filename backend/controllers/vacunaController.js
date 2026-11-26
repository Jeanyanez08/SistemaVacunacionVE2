const db = require('../config/db');
const VacunaModel = require('../models/vacunaModel');
const PacienteModel = require('../models/pacienteModel');
const LoteModel = require('../models/loteModel');
const LogModel = require('../models/logModel');

function normalizarFechaMySQL(fechaEntrada) {
  if (!fechaEntrada || typeof fechaEntrada !== 'string') {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
  }
  const texto = fechaEntrada.trim();
  const matchDMY = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (matchDMY) {
    const [, dia, mes, anio] = matchDMY;
    return `${anio}-${mes}-${dia} 00:00:00`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
    return `${texto} 00:00:00`;
  }
  return texto;
}

async function resolverLoteId(loteEntrada) {
  if (loteEntrada === undefined || loteEntrada === null || String(loteEntrada).trim() === '') {
    return null;
  }
  const loteLimpio = String(loteEntrada).trim();
  const [lotesPorNumero] = await db.query(
    'SELECT id_lote FROM lote_vacuna WHERE numero_lote = ? LIMIT 1',
    [loteLimpio]
  );
  if (lotesPorNumero.length > 0) return lotesPorNumero[0].id_lote;

  if (/^\d+$/.test(loteLimpio)) {
    const [lotesPorId] = await db.query(
      'SELECT id_lote FROM lote_vacuna WHERE id_lote = ? LIMIT 1',
      [Number(loteLimpio)]
    );
    if (lotesPorId.length > 0) return lotesPorId[0].id_lote;
  }
  return null;
}

async function resolverCentroId(centroEntrada) {
  if (centroEntrada === undefined || centroEntrada === null || String(centroEntrada).trim() === '') {
    return null;
  }
  const centroLimpio = String(centroEntrada).trim();
  if (/^\d+$/.test(centroLimpio)) {
    const [centrosPorId] = await db.query(
      'SELECT id_centros FROM centros WHERE id_centros = ? LIMIT 1',
      [Number(centroLimpio)]
    );
    if (centrosPorId.length > 0) return centrosPorId[0].id_centros;
  }
  const [centrosPorNombre] = await db.query(
    'SELECT id_centros FROM centros WHERE LOWER(nombre) = LOWER(?) LIMIT 1',
    [centroLimpio]
  );
  if (centrosPorNombre.length > 0) return centrosPorNombre[0].id_centros;
  return null;
}

const vacunaController = {
  async obtenerHistorialGeneral(req, res) {
    try {
      const registros = await VacunaModel.listarTodas();
      return res.status(200).json({ ok: true, data: registros });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al obtener historial de vacunas',
        error: error.message
      });
    }
  },

  async registrarVacuna(req, res) {
    try {
      const {
        cedula,
        id_vacunas,
        id_lote,
        id_centros,
        id_usuario,
        vacuna,
        lote,
        centro_salud,
        fecha_aplicacion,
        nro_dosis
      } = req.body;

      const vacunaValor = id_vacunas ?? vacuna;
      if (!cedula || !vacunaValor) {
        return res.status(400).json({
          ok: false,
          mensaje: 'La cédula y la vacuna son obligatorios'
        });
      }

      const paciente = await PacienteModel.buscarPorCedula(cedula.trim());
      if (!paciente) {
        return res.status(404).json({
          ok: false,
          mensaje: 'No existe un ciudadano con esa cédula'
        });
      }

      const idVacunaResuelto = await VacunaModel.resolverVacunaId(vacunaValor);
      const idLoteResuelto = await resolverLoteId(id_lote ?? lote);
      const idCentroResuelto = await resolverCentroId(id_centros ?? centro_salud);

      if (!idVacunaResuelto || !idLoteResuelto || !idCentroResuelto) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Vacuna, lote o centro asistencial no válidos en el sistema'
        });
      }

      // Descontar 1 unidad del inventario disponible del lote
      const descontado = await LoteModel.descontarDisponibles(idLoteResuelto, 1);
      if (descontado === 0) {
        return res.status(400).json({
          ok: false,
          mensaje: 'El lote seleccionado no tiene dosis disponibles en inventario'
        });
      }

      const usuarioActivo = Number(id_usuario) || 1;
      const idRegistro = await VacunaModel.registrarDosis({
        id_personas: paciente.id_personas,
        id_vacunas: idVacunaResuelto,
        id_lote: idLoteResuelto,
        id_centros: idCentroResuelto,
        id_usuario: usuarioActivo,
        fecha_aplicacion: normalizarFechaMySQL(fecha_aplicacion),
        nro_dosis: nro_dosis || 1
      });

      await LogModel.registrar({
        id_usuario: usuarioActivo,
        accion: 'INSERT',
        tabla_afectada: 'registrodosis',
        descripcion_detalle: `Dosis #${nro_dosis || 1} aplicada a cédula ${cedula.trim()} (Registro ID ${idRegistro})`
      });

      return res.status(201).json({
        ok: true,
        mensaje: 'Dosis registrada e inventario del lote actualizado',
        id: idRegistro
      });
    } catch (error) {
      console.error('Error en registrarVacuna:', error);
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al registrar la vacuna',
        error: error.message
      });
    }
  },

  async actualizarVacuna(req, res) {
    try {
      const { id } = req.params;
      const {
        id_vacunas,
        id_lote,
        id_centros,
        vacuna,
        lote,
        centro_salud,
        fecha_aplicacion,
        nro_dosis,
        id_usuario
      } = req.body;

      const idVacunaResuelto = await VacunaModel.resolverVacunaId(id_vacunas ?? vacuna);
      const idLoteResuelto = await resolverLoteId(id_lote ?? lote);
      const idCentroResuelto = await resolverCentroId(id_centros ?? centro_salud);

      if (!idVacunaResuelto || !idLoteResuelto || !idCentroResuelto) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Vacuna, lote o centro asistencial no válidos'
        });
      }

      const actualizados = await VacunaModel.actualizar(id, {
        id_vacunas: idVacunaResuelto,
        id_lote: idLoteResuelto,
        id_centros: idCentroResuelto,
        fecha_aplicacion: fecha_aplicacion ? normalizarFechaMySQL(fecha_aplicacion) : null,
        nro_dosis: nro_dosis || 1
      });

      if (actualizados === 0) {
        return res.status(404).json({ ok: false, mensaje: 'Registro de vacuna no encontrado' });
      }

      if (id_usuario) {
        await LogModel.registrar({
          id_usuario: Number(id_usuario),
          accion: 'UPDATE',
          tabla_afectada: 'registrodosis',
          descripcion_detalle: `Registro de dosis ID ${id} actualizado`
        });
      }

      return res.status(200).json({ ok: true, mensaje: 'Vacuna actualizada con éxito' });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al actualizar vacuna',
        error: error.message
      });
    }
  },

  async eliminarVacuna(req, res) {
    try {
      const { id } = req.params;
      const eliminados = await VacunaModel.eliminar(id);
      if (eliminados === 0) {
        return res.status(404).json({ ok: false, mensaje: 'Registro de vacuna no encontrado' });
      }
      return res.status(200).json({ ok: true, mensaje: 'Registro de vacuna eliminado con éxito' });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al eliminar vacuna',
        error: error.message
      });
    }
  }
};

module.exports = vacunaController;