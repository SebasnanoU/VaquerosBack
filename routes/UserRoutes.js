const express = require('express');
const router = express.Router();
const UserModel = require('./models/UserModel');
const userModel = new UserModel();

router.post('/user', async (req, res) => {
  const userData = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    correo: req.body.correo,
    foto: req.body.foto,
    esAdmin: req.body.esAdmin,
    grupos: req.body.grupos,
  };

  try {
    const result = await userModel.createUser(userData);
    res.send(result);
  } catch (err) {
    res.status(500).send({ status: 'error', message: 'Error almacenando la información' });
  }
});

router.get('/user', async (req, res) => {
  try {
    const users = await userModel.getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).send({ status: 'error', message: 'Error obteniendo los usuarios' });
  }
});

module.exports = router;
