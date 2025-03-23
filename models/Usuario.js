const notion = require('../utils/notion')

class UserModel {
  constructor() {
    this.databaseId = process.env.NOTION_DATABASE_ID;
  }

  async createUser(userData) {
    // Validar userData contra UserSchema aquí si es necesario

    const response = await notion.pages.create({
      parent: { database_id: this.databaseId },
      properties: {
        'Nombre': { title: [{ text: { content: userData.nombre } }] },
        'Apellido': { rich_text: [{ text: { content: userData.apellido } }] },
        'Correo': { email: userData.correo },
        'Foto': { rich_text: [{ text: { content: userData.foto } }] },
        'EsAdmin': { checkbox: userData.esAdmin },
        'Grupos': { multi_select: userData.grupos.map(group => ({ name: group })) },
      },
    });
    return response;
  }

  async getUsers() {
    const response = await notion.databases.query({
      database_id: this.databaseId,
    });
    return response.results;
  }
}

module.exports = UserModel;
