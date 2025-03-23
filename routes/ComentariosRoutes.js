const express = require('express');
const router = express.Router();
const ComentarioModel = require('../models/ComentarioModel');
const comentarioModel = new ComentarioModel();

router.post('/comentario', async (req, res) => {
  const comentarioData = {
    texto: req.body.texto,
    autor: req.body.autor,
    referencia: req.body.referencia,
  };

  try {
    const result = await comentarioModel.createComentario(comentarioData);
    res.send(result);
  } catch (err) {
    res.status(500).send({ status: 'error', message: 'Error almacenando la información' });
  }
});

router.get('/comentario', async (req, res) => {
  try {
    const comentarios = await comentarioModel.getComentarios();
    res.json(comentarios);
  } catch (err) {
    res.status(500).send({ status: 'error', message: 'Error obteniendo los comentarios' });
  }
});

module.exports = router;
