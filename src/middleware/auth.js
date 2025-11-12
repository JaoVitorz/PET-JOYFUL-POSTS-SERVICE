const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido. Use: Authorization: Bearer <token>'
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Adiciona informações do usuário na requisição
      req.user = {
        userId: decoded.userId || decoded.id,
        email: decoded.email,
        tipo: decoded.tipo
      };
      
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido ou expirado',
        error: err.message
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao autenticar',
      error: error.message
    });
  }
};

module.exports = { authenticate };