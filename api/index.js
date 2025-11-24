// api/index.js - Vercel Serverless Function
require("dotenv").config();
const app = require("../src/app");
const connectDB = require("../src/config/database");

// Conecta ao MongoDB (com cache para evitar múltiplas conexões)
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    console.log("✅ Usando conexão MongoDB existente");
    return;
  }

  try {
    await connectDB();
    isConnected = true;
    console.log("✅ MongoDB conectado no ambiente Vercel");
  } catch (error) {
    console.error("❌ Erro ao conectar MongoDB:", error);
  }
};

// Handler principal para Vercel
module.exports = async (req, res) => {
  await connectToDatabase();
  return app(req, res);
};
