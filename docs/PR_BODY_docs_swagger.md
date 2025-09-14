Title: Docs: Swagger UI en /docs y OpenAPI; README actualizado

Resumen
- Añade `openapi.yaml` y monta Swagger UI en `GET /docs`.
- Actualiza `README` con uso, variables y rutas.
- Dependencias nuevas: `swagger-ui-express`, `yamljs`.

Detalles
- `index.js` carga `openapi.yaml` y sirve `/docs`.
- Redirección desde `/` a `/docs` si existe el spec.

Cómo probar
1) `npm install`.
2) `npm start`.
3) Abrir `http://localhost:3000/docs`.

Notas
- El spec es base y puede ampliarse con esquemas y ejemplos.

