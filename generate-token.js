const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET;

if (!secret) {
  console.error('❌ Erro: JWT_SECRET não está configurado no .env');
  process.exit(1);
}

const token = jwt.sign(
  {
    userId: '507f1f77bcf86cd799439011',
    email: 'usuario@test.com',
    tipo: 'user'
  },
  secret,
  { expiresIn: '24h' }
);

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║           ✅ TOKEN GERADO COM SUCESSO!                        ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

console.log('📋 TOKEN (copie isto para usar no Swagger):\n');
console.log(`${token}\n`);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('🔐 COMO USAR NO SWAGGER:\n');
console.log('1. Abra: http://localhost:3003/api-docs');
console.log('2. Clique em "Authorize" (ícone de cadeado no topo)');
console.log('3. Cole isto no campo de texto:\n');
console.log(`Bearer ${token}\n`);
console.log('4. Clique em "Authorize" e depois em "Close"\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📌 INFORMAÇÕES DO TOKEN:\n');
console.log('⏰ Validade: 24 horas');
console.log('👤 User ID: 507f1f77bcf86cd799439011');
console.log('📧 Email: usuario@test.com');
console.log('🎯 Tipo: user\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Salvar token em um arquivo para referência
const fs = require('fs');
const tokenInfo = {
  token: token,
  geradoEm: new Date().toISOString(),
  expiraEm: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  usarNoSwagger: `Bearer ${token}`
};

fs.writeFileSync(
  'token.json',
  JSON.stringify(tokenInfo, null, 2)
);

console.log('💾 Token salvo também em: token.json\n');
