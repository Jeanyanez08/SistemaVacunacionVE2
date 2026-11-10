const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pacienteRoutes = require('./routes/pacienteRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Definición de Rutas del API
app.use('/api/pacientes', pacienteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor MVC ejecutándose en el puerto ${PORT}`);
});