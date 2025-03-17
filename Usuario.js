const notion = require("../notionClient");
const databaseID = process.env.NOTION_DATABASE_ID;

class Usuario {
  constructor(id, nombre, apellido, correo, foto, esAdmin, grupos, pareja, plan) {
    this.id = id,
      this.nombre = nombre;
    this.apellido = apellido;
    this.correo = correo;
    this.foto = foto;
    this.esAdmin = esAdmin;
    this.grupos = grupos;
    this.pareja = pareja;
    this.plan = plan;
  }
}

module.exports = Usuario;
