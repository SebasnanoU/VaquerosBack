Title: Dockerize app: Dockerfile, docker-compose y guía de ejecución

Resumen
- Añade `Dockerfile`, `docker-compose.yml` y `.dockerignore`.
- Agrega script `start` en `package.json`.
- Incluye `.env.example` para facilitar configuración.

Detalles
- Imagen base: `node:20-alpine`.
- Expone puerto `3000` con `npm start`.
- `docker-compose.yml` mapea `${PORT:-3000}:3000` y carga `.env`.

Cómo probar
1) `cp .env.example .env` y completa valores.
2) `docker compose up --build -d`.
3) Abrir `http://localhost:3000` (docs en `/docs` si aplica).
4) Logs: `docker compose logs -f`.

Notas
- `.env` está ignorado por Git.
- No hay cambios funcionales en el API, solo empaquetado.

