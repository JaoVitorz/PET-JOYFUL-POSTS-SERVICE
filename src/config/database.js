const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️ MONGODB_URI não definida. Iniciando sem banco.');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);

  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);

    // NÃO derruba o servidor
  }
};

module.exports = connectDB;