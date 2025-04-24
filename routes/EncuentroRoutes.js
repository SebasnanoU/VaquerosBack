const express = require('express');
const router = express.Router();
const notion = require('../utils/notion');

router.get('/', async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID_ENCUENTRO,
    });
    res.json(response.results);
  }
  catch (error) {
    console.error('Error al consultar la base de datos:', error);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});

module.exports = router;