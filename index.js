require('dotenv').config();
const express = require('express');
const userRouter = require('./routes/UserRoutes');
const parejaRouter = require('./routes/ParejaRoutes.js');
const encuentroRouter = require('./routes/EncuentroRoutes.js');
const planRoutes = require('./routes/PlanRoutes.js');
const comentariosRouter = require('./routes/ComentariosRoutes.js');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
let openapiDocument;
try {
  openapiDocument = YAML.load('./openapi.yaml');
} catch (e) {
  console.warn('No se pudo cargar openapi.yaml para Swagger UI:', e.message);
}

const app = express();
app.use(express.json());

// Usar rutas
app.use('/users', userRouter);
app.use('/pareja', parejaRouter);
app.use('/encuentro', encuentroRouter);
app.use('/plan', planRoutes);
app.use('/comentarios', comentariosRouter);

// Swagger UI en /docs (si existe el spec)
if (openapiDocument) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));
}

// Redirigir raíz a /docs si está disponible
app.get('/', (req, res) => {
  if (openapiDocument) return res.redirect('/docs');
  res.send('API VaquerosBack');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
