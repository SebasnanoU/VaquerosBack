const notion = require('../utils/notion');

class PlanModel {
  constructor() {
    this.databaseId = process.env.NOTION_PLAN_DATABASE_ID;
  }

  async createPlan(planData) {
    // Validar planData contra planSchema aquí si es necesario

    const response = await notion.pages.create({
      parent: { database_id: this.databaseId },
      properties: {
        'Tipo de Plan': { multi_select: planData.tipoPlan.map(type => ({ name: type })) },
        'Detalles': { rich_text: [{ text: { content: planData.detalles } }] },
        'Fechadora': { date: { start: planData.fechadora } },
        'Latitud': { number: planData.latitud },
        'Longitud': { number: planData.longitud },
        'Pareja': { rich_text: [{ text: { content: planData.pareja } }] },
        'Usuarios': { multi_select: planData.usuarios.map(user => ({ name: user })) },
      },
    });
    return response;
  }

  async getPlans() {
    const response = await notion.databases.query({
      database_id: this.databaseId,
    });
    return response.results;
  }
}

module.exports = PlanModel;
