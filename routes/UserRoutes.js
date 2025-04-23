const express = require('express');
const router = express.Router();
const notion = require('../utils/notion');
const { updatePage } = require('@notionhq/client/build/src/api-endpoints');


// /*
// GET Todos los usuarios
router.get('/', async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID_USER,
    });

    const usuarios = await Promise.all(response.results.map(async page => {
      const props = page.properties;

      // Extraer IDs de pareja
      const parejaIds = props['👗 Pareja']?.relation?.map(p => p.id) || [];

      // Obtener datos de cada pareja
      const parejasData = await Promise.all(parejaIds.map(async (id) => {
        try {
          const parejaPage = await notion.pages.retrieve({ page_id: id });
          const parejaProps = parejaPage.properties;

          return {
            id,
            nombre: parejaProps.nombre?.title?.[0]?.plain_text || '',
            apellido: parejaProps.apellido?.rich_text?.[0]?.plain_text || '',
            apodo: parejaProps.apodo?.rich_text?.[0]?.plain_text || '',
          };
        } catch (e) {
          console.warn(`No se pudo traer pareja con ID ${id}`, e.message);
          return null;
        }
      }));

      return {
        id: page.id,
        nombre: props.nombre?.title?.[0]?.plain_text || '',
        apellido: props.apellido?.rich_text?.[0]?.plain_text || '',
        grupos: props.grupos?.multi_select?.map(g => g.name) || [],
        foto: props.foto?.files?.[0]?.file?.url || '',
        plan: props.plan?.relation?.map(p => p.id) || [],
        parejas: parejasData.filter(p => p !== null),
        esAdmin: props.esAdmin?.checkbox || false,
        correo: props.correo?.email || ''
      };
    }));

    res.json(usuarios);
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});
// */

// POST Crear nuevo usuario
router.post('/', async (req, res) => {
  const { nombre, apellido, correo, esAdmin, parejaIds, grupos, plan, foto } = req.body;

  try {
    const newUser = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_ID_USER,
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
        correo: {
          email: correo
        },
        esAdmin: {
          checkbox: esAdmin || false
        },
        '👗 Pareja': {
          relation: Array.isArray(parejaIds) ? parejaIds.map(id => ({ id })) : []
        },
        grupos: {
          multi_select: Array.isArray(grupos) ? grupos.map(g => ({ name: g })) : []
        },
        plan: {
          relation: Array.isArray(plan) ? plan.map(id => ({ id })) : []
        },
        foto: {
          files: fotoUrl
            ? [{
              name: 'foto_google.jpg',
              type: 'external',
              external: { url: fotoUrl }
            }]
            : []
        }

      }
    });

    res.status(201).json({ message: 'Usuario creado', id: newUser.id });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

/*
router.get('/', async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID_USER,
    });
    res.json(response.results);
  }
  catch (error) {
    console.error('Error al consultar la base de datos:', error);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});
*/
module.exports = router;
