const express = require('express');
const router = express.Router();
const notion = require('../utils/notion');

/*
router.get('/', async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID_COMENTARIOS,
    });
    res.json(response.results);
  }
  catch (error) {
    console.error('Error al consultar la base de datos:', error);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});
*/

router.get('/', async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID_COMENTARIOS,
    });

    const comentariosReducidos = await Promise.all(response.results.map(async page => {
      const props = page.properties;

      // Relaciones: autor
      const autorIds = props.autor?.relation?.map(r => r.id) || [];
      const autorData = await Promise.all(autorIds.map(async id => {
        try {
          const autor = await notion.pages.retrieve({ page_id: id });
          const p = autor.properties;
          return {
            id,
            nombre: p.nombre?.title?.[0]?.plain_text || '',
            apellido: p.apellido?.rich_text?.[0]?.plain_text || ''
          };
        } catch {
          return { id, nombre: '', apellido: '' };
        }
      }));

      // Relaciones: referencia
      const referenciaIds = props.referencia?.relation?.map(r => r.id) || [];
      const referenciaData = await Promise.all(referenciaIds.map(async id => {
        try {
          const ref = await notion.pages.retrieve({ page_id: id });
          const p = ref.properties;
          return {
            id,
            nombre: p.nombre?.title?.[0]?.plain_text || '',
            apellido: p.apellido?.rich_text?.[0]?.plain_text || ''
          };
        } catch {
          return { id, nombre: '', apellido: '' };
        }
      }));

      return {
        id: page.id,
        texto: props.texto?.title?.[0]?.plain_text || '',
        autor: autorData,
        referencia: referenciaData
      };
    }));

    res.json(comentariosReducidos);

  } catch (error) {
    console.error('Error al consultar comentarios:', error);
    res.status(500).json({ error: 'Error al consultar comentarios' });
  }
});


module.exports = router;
