const express = require('express');
const router = express.Router();
const notion = require('../utils/notion');

/*
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
*/

router.get('/', async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID_ENCUENTRO,
    });

    const encuentrosReducidos = response.results.map(page => {
      const props = page.properties;

      return {
        id: page.id,
        fechaInicio: props.fechaInicio?.date?.start || null,
        fechaFin: props.fechaFin?.date?.start || null,
        calificacion: props.calificacion?.number ?? null,
        repetiria: props.repetiria?.checkbox ?? false,
        memorable: props.memorable?.checkbox ?? false,
        comentario: props.comentario?.title?.[0]?.plain_text || '',
        latitud: props.latitud?.number ?? null,
        longitud: props.longitud?.number ?? null,
        iniciativa: props.iniciativa?.select?.name || '',
        pareja: props.pareja?.relation?.map(r => r.id) || [],
        plan: props.plan?.relation?.map(r => r.id) || [],
        usuario: props.usuario?.relation?.map(r => r.id) || []
      };
    });

    res.json(encuentrosReducidos);

  } catch (error) {
    console.error('Error al consultar la base de datos de encuentros:', error);
    res.status(500).json({ error: 'Error al consultar la base de datos de encuentros' });
  }
});

router.post('/', async (req, res) => {
  const {
    fechaInicio,
    fechaFin,
    calificacion,
    repetiria,
    memorable,
    comentario,
    latitud,
    longitud,
    iniciativa,
    pareja,
    plan,
    usuario
  } = req.body;

  try {
    const nuevoEncuentro = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_ID_ENCUENTRO,
      },
      properties: {
        comentario: {
          title: [
            {
              text: { content: comentario || '' }
            }
          ]
        },
        fechaInicio: {
          date: fechaInicio ? { start: fechaInicio } : null
        },
        fechaFin: {
          date: fechaFin ? { start: fechaFin } : null
        },
        calificacion: {
          number: typeof calificacion === 'number' ? calificacion : null
        },
        repetiria: {
          checkbox: repetiria ?? false
        },
        memorable: {
          checkbox: memorable ?? false
        },
        latitud: {
          number: typeof latitud === 'number' ? latitud : null
        },
        longitud: {
          number: typeof longitud === 'number' ? longitud : null
        },
        iniciativa: {
          select: iniciativa ? { name: iniciativa } : null
        },
        pareja: {
          relation: Array.isArray(pareja) ? pareja.map(id => ({ id })) : []
        },
        plan: {
          relation: Array.isArray(plan) ? plan.map(id => ({ id })) : []
        },
        usuario: {
          relation: Array.isArray(usuario) ? usuario.map(id => ({ id })) : []
        }
      }
    });

    res.status(201).json({ message: 'Encuentro creado', id: nuevoEncuentro.id });
  } catch (error) {
    console.error('Error al crear el encuentro:', error);
    res.status(500).json({ error: 'Error al crear el encuentro' });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    fechaInicio,
    fechaFin,
    calificacion,
    repetiria,
    memorable,
    comentario,
    latitud,
    longitud,
    iniciativa,
    pareja,
    plan,
    usuario
  } = req.body;

  try {
    const properties = {};

    if (comentario !== undefined) {
      properties.comentario = {
        title: [{ text: { content: comentario || '' } }]
      };
    }

    if (fechaInicio) {
      properties.fechaInicio = {
        date: { start: fechaInicio }
      };
    }

    if (fechaFin) {
      properties.fechaFin = {
        date: { start: fechaFin }
      };
    }

    if (typeof calificacion === 'number') {
      properties.calificacion = {
        number: calificacion
      };
    }

    if (typeof repetiria === 'boolean') {
      properties.repetiria = {
        checkbox: repetiria
      };
    }

    if (typeof memorable === 'boolean') {
      properties.memorable = {
        checkbox: memorable
      };
    }

    if (typeof latitud === 'number') {
      properties.latitud = {
        number: latitud
      };
    }

    if (typeof longitud === 'number') {
      properties.longitud = {
        number: longitud
      };
    }

    if (iniciativa) {
      properties.iniciativa = {
        select: { name: iniciativa }
      };
    }

    if (Array.isArray(pareja)) {
      properties.pareja = {
        relation: pareja.map(id => ({ id }))
      };
    }

    if (Array.isArray(plan)) {
      properties.plan = {
        relation: plan.map(id => ({ id }))
      };
    }

    if (Array.isArray(usuario)) {
      properties.usuario = {
        relation: usuario.map(id => ({ id }))
      };
    }

    const updated = await notion.pages.update({
      page_id: id,
      properties
    });

    res.json({ message: 'Encuentro actualizado', id: updated.id });

  } catch (error) {
    console.error('Error al actualizar el encuentro:', error);
    res.status(500).json({ error: 'Error al actualizar el encuentro' });
  }
});

module.exports = router;