const express = require('express');
const router = express.Router();
const ParejaModel = require('./models/ParejaModel');
const parejaModel = new ParejaModel();

router.post('/pareja', async (req, res) => {
  const parejaData = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    redSocial: req.body.redSocial,
    apodo: req.body.apodo,
    calientaHuevos: req.body.calientaHuevos,
    usuariosAsociados: req.body.usuariosAsociados,
  };

  try {
    const result = await parejaModel.createPareja(parejaData);
    res.send(result);
  } catch (err) {
    res.status(500).send({ status: 'error', message: 'Error almacenando la información' });
  }
});

router.get('/pareja', async (req, res) => {
  try {
    const parejas = await parejaModel.getParejas();
    res.json(parejas);
  } catch (err) {
    res.status(500).send({ status: 'error', message: 'Error obteniendo las parejas' });
  }
});

module.exports = router;
