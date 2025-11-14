# PET-JOYFUL-POSTS-SERVICE

Microserviço responsável pelo gerenciamento de postagens do Pet Joyful.

## 🚀 Instalação
```bash
# Clonar repositório
git clone https://github.com/JaoVitorz/PET-JOYFUL-POSTS-SERVICE.git
cd pet-joyful-posts-service

# Instalar dependências
npm install

# Configurar .env
cp .env.example .env

# Executar
npm run dev
```

## � Documentação Swagger

A documentação interativa está disponível em:
```
http://localhost:3003/api-docs
```

### 🔑 Gerar Token Bearer para o Swagger

Para acessar os endpoints protegidos no Swagger, você precisa gerar um token JWT.

#### Opção 1: Usando o Terminal (Recomendado)

Execute o seguinte comando no terminal:

```bash
node -e "const jwt = require('jsonwebtoken'); const secret = process.env.JWT_SECRET; const token = jwt.sign({userId: '507f1f77bcf86cd799439011', email: 'usuario@test.com', tipo: 'user'}, secret, {expiresIn: '24h'}); console.log('Bearer ' + token);"
```

Copie o token que será exibido no terminal.

#### Opção 2: Criar um Script

Crie um arquivo `generate-token.js` na raiz do projeto:

```javascript
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET;
const token = jwt.sign(
  {
    userId: '507f1f77bcf86cd799439011',
    email: 'usuario@test.com',
    tipo: 'user'
  },
  secret,
  { expiresIn: '24h' }
);

console.log('✅ TOKEN GERADO COM SUCESSO:\n');
console.log(token);
console.log('\n📋 Use no Swagger: Authorization: Bearer ' + token);
```

Execute com:
```bash
node generate-token.js
```

### 🔐 Usar o Token no Swagger

1. Abra http://localhost:3003/api-docs
2. Clique no botão **"Authorize"** (ícone de cadeado)
3. Na janela que abrir, cole o token no formato:
   ```
   Bearer SEU_TOKEN_AQUI
   ```
   (Incluindo a palavra "Bearer ")
4. Clique em **"Authorize"** e depois em **"Close"**
5. Agora você consegue testar todos os endpoints protegidos ✅

**⏰ Validade:** O token expira em 24 horas. Se expirar, gere um novo!

## �📋 Endpoints

- `POST /api/posts` - Criar postagem (🔒 Requer autenticação)
- `GET /api/posts` - Listar postagens
- `GET /api/posts/:id` - Buscar postagem
- `PUT /api/posts/:id` - Atualizar postagem (🔒 Requer autenticação)
- `DELETE /api/posts/:id` - Deletar postagem (🔒 Requer autenticação)
- `POST /api/posts/:id/like` - Curtir postagem (🔒 Requer autenticação)
- `POST /api/posts/:id/comment` - Comentar postagem (🔒 Requer autenticação)

## 🔧 Tecnologias

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer + Cloudinary
- CORS

## 📝 Licença

ISC

