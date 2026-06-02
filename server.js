require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 3003;

// Tenta conectar no Mongo
connectDB();

// Servidor inicia independente do Mongo
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📚 Documentação: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});