const db = require('../config/db');
const VacunaModel = require('../models/vacunaModel');
const PacienteModel = require('../models/pacienteModel');

function normalizarFechaMySQL(fechaEntrada) {
  if (!fechaEntrada || typeof fechaEntrada !== 'string') {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
  }

  const texto = fechaEntrada.trim();

  // Si viene en formato DD/MM/YYYY
  const matchDMY = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (matchDMY) {
    const [, dia, mes, anio] = matchDMY;
    return `${anio}-${mes}-${dia} 00:00:00`;
  }

  // Si viene en formato YYYY-MM-DD
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

  // Primero busca por el número de lote escrito en el formulario (ej: "4444")
  const [lotesPorNumero] = await db.query(
    'SELECT id_lote FROM lote_vacuna WHERE numero_lote = ? LIMIT 1',
    [loteLimpio]
  );
  if (lotesPorNumero.length > 0) {
    return lotesPorNumero[0].id_lote;
  }

  // Si no coincide por número, intenta buscar por id_lote numérico
  if (/^\d+$/.test(loteLimpio)) {
    const [lotesPorId] = await db.query(
      'SELECT id_lote FROM lote_vacuna WHERE id_lote = ? LIMIT 1',
      [Number(loteLimpio)]
    );
    if (lotesPorId.length > 0) {
      return lotesPorId[0].id_lote;
    }
  }

  return null;
}

async function resolverCentroId(centroEntrada) {
  if (centroEntrada === undefined || centroEntrada === null || String(centroEntrada).trim() === '') {
    return null;
  }

  const centroLimpio = String(centroEntrada).trim();

  // Si viene numérico (ej: "1"), verifica que exista en centros
  if (/^\d+$/.test(centroLimpio)) {
    const [centrosPorId] = await db.query(
      'SELECT id_centros FROM centros WHERE id_centros = ? LIMIT 1',
      [Number(centroLimpio)]
    );
    if (centrosPorId.length > 0) {
      return centrosPorId[0].id_centros;
    }
  }

  // Busca por el nombre del centro asistencial (ej: "Hospital Dr. Israel Ranuárez Balza")
  const [centrosPorNombre] = await db.query(
    'SELECT id_centros FROM centros WHERE LOWER(nombre) = LOWER(?) LIMIT 1',
    [centroLimpio]
  );
  if (centrosPorNombre.length > 0) {
    return centrosPorNombre[0].id_centros;
  }

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
          mensaje: 'No existe un paciente con esa cédula para asignarle la dosis'
        });
      }

      const idVacunaResuelto = await VacunaModel.resolverVacunaId(vacunaValor);
      if (!idVacunaResuelto) {
        return res.status(400).json({
          ok: false,
          mensaje: 'No se pudo determinar la vacuna a registrar'
        });
      }

      const idLoteResuelto = await resolverLoteId(id_lote ?? lote);
      if (!idLoteResuelto) {
        return res.status(400).json({
          ok: false,
          mensaje: 'No se encontró un lote válido registrado en el sistema'
        });
      }

      const idCentroResuelto = await resolverCentroId(id_centros ?? centro_salud);
      if (!idCentroResuelto) {
        return res.status(400).json({
          ok: false,
          mensaje: 'No se encontró un centro asistencial válido en el sistema'
        });
      }

      const idPersonas = paciente.id_personas ?? paciente.id;
      const idRegistro = await VacunaModel.registrarDosis({
        id_personas: idPersonas,
        id_vacunas: idVacunaResuelto,
        id_lote: idLoteResuelto,
        id_centros: idCentroResuelto,
        id_usuario: id_usuario || 1,
        fecha_aplicacion: normalizarFechaMySQL(fecha_aplicacion),
        nro_dosis: nro_dosis || 1
      });

      return res.status(201).json({
        ok: true,
        mensaje: 'Dosis de vacuna registrada con éxito',
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
        nro_dosis
      } = req.body;

      const vacunaValor = id_vacunas ?? vacuna;
      if (!vacunaValor) {
        return res.status(400).json({
          ok: false,
          mensaje: 'La vacuna es obligatoria'
        });
      }

      const idVacunaResuelto = await VacunaModel.resolverVacunaId(vacunaValor);
      const idLoteResuelto = await resolverLoteId(id_lote ?? lote);
      const idCentroResuelto = await resolverCentroId(id_centros ?? centro_salud);

      if (!idLoteResuelto || !idCentroResuelto) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Lote o centro asistencial no válidos'
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

      return res.status(200).json({ ok: true, mensaje: 'Vacuna actualizada con éxito' });
    } catch (error) {
      console.error('Error en actualizarVacuna:', error);
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
      console.error('Error en eliminarVacuna:', error);
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al eliminar vacuna',
        error: error.message
      });
    }
  }
};

module.exports = vacunaController;