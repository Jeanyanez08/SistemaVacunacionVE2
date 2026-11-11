const db = require('../config/db');

// Obtener paciente por Cédula (Consulta Ciudadana)
exports.obtenerPacientePorCedula = async (req, res) => {
  const { cedula } = req.params;
  try {
    const [paciente] = await db.query('SELECT * FROM pacientes WHERE cedula = ?', [cedula]);
    if (paciente.length === 0) {
      return res.status(404).json({ mensaje: 'Ciudadano no encontrado' });
    }
    
    // Obtener vacunas registradas
    const [vacunas] = await db.query('SELECT * FROM vacunas_aplicadas WHERE paciente_id = ?', [paciente[0].id]);
    
    res.json({
      paciente: paciente[0],
      vacunas: vacunas
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar la base de datos', detalles: error.message });
  }
};

// Registrar nuevo Paciente / Ciudadano
exports.registrarPaciente = async (req, res) => {
  const { cedula, nombres, apellidos, fecha_nacimiento, correo, telefono } = req.body;
  try {
    const [resultado] = await db.query(
      'INSERT INTO pacientes (cedula, nombres, apellidos, fecha_nacimiento, correo, telefono) VALUES (?, ?, ?, ?, ?, ?)',
      [cedula, nombres, apellidos, fecha_nacimiento, correo, telefono]
    );
    res.status(201).json({ mensaje: 'Ciudadano registrado con éxito', id: resultado.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar ciudadano', detalles: error.message });
  }
};