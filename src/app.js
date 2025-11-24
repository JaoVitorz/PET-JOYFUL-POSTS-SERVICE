const express = require("express");
const cors = require("cors");
const postRoutes = require("./routes/postRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.output.json");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(origin => origin.trim())
  : ["http://localhost:3000", "https://pet-joyful-projeto-integrador-next-js-ay4p-kzbr9m9bu.vercel.app"];

console.log("🔒 Origens permitidas:", allowedOrigins);
console.log("🌍 Ambiente:", process.env.NODE_ENV || "development");

const corsOptions = {
  origin: function (origin, callback) {
    console.log("📡 Requisição de origem:", origin);
    
    // Permite requisições sem origin (como Postman, mobile apps, etc)
    if (!origin) {
      console.log("✅ Permitido: Sem origem (Postman/API)");
      return callback(null, true);
    }

    // Permite todas as origens se configurado com *
    if (allowedOrigins.includes("*")) {
      console.log("✅ Permitido: Todas as origens (*)");
      return callback(null, true);
    }

    // Em desenvolvimento, permite todas as origens localhost
    if (process.env.NODE_ENV !== "production") {
      console.log("✅ Permitido: Modo desenvolvimento");
      return callback(null, true);
    }

    // Verifica se a origem está na lista de permitidas
    if (allowedOrigins.includes(origin)) {
      console.log("✅ Permitido: Origem na lista permitida");
      callback(null, true);
    } else {
      console.log("❌ Bloqueado: Origem não permitida");
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  exposedHeaders: ["Authorization"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

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
