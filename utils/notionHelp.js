const { text } = require("express");
const notion = require("../notionClient");

class notionHelp {
  constructor(databaseId) {
    this.databaseId = databaseId;
  }

  async getAll() {
    const res = await notion.databases.query({ database_id: this.databaseId })
    return res.results;
  }

  async findByPropertties(property, value) {
    const res = await notion.databases.query({
      database_id: this.databaseId,
      filter: { property, text: { equals: values } }
    });
    return res.results.length > 0 ? res.results[0] : null;
  }

  async create(properties) {
    return await notion.pages.create({
      parent: { database_id: this.databaseId },
      properties
    });
  }
}

module.exports = notionHelp;
