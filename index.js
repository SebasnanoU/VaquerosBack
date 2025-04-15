require('dotenv').config();
const express = require('express');
const userRouter = require('./routes/UserRoutes');

const app = express();
app.use(express.json());

// Usar rutas
app.use('/users', userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
