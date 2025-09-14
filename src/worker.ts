import { Hono } from 'hono'
import { jwtVerify, createRemoteJWKSet, SignJWT } from 'jose'
import { notionQueryDatabase, notionCreatePage, notionRetrievePage, notionUpdatePage } from './notion'
import { openapiYaml } from './openapi'

type Bindings = {
  NOTION_API_KEY: string
  NOTION_DATABASE_ID_ENCUENTRO: string
  GOOGLE_CLIENT_ID: string
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Docs minimalistas con Swagger CDN
app.get('/docs', (c) => {
  const html = `<!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>VaquerosBack API Docs</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({ url: '/openapi.yaml', dom_id: '#swagger-ui' });
    </script>
  </body>
  </html>`
  return c.html(html)
})

app.get('/openapi.yaml', (c) => c.text(openapiYaml, 200, { 'Content-Type': 'text/yaml' }))

// Auth con Google: verifica ID token y emite JWT propio
const JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))
app.post('/auth/google', async (c) => {
  const { id_token } = await c.req.json().catch(() => ({})) as { id_token?: string }
  if (!id_token) return c.json({ error: 'id_token requerido' }, 400)

  const { payload } = await jwtVerify(id_token, JWKS, { audience: c.env.GOOGLE_CLIENT_ID })
  const user = {
    id: payload.sub as string,
    email: payload.email as string,
    nombre: (payload as any).name as string,
    foto: (payload as any).picture as string
  }

  const secret = new TextEncoder().encode(c.env.JWT_SECRET)
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('2h')
    .sign(secret)

  return c.json({ token, user })
})

// Encuentro: GET lista reducida
app.get('/encuentro', async (c) => {
  const db = c.env.NOTION_DATABASE_ID_ENCUENTRO
  const data = await notionQueryDatabase(c.env, db)
  const items = (data.results ?? []).map((page: any) => {
    const p = page.properties || {}
    return {
      id: page.id,
      fechaInicio: p.fechaInicio?.date?.start ?? null,
      fechaFin: p.fechaFin?.date?.start ?? null,
      calificacion: p.calificacion?.number ?? null,
      repetiria: p.repetiria?.checkbox ?? false,
      memorable: p.memorable?.checkbox ?? false,
      comentario: p.comentario?.title?.[0]?.plain_text || '',
      latitud: p.latitud?.number ?? null,
      longitud: p.longitud?.number ?? null,
      iniciativa: p.iniciativa?.select?.name || '',
      pareja: p.pareja?.relation?.map((r: any) => r.id) || [],
      plan: p.plan?.relation?.map((r: any) => r.id) || [],
      usuario: p.usuario?.relation?.map((r: any) => r.id) || []
    }
  })
  return c.json(items)
})

// Encuentro: POST crear
app.post('/encuentro', async (c) => {
  const body = await c.req.json()
  const db = c.env.NOTION_DATABASE_ID_ENCUENTRO
  const payload = {
    parent: { database_id: db },
    properties: {
      comentario: { title: [{ text: { content: body.comentario || '' } }] },
      fechaInicio: body.fechaInicio ? { date: { start: body.fechaInicio } } : undefined,
      fechaFin: body.fechaFin ? { date: { start: body.fechaFin } } : undefined,
      calificacion: typeof body.calificacion === 'number' ? { number: body.calificacion } : undefined,
      repetiria: typeof body.repetiria === 'boolean' ? { checkbox: body.repetiria } : undefined,
      memorable: typeof body.memorable === 'boolean' ? { checkbox: body.memorable } : undefined,
      latitud: typeof body.latitud === 'number' ? { number: body.latitud } : undefined,
      longitud: typeof body.longitud === 'number' ? { number: body.longitud } : undefined,
      iniciativa: body.iniciativa ? { select: { name: body.iniciativa } } : undefined,
      pareja: Array.isArray(body.pareja) ? { relation: body.pareja.map((id: string) => ({ id })) } : undefined,
      plan: Array.isArray(body.plan) ? { relation: body.plan.map((id: string) => ({ id })) } : undefined,
      usuario: Array.isArray(body.usuario) ? { relation: body.usuario.map((id: string) => ({ id })) } : undefined
    }
  }
  const created = await notionCreatePage(c.env, payload)
  return c.json({ message: 'Encuentro creado', id: created.id }, 201)
})

// Encuentro: PATCH actualizar
app.patch('/encuentro/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const props: any = {}

  if (body.comentario !== undefined) props.comentario = { title: [{ text: { content: body.comentario || '' } }] }
  if (body.fechaInicio !== undefined) props.fechaInicio = { date: { start: body.fechaInicio } }
  if (body.fechaFin !== undefined) props.fechaFin = { date: { start: body.fechaFin } }
  if (typeof body.calificacion === 'number') props.calificacion = { number: body.calificacion }
  if (typeof body.repetiria === 'boolean') props.repetiria = { checkbox: body.repetiria }
  if (typeof body.memorable === 'boolean') props.memorable = { checkbox: body.memorable }
  if (typeof body.latitud === 'number') props.latitud = { number: body.latitud }
  if (typeof body.longitud === 'number') props.longitud = { number: body.longitud }
  if (body.iniciativa !== undefined) props.iniciativa = { select: { name: body.iniciativa } }
  if (Array.isArray(body.pareja)) props.pareja = { relation: body.pareja.map((x: string) => ({ id: x })) }
  if (Array.isArray(body.plan)) props.plan = { relation: body.plan.map((x: string) => ({ id: x })) }
  if (Array.isArray(body.usuario)) props.usuario = { relation: body.usuario.map((x: string) => ({ id: x })) }

  const updated = await notionUpdatePage(c.env, id, { properties: props })
  return c.json({ message: 'Encuentro actualizado', id: updated.id })
})

// Root -> docs
app.get('/', (c) => c.redirect('/docs'))

export default app

export const fetch: ExportedHandler['fetch'] = (request, env, ctx) => app.fetch(request, env, ctx)

