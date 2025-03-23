const express = require('express');
const router = express.Router();
const EncuentroModel = require('../models/EncuentroModel');
const encuentroModel = new EncuentroModel();

router.post('/encuentro', async (req, res) => {
  const encuentroData = {
    fechaInicio: req.body.fechaInicio,
    fechaFin: req.body.fechaFin,
    calificacion: req.body.calificacion,
    repetiria: req.body.repetiria,
    memorable: req.body.memorable,
    comentario: req.body.comentario,
    latitud: req.body.latitud,
    longitud: req.body.longitud,
    plan: req.body.plan,
    pareja: req.body.pareja,
    usuario: req.body.usuario,
  };

  try {
    const result = await encuentroModel.createEncuentro(encuentroData);
    res.send(result);
  } catch (err) {
    res.status(500).send({ status: 'error', message: 'Error almacenando la información' });
  }
});

router.get('/encuentro', async (req, res) => {
  try {
    const encuentros = await encuentroModel.getEncuentros();
    res.json(encuentros);
  } catch (err) {
    res.status(500).send({ status: 'error', message: 'Error obteniendo los encuentros' });
  }
});

module.exports = router;
