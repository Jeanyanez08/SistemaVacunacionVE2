const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pacienteRoutes = require('./routes/pacienteRoutes');
const vacunaRoutes = require('./routes/vacunaRoutes');
const examenRoutes = require('./routes/examenRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas base del API MVC
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/vacunas', vacunaRoutes);
app.use('/api/examenes', examenRoutes);

app.get('/', (req, res) => {
  res.json({ ok: true, mensaje: 'API Sistema Nacional de Vacunación activa' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});