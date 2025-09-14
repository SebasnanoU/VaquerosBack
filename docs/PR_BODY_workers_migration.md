Title: feat(workers): Migración a Cloudflare Workers (Hono + jose) + Notion via fetch + /docs

Resumen
- Nueva app Worker (`src/worker.ts`) con Hono.
- Auth Google: verifica ID Token con `jose` y emite JWT (HS256, 2h).
- Rutas: `GET/POST/PATCH /encuentro` (Notion via fetch).
- Docs en `/docs` (Swagger CDN) y `src/openapi.ts`.
- Wrapper Notion por `fetch` nativo (`src/notion.ts`).
- `wrangler.example.toml` (el real se ignora). `.env.example`, `.gitignore` y README actualizados.

Configuración
- Copia ejemplo: `cp wrangler.example.toml wrangler.toml` y completa valores no sensibles.
- Secretos: `wrangler secret put NOTION_API_KEY`, `wrangler secret put JWT_SECRET`.

Cómo probar
1) `npm install`.
2) `npx wrangler dev`.
3) `http://localhost:8787/docs`.

Notas
- No usa Express/dotenv en Workers.
- Mantiene versiones Express en ramas separadas.

