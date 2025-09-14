VaquerosBack — API Express con Notion y Swagger UI

Descripción
- API en Node.js + Express para gestionar usuarios, parejas, encuentros, planes y comentarios integrados con Notion.
- Incluye documentación interactiva estilo FastAPI/Swagger disponible en `/docs`.

Requisitos
- Node.js 20+
- npm
- Alternativa: Docker y Docker Compose

Arranque rápido (local)
- Instalar dependencias: `npm install`
- Variables de entorno: crea `.env` con, al menos:
  - `PORT=3000`
  - `JWT_SECRET=...`
  - `NOTION_API_KEY=...`
  - `NOTION_DATABASE_ID_USER=...`
  - `NOTION_DATABASE_ID_PAREJA=...`
  - `NOTION_DATABASE_ID_ENCUENTRO=...`
  - `NOTION_DATABASE_ID_PLAN=...`
  - `NOTION_DATABASE_ID_COMENTARIOS=...`
  - `GOOGLE_CLIENT_ID=...` (si usas login Google)
- Iniciar: `npm start`
- Docs: abre `http://localhost:${PORT}/docs` (por defecto `http://localhost:3000/docs`).

Arranque con Docker
- Construir y levantar: `docker compose up --build -d`
- Variables: usa `.env` en el mismo directorio (mapeado por `docker-compose.yml`).
- Ver logs: `docker compose logs -f`
- Detener: `docker compose down`

Rutas principales
- `GET /users`: lista usuarios (lee de Notion)
- `POST /users`: crea usuario en Notion
- `GET /pareja`: lista parejas
- `POST /pareja`: crea pareja
- `PATCH /pareja/{id}`: actualiza pareja
- `GET /encuentro`: lista encuentros
- `POST /encuentro`: crea encuentro
- `PATCH /encuentro/{id}`: actualiza encuentro
- `GET /plan`: lista planes
- `POST /plan`: crea plan
- `PATCH /plan/{id}`: actualiza plan
- `GET /comentarios`: lista comentarios

Documentación interactiva (Swagger UI)
- Implementada con `swagger-ui-express` y el spec `openapi.yaml`.
- Disponible en `GET /docs` mientras el servidor está corriendo.
- El archivo `openapi.yaml` describe los endpoints y los esquemas de request/response a alto nivel.

Estructura del proyecto
- `index.js`: punto de entrada del servidor
- `routes/*`: routers de cada recurso
- `controllers/*`: controladores (p. ej. auth)
- `utils/*`: utilitarios (Notion, Google Verify)
- `openapi.yaml`: especificación OpenAPI 3 para Swagger UI

Notas y posibles mejoras
- Autenticación Google: validar imports y exposición de rutas (puede requerir montar `AuthRoutes` en `index.js`).
- Propiedad `fotoUrl` en `routes/UserRoutes.js` no está definida; revisar antes de usar ese campo en creación de usuario.
- Completar ejemplos y componentes del `openapi.yaml` a medida que evolucionen los modelos en Notion.

Cloudflare Workers
- No subas `wrangler.toml` al repositorio.
- Usa el ejemplo `wrangler.example.toml`, cópialo y completa valores locales:
  - `cp wrangler.example.toml wrangler.toml`
  - Completa los IDs de Notion y `GOOGLE_CLIENT_ID`.
- Secretos (no en el archivo):
  - `wrangler secret put NOTION_API_KEY`
  - `wrangler secret put JWT_SECRET`
- Desarrollo local:
  - `npm install`
  - `npx wrangler dev`
  - Abre `http://localhost:8787/docs`
