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

router.post('/', async (req, res) => {
  const { nombre, apellido, apodo, usuariosAsociados, encuentro } = req.body;

  try {
    const nuevaPareja = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_ID_PAREJA,
      },
      properties: {
        nombre: {
          title: [
            {
              text: { content: nombre }
            }
          ]
        },
        apellido: {
          rich_text: [
            {
              text: { content: apellido }
            }
          ]
        },
        apodo: {
          rich_text: [
            {
              text: { content: apodo || '' }
            }
          ]
        },
        usuariosAsociados: {
          relation: Array.isArray(usuariosAsociados)
            ? usuariosAsociados.map(id => ({ id }))
            : []
        },
        Encuentro: {
          relation: Array.isArray(encuentro)
            ? encuentro.map(id => ({ id }))
            : []
        }
      }
    });

    res.status(201).json({ message: 'Pareja creada', id: nuevaPareja.id });
  } catch (error) {
    console.error('Error al crear la pareja:', error);
    res.status(500).json({ error: 'Error al crear la pareja' });
  }
});


router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    apellido,
    apodo,
    usuariosAsociados,
    encuentro
  } = req.body;

  try {
    const properties = {};

    if (nombre !== undefined) {
      properties.nombre = {
        title: [{ text: { content: nombre } }]
      };
    }

    if (apellido !== undefined) {
      properties.apellido = {
        rich_text: [{ text: { content: apellido } }]
      };
    }

    if (apodo !== undefined) {
      properties.apodo = {
        rich_text: [{ text: { content: apodo || '' } }]
      };
    }

    if (Array.isArray(usuariosAsociados)) {
      properties.usuariosAsociados = {
        relation: usuariosAsociados.map(id => ({ id }))
      };
    }

    if (Array.isArray(encuentro)) {
      properties.Encuentro = {
        relation: encuentro.map(id => ({ id }))
      };
    }

    const updatedPage = await notion.pages.update({
      page_id: id,
      properties
    });

    res.json({ message: 'Pareja actualizada', id: updatedPage.id });
  } catch (error) {
    console.error('Error al actualizar la pareja:', error);
    res.status(500).json({ error: 'Error al actualizar la pareja' });
  }
});


module.exports = router;
