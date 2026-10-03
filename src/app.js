const express = require("express");
const cors = require("cors");
const postRoutes = require("./routes/postRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.output.json");

const app = express();

// Middlewares globais
app.use(
  cors({
    origin: [
      "https://pet-joyful-projeto-integrador-next-js-ay4p-kzbr9m9bu.vercel.app",
      "https://pet-joyful-posts-service.onrender.com",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3003",
      "http://localhost:8081"

    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "x-api-key",
      "accept",
    ],
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rota de health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Pet Joyful Posts Service",
    timestamp: new Date().toISOString(),
  });
});

// Rotas da API
app.use("/api", postRoutes);

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Rota não encontrada",
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error("Erro:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Erro interno do servidor",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

module.exports = app;
