const notion = require('../utils/notion');

class ParejaModel {
  constructor() {
    this.databaseId = process.env.NOTION_PAREJA_DATABASE_ID;
  }

  async createPareja(parejaData) {
    // Validar parejaData contra parejaSchema aquí si es necesario

    const response = await notion.pages.create({
      parent: { database_id: this.databaseId },
      properties: {
        'Nombre': { title: [{ text: { content: parejaData.nombre } }] },
        'Apellido': { rich_text: [{ text: { content: parejaData.apellido } }] },
        'Red Social': { rich_text: [{ text: { content: parejaData.redSocial } }] },
        'Apodo': { rich_text: [{ text: { content: parejaData.apodo } }] },
        'Calienta Huevos': { checkbox: parejaData.calientaHuevos },
        'Usuarios Asociados': { multi_select: parejaData.usuariosAsociados.map(user => ({ name: user })) },
      },
    });
    return response;
  }

  async getParejas() {
    const response = await notion.databases.query({
      database_id: this.databaseId,
    });
    return response.results;
  }
}

module.exports = ParejaModel;
