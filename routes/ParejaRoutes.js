const express = require('express');
const router = express.Router();
const notion = require('../utils/notion');

router.get('/', async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID_PAREJA,
    });

    const parejasReducidas = await Promise.all(response.results.map(async page => {
      const props = page.properties;

      // Traer los datos de cada usuario asociado
      const usuariosAsociadosIds = props.usuariosAsociados?.relation?.map(r => r.id) || [];
      const usuariosAsociadosData = await Promise.all(usuariosAsociadosIds.map(async (userId) => {
        try {
          const usuario = await notion.pages.retrieve({ page_id: userId });
          const userProps = usuario.properties;
          return {
            id: userId,
            nombre: userProps.nombre?.title?.[0]?.plain_text || '',
            apellido: userProps.apellido?.rich_text?.[0]?.plain_text || ''
          };
        } catch (e) {
          return { id: userId, nombre: '', apellido: '' };
        }
      }));

      // Traer los datos de cada encuentro asociado
      const encuentrosAsociadosIds = props.Encuentro?.relation?.map(r => r.id) || [];
      const encuentrosAsociadosData = await Promise.all(encuentrosAsociadosIds.map(async (encuentroID) => {
        try {
          const encuentro = await notion.pages.retrieve({ page_id: encuentroID });
          const encuentroProps = encuentro.properties;
          return {
            id: encuentroID,
            comentario: encuentroProps.comentario?.title?.[0]?.plain_text || ''
          };
        } catch (e) {
          return { id: encuentroID, comentario: '' };
        }
      }));

      return {
        id: page.id,
        nombre: props.nombre?.title?.[0]?.plain_text || '',
        apellido: props.apellido?.rich_text?.[0]?.plain_text || '',
        apodo: props.apodo?.rich_text?.[0]?.plain_text || '',
        usuariosAsociados: usuariosAsociadosData,
        encuentro: encuentrosAsociadosData
      };
    }));

    res.json(parejasReducidas);

  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});

module.exports = router;
