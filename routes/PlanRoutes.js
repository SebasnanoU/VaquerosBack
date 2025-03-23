const express = require('express');
const router = express.Router();
const PlanModel = require('./models/PlanModel');
const planModel = new PlanModel();

router.post('/plan', async (req, res) => {
  const planData = {
    tipoPlan: req.body.tipoPlan,
    detalles: req.body.detalles,
    fechadora: req.body.fechadora,
    latitud: req.body.latitud,
    longitud: req.body.longitud,
    pareja: req.body.pareja,
    usuarios: req.body.usuarios,
  };

  try {
    const result = await planModel.createPlan(planData);
    res.send(result);
  } catch (err) {
    res.status(500).send({ status: 'error', message: 'Error almacenando la información' });
  }
});

router.get('/plan', async (req, res) => {
  try {
    const plans = await planModel.getPlans();
    res.json(plans);
  } catch (err) {
    res.status(500).send({ status: 'error', message: 'Error obteniendo los planes' });
  }
});

module.exports = router;
