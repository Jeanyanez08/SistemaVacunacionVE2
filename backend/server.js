const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const pacienteRoutes = require('./routes/pacienteRoutes');
const vacunaRoutes = require('./routes/vacunaRoutes');
const examenRoutes = require('./routes/examenRoutes');
const centroRoutes = require('./routes/centroRoutes');
const certSaludRoutes = require('./routes/certSaludRoutes');
const logRoutes = require('./routes/logRoutes');
const loteRoutes = require('./routes/loteRoutes');
const ubicacionRoutes = require('./routes/ubicacionRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();

// Crea carpeta uploads si no existe para guardar exámenes reales (PDF/Imágenes)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.use('/api/pacientes', pacienteRoutes);
app.use('/api/vacunas', vacunaRoutes);
app.use('/api/examenes', examenRoutes);
app.use('/api/centros', centroRoutes);
app.use('/api/certsalud', certSaludRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/lotes', loteRoutes);
app.use('/api/ubicacion', ubicacionRoutes);
app.use('/api/usuarios', usuarioRoutes);

app.get('/', (req, res) => {
  res.json({ ok: true, mensaje: 'API Sistema Nacional de Vacunación activa' });
});

app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({ ok: false, mensaje: err.message || 'Error interno del servidor' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});