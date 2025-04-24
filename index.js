require('dotenv').config();
const express = require('express');
const userRouter = require('./routes/UserRoutes');
const parejaRouter = require('./routes/ParejaRoutes.js');
const encuentroRouter = require('./routes/EncuentroRoutes.js');

const app = express();
app.use(express.json());

// Usar rutas
app.use('/users', userRouter);
app.use('/pareja', parejaRouter);
app.use('/encuentro', encuentroRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
