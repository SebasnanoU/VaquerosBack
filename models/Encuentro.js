const notion = require('../utils/notion');

class EncuentroModel {
  constructor() {
    this.databaseId = process.env.NOTION_ENCUENTRO_DATABASE_ID;
  }

  async createEncuentro(encuentroData) {
    // Validar encuentroData contra encuentroSchema aquí si es necesario

    const response = await notion.pages.create({
      parent: { database_id: this.databaseId },
      properties: {
        'Fecha Inicio': { date: { start: encuentroData.fechaInicio } },
        'Fecha Fin': { date: { start: encuentroData.fechaFin } },
        'Calificación': { number: encuentroData.calificacion },
        'Repetiría': { checkbox: encuentroData.repetiria },
        'Memorable': { checkbox: encuentroData.memorable },
        'Comentario': { rich_text: [{ text: { content: encuentroData.comentario } }] },
        'Latitud': { number: encuentroData.latitud },
        'Longitud': { number: encuentroData.longitud },
        'Plan': { relation: [{ id: encuentroData.plan }] },
        'Pareja': { relation: [{ id: encuentroData.pareja }] },
        'Usuario': { relation: [{ id: encuentroData.usuario }] },
      },
    });
    return response;
  }

  async getEncuentros() {
    const response = await notion.databases.query({
      database_id: this.databaseId,
    });
    return response.results;
  }
}

module.exports = EncuentroModel;
