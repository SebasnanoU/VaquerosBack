require("dotenv").config();
const { Client } = require("@notionhq/client");
const { response } = require("express");

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function testConnection() {
  try {
    const res = await notion.users.me();
    console.log("Conexion exitosa");
    console.log("Usuario: ", response.name)
  } catch (error) {
    console.error("Error ", error.message);
  }
}

testConnection();
