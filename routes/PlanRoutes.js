const express = require('express');
const router = express.Router();
const notion = require('../utils/notion');

/*
router.get('/', async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID_PLAN,
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
      database_id: process.env.NOTION_DATABASE_ID_PLAN,
    });

    const planesReducidos = await Promise.all(response.results.map(async page => {
      const props = page.properties;

      // Obtener datos de usuario relacionado
      const usuarioIds = props.usuarios?.relation?.map(r => r.id) || [];
      const usuarios = await Promise.all(usuarioIds.map(async (id) => {
        try {
          const usuario = await notion.pages.retrieve({ page_id: id });
          const p = usuario.properties;
          return {
            id,
            nombre: p.nombre?.title?.[0]?.plain_text || '',
            apellido: p.apellido?.rich_text?.[0]?.plain_text || ''
          };
        } catch {
          return { id, nombre: '', apellido: '' };
        }
      }));

      // Obtener datos de pareja relacionada
      const parejaIds = props.pareja?.relation?.map(r => r.id) || [];
      const parejas = await Promise.all(parejaIds.map(async (id) => {
        try {
          const pareja = await notion.pages.retrieve({ page_id: id });
          const p = pareja.properties;
          return {
            id,
            nombre: p.nombre?.title?.[0]?.plain_text || '',
            apellido: p.apellido?.rich_text?.[0]?.plain_text || '',
            apodo: p.apodo?.rich_text?.[0]?.plain_text || ''
          };
        } catch {
          return { id, nombre: '', apellido: '', apodo: '' };
        }
      }));

      // Obtener datos de encuentro relacionado
      const encuentroIds = props['🛏️ Encuentro']?.relation?.map(r => r.id) || [];
      const encuentros = await Promise.all(encuentroIds.map(async (id) => {
        try {
          const encuentro = await notion.pages.retrieve({ page_id: id });
          const p = encuentro.properties;
          return {
            id,
            comentario: p.comentario?.title?.[0]?.plain_text || ''
          };
        } catch {
          return { id, comentario: '' };
        }
      }));

      return {
        id: page.id,
        detalles: props.detalles?.title?.[0]?.plain_text || '',
        tipoPlan: props.tipoPlan?.select?.name || '',
        fechaHora: props.fechaHora?.date?.start || null,
        latitud: props.latitud?.number ?? null,
        longitud: props.longitud?.number ?? null,
        usuarios,
        parejas,
        encuentros
      };
    }));

    res.json(planesReducidos);

  } catch (error) {
    console.error('Error al consultar la base de datos de planes:', error);
    res.status(500).json({ error: 'Error al consultar la base de datos de planes' });
  }
});

router.post('/', async (req, res) => {
  const {
    detalles,
    tipoPlan,
    fechaHora,
    latitud,
    longitud,
    usuarios,
    pareja,
    encuentros
  } = req.body;

  try {
    const nuevoPlan = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_ID_PLAN,
      },
      properties: {
        detalles: {
          title: [{ text: { content: detalles || '' } }]
        },
        tipoPlan: tipoPlan ? {
          select: { name: tipoPlan }
        } : undefined,
        fechaHora: fechaHora ? {
          date: { start: fechaHora }
        } : undefined,
        latitud: typeof latitud === 'number' ? { number: latitud } : undefined,
        longitud: typeof longitud === 'number' ? { number: longitud } : undefined,
        usuarios: Array.isArray(usuarios) ? {
          relation: usuarios.map(id => ({ id }))
        } : undefined,
        pareja: Array.isArray(pareja) ? {
          relation: pareja.map(id => ({ id }))
        } : undefined,
        '🛏️ Encuentro': Array.isArray(encuentros) ? {
          relation: encuentros.map(id => ({ id }))
        } : undefined
      }
    });

    res.status(201).json({ message: 'Plan creado', id: nuevoPlan.id });

  } catch (error) {
    console.error('Error al crear el plan:', error);
    res.status(500).json({ error: 'Error al crear el plan' });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    detalles,
    tipoPlan,
    fechaHora,
    latitud,
    longitud,
    usuarios,
    pareja,
    encuentros
  } = req.body;

  try {
    const properties = {};

    if (detalles !== undefined) {
      properties.detalles = {
        title: [{ text: { content: detalles || '' } }]
      };
    }

    if (tipoPlan !== undefined) {
      properties.tipoPlan = {
        select: { name: tipoPlan }
      };
    }

    if (fechaHora !== undefined) {
      properties.fechaHora = {
        date: { start: fechaHora }
      };
    }

    if (typeof latitud === 'number') {
      properties.latitud = { number: latitud };
    }

    if (typeof longitud === 'number') {
      properties.longitud = { number: longitud };
    }

    if (Array.isArray(usuarios)) {
      properties.usuarios = {
        relation: usuarios.map(id => ({ id }))
      };
    }

    if (Array.isArray(pareja)) {
      properties.pareja = {
        relation: pareja.map(id => ({ id }))
      };
    }

    if (Array.isArray(encuentros)) {
      properties['🛏️ Encuentro'] = {
        relation: encuentros.map(id => ({ id }))
      };
    }

    const updatedPlan = await notion.pages.update({
      page_id: id,
      properties
    });

    res.json({ message: 'Plan actualizado', id: updatedPlan.id });

  } catch (error) {
    console.error('Error al actualizar el plan:', error);
    res.status(500).json({ error: 'Error al actualizar el plan' });
  }
});


module.exports = router;
