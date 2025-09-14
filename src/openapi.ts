export const openapiYaml = `openapi: 3.0.3
info:
  title: VaquerosBack API (Workers)
  version: 1.0.0
servers:
  - url: https://{host}
    variables:
      host:
        default: localhost:8787
paths:
  /encuentro:
    get:
      summary: Listar encuentros
      responses:
        '200': { description: OK }
    post:
      summary: Crear encuentro
      responses:
        '201': { description: Creado }
  /encuentro/{id}:
    patch:
      summary: Actualizar encuentro
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '200': { description: OK }
  /auth/google:
    post:
      summary: Intercambia Google ID token por JWT propio
      responses:
        '200': { description: OK }
`;

