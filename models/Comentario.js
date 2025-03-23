const notion = require('../utils/notion');

class ComentarioModel {
  constructor() {
    this.databaseId = process.env.NOTION_COMENTARIO_DATABASE_ID;
  }

  async createComentario(comentarioData) {
    // Validar comentarioData contra comentarioSchema aquí si es necesario

    const response = await notion.pages.create({
      parent: { database_id: this.databaseId },
      properties: {
        'Texto': { rich_text: [{ text: { content: comentarioData.texto } }] },
        'Autor': { relation: [{ id: comentarioData.autor }] },
        'Referencia': { relation: [{ id: comentarioData.referencia }] },
      },
    });
    return response;
  }

  async getComentarios() {
    const response = await notion.databases.query({
      database_id: this.databaseId,
    });
    return response.results;
  }
}

module.exports = ComentarioModel;
