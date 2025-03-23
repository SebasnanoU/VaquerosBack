const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();

// Middleware para parsear JSON y URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Importar las rutas
const encuentroRoutes = require('./routes/encuentroRoutes');
const comentarioRoutes = require('./routes/comentarioRoutes');
const parejaRoutes = require('./routes/parejaRoutes'); // Si tienes rutas para pareja
const planRoutes = require('./routes/planRoutes'); // Si tienes rutas para plan
const userRoutes = require('./routes/userRoutes'); // Si tienes rutas para usuario

// Usar las rutas
app.use('/api', encuentroRoutes);
app.use('/api', comentarioRoutes);
app.use('/api', parejaRoutes); // Si tienes rutas para pareja
app.use('/api', planRoutes); // Si tienes rutas para plan
app.use('/api', userRoutes); // Si tienes rutas para usuario

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
