const express = require('express');
const router = express.Router();
const notion = require('../utils/notion');

router.get('/', async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID_PAREJA,
    });

    // 🔽 Aquí reduces la respuesta:
    const parejasReducidas = response.results.map(page => {
      const props = page.properties;
      return {
        id: page.id,
        nombre: props.nombre?.title?.[0]?.plain_text || '',
        apellido: props.apellido?.rich_text?.[0]?.plain_text || '',
        apodo: props.apodo?.rich_text?.[0]?.plain_text || '',
        usuariosAsociados: props.usuariosAsociados?.relation?.map(r => r.id) || [],
        encuentro: props.Encuentro?.relation?.map(r => r.id) || []
      };
    });

    res.json(parejasReducidas);

  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});

module.exports = router;

