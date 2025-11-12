# 📚 Pet Joyful Posts Service - Instruções de Uso

## 🚀 Iniciando o Serviço

### 1. Instalar Dependências
```bash
npm install
```

### 2. Iniciar o Servidor

**Modo Desenvolvimento (com auto-reload):**
```bash
npm run dev
```

**Modo Produção:**
```bash
npm start
```

O servidor rodará na porta **3003** por padrão.

**Saída esperada:**
```
🚀 Servidor rodando na porta 3003
📚 Documentação: http://localhost:3003/api-docs
🏥 Health check: http://localhost:3003/health
✅ MongoDB conectado: localhost
```

---

## 📖 Acessando a Documentação Swagger

### URL
```
http://localhost:3003/api-docs
```

### Como Autenticar no Swagger

1. Abra a URL acima no navegador
2. Clique no botão **"Authorize"** (ícone de cadeado no canto superior direito)
3. Na janela que abrir, você verá um campo para inserir o token
4. **Copie e cole exatamente** (incluindo a palavra "Bearer"):
   ```
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJlbWFpbCI6InVzdWFyaW9AdGVzdC5jb20iLCJ0aXBvIjoidXNlciIsImlhdCI6MTc2MjkwODU3MCwiZXhwIjoxNzYyOTk0OTcwfQ.UZAhVLIA4Uy0izBA-sYf3njv7JbDGZU4Mg5q3VolVW8
   ```
5. Clique em **"Authorize"** e depois em **"Close"**
6. Agora você consegue testar todos os endpoints protegidos ✅

### Gerar um Novo Token (quando expirar)

Execute no terminal:
```bash
node -e "const jwt = require('jsonwebtoken'); const secret = process.env.JWT_SECRET; const token = jwt.sign({userId: '507f1f77bcf86cd799439011', email: 'usuario@test.com', tipo: 'user'}, secret, {expiresIn: '24h'}); console.log('Bearer ' + token);"
```

---

## 🔐 Variáveis de Ambiente (.env)

O arquivo `.env` contém as configurações necessárias:

```properties
# Servidor
PORT=3003
NODE_ENV=development

# Banco de Dados
MONGODB_URI=mongodb://localhost:27017/pet-joyful-posts

# Autenticação
JWT_SECRET=a2e6887fa57442d1040baa0393f31bcac2bfc15d486fed1e8e8dfaa197e3cc079d46c994790c8a871b404d49c54cf5e5d339a75befcd4860a5b4844a95fd7c83

# Cloudinary (Upload de Imagens)
CLOUDINARY_CLOUD_NAME=dc1d3tzms
CLOUDINARY_API_KEY=861985578347826
CLOUDINARY_API_SECRET=F-jBctEDV8bJqKQ4tg4oIgDoXCM

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

---

## 🎯 Endpoints Disponíveis

### 📝 Postagens (Sem Autenticação)

#### ✅ GET `/api/posts` - Listar todas as postagens
```bash
curl http://localhost:3003/api/posts
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "titulo": "Meu pet adorável",
      "descricao": "Olha só como ele é lindo!",
      "imagem": "https://...",
      "likes": [],
      "comentarios": [],
      "createdAt": "2024-01-15T08:00:00.000Z"
    }
  ]
}
```

#### ✅ GET `/api/posts/:id` - Obter uma postagem específica
```bash
curl http://localhost:3003/api/posts/POSTAGEM_ID
```

#### ✅ GET `/api/posts/user/:userId` - Listar postagens de um usuário
```bash
curl http://localhost:3003/api/posts/user/USUARIO_ID
```

---

### 📝 Postagens (Com Autenticação Required 🔒)

#### ✅ POST `/api/posts` - Criar nova postagem

**Com imagem (multipart/form-data):**
```bash
curl -X POST http://localhost:3003/api/posts \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -F "titulo=Meu gato lindo" \
  -F "descricao=Adoro meu gatinho" \
  -F "imagem=@/caminho/para/imagem.jpg"
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Postagem criada com sucesso",
  "data": {
    "_id": "...",
    "titulo": "Meu gato lindo",
    "imagem": "https://res.cloudinary.com/...",
    "userId": "507f1f77bcf86cd799439011"
  }
}
```

**Sem imagem (JSON):**
```bash
curl -X POST http://localhost:3003/api/posts \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Meu gato lindo",
    "descricao": "Adoro meu gatinho"
  }'
```

#### ✅ PUT `/api/posts/:id` - Atualizar postagem

```bash
curl -X PUT http://localhost:3003/api/posts/POSTAGEM_ID \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -F "titulo=Título Atualizado" \
  -F "descricao=Descrição atualizada" \
  -F "imagem=@/caminho/para/nova_imagem.jpg"
```

#### ✅ DELETE `/api/posts/:id` - Deletar postagem

```bash
curl -X DELETE http://localhost:3003/api/posts/POSTAGEM_ID \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

### ❤️ Likes (Com Autenticação Required 🔒)

#### ✅ POST `/api/posts/:id/like` - Curtir/Descurtir postagem

```bash
curl -X POST http://localhost:3003/api/posts/POSTAGEM_ID/like \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json"
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Postagem curtida",
  "liked": true,
  "likesCount": 5
}
```

---

### 💬 Comentários (Com Autenticação Required 🔒)

#### ✅ POST `/api/posts/:id/comment` - Adicionar comentário

```bash
curl -X POST http://localhost:3003/api/posts/POSTAGEM_ID/comment \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "texto": "Que fofo! 🐕"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Comentário adicionado com sucesso",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "nome": "João Silva",
    "texto": "Que fofo! 🐕",
    "data": "2024-01-15T10:30:00.000Z",
    "_id": "..."
  }
}
```

---

### 🏥 Health Check (Sem Autenticação)

#### ✅ GET `/health` - Verificar se o servidor está rodando

```bash
curl http://localhost:3003/health
```

**Resposta esperada:**
```json
{
  "status": "OK",
  "service": "Pet Joyful Posts Service",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 📤 Upload de Imagens com Cloudinary

### Como Funciona

1. **Fazer upload:** Quando você cria/atualiza uma postagem com imagem, ela é enviada para o **Cloudinary** automaticamente
2. **Armazenamento:** A imagem é armazenada em nuvem (servidor seguro)
3. **URL retornada:** Você recebe uma URL segura (`https://res.cloudinary.com/...`) para acessar a imagem

### Credenciais do Cloudinary

Já configuradas no arquivo `.env`:
- **Cloud Name:** `dc1d3tzms`
- **API Key:** `861985578347826`
- **API Secret:** `F-jBctEDV8bJqKQ4tg4oIgDoXCM`

### Tipos de Arquivo Suportados
- ✅ JPEG
- ✅ JPG
- ✅ PNG
- ✅ GIF
- ✅ WebP

### Tamanho Máximo
- **5 MB** por imagem

### Exemplo de Upload

**Via Swagger UI:**
1. Abra http://localhost:3003/api-docs
2. Autorize com o token Bearer
3. Expanda o endpoint `POST /api/posts`
4. Clique em "Try it out"
5. Preencha os campos:
   - `titulo`: "Meu pet"
   - `descricao`: "Muito fofo"
   - `imagem`: Selecione um arquivo
6. Clique em "Execute"

**Via cURL:**
```bash
curl -X POST http://localhost:3003/api/posts \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -F "titulo=Meu pet" \
  -F "descricao=Muito fofo" \
  -F "imagem=@/Users/seu_usuario/Imagens/pet.jpg"
```

---

## 🐛 Solução de Problemas

### ❌ "Token não fornecido"
**Solução:** Certifique-se de clicar em "Authorize" no Swagger e colar o token completo com "Bearer " no início.

### ❌ "Token inválido ou expirado"
**Solução:** Gere um novo token executando:
```bash
node -e "const jwt = require('jsonwebtoken'); const secret = process.env.JWT_SECRET; const token = jwt.sign({userId: '507f1f77bcf86cd799439011', email: 'usuario@test.com', tipo: 'user'}, secret, {expiresIn: '24h'}); console.log('Bearer ' + token);"
```

### ❌ "Erro ao fazer upload da imagem: Unknown API key"
**Solução:** Verifique se as credenciais do Cloudinary no `.env` estão corretas. Se mudou as credenciais, reinicie o servidor.

### ❌ "MongoDB conectado: erro"
**Solução:** Certifique-se de que o MongoDB está rodando:
```bash
# Windows
mongod

# macOS (via Homebrew)
brew services start mongodb-community

# Linux (via apt)
sudo systemctl start mongod
```

### ❌ "Rota não encontrada"
**Solução:** Verifique se a URL está correta e se o servidor está rodando. Teste com `http://localhost:3003/health`

---

## 📁 Estrutura do Projeto

```
pet-joyful-posts-service/
├── src/
│   ├── app.js                 # Configuração da aplicação
│   ├── config/
│   │   ├── cloudinary.js      # Configuração do Cloudinary
│   │   └── database.js        # Configuração do MongoDB
│   ├── controllers/
│   │   └── postController.js  # Lógica das postagens
│   ├── middleware/
│   │   ├── auth.js            # Autenticação JWT
│   │   └── upload.js          # Upload de arquivos
│   ├── models/
│   │   └── postModel.js       # Schema do MongoDB
│   ├── routes/
│   │   └── postRoutes.js      # Rotas da API
│   ├── services/
│   │   └── postService.js     # Serviços de negócio
│   └── utils/
│       └── validators.js      # Validadores
├── .env                        # Variáveis de ambiente
├── server.js                   # Entrada da aplicação
├── swagger.js                  # Gerador de documentação
├── swagger.output.json         # Documentação Swagger (gerada)
└── package.json               # Dependências do projeto
```

---

## 🧪 Testar a API Completa

### 1. Verificar se o servidor está rodando
```bash
curl http://localhost:3003/health
```

### 2. Criar uma postagem
```bash
TOKEN="SEU_TOKEN_AQUI"
curl -X POST http://localhost:3003/api/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Meu cachorro",
    "descricao": "Ele é muito fofo!"
  }'
```

### 3. Listar postagens
```bash
curl http://localhost:3003/api/posts
```

### 4. Curtir uma postagem
```bash
TOKEN="SEU_TOKEN_AQUI"
POSTAGEM_ID="ID_DA_POSTAGEM"
curl -X POST http://localhost:3003/api/posts/$POSTAGEM_ID/like \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### 5. Adicionar comentário
```bash
TOKEN="SEU_TOKEN_AQUI"
POSTAGEM_ID="ID_DA_POSTAGEM"
curl -X POST http://localhost:3003/api/posts/$POSTAGEM_ID/comment \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "texto": "Adorei! 🐶"
  }'
```

---

## 📚 Swagger UI - Dicas Úteis

1. **Testar endpoint:** Clique em "Try it out" dentro de cada endpoint
2. **Preencher parâmetros:** Use os campos que aparecem
3. **Ver respostas:** Role para baixo depois de clicar "Execute"
4. **Copiar cURL:** Existe um botão "Copy" para copiar o comando cURL equivalente

---

## 🔗 Links Úteis

- 📖 **Documentação Interativa:** http://localhost:3003/api-docs
- 🏥 **Health Check:** http://localhost:3003/health
- 📦 **Cloudinary Dashboard:** https://cloudinary.com/console
- 📚 **MongoDB Docs:** https://docs.mongodb.com/
- 🔑 **JWT Docs:** https://jwt.io/

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique se o MongoDB está rodando
2. Verifique se as variáveis de ambiente no `.env` estão corretas
3. Verifique os logs do servidor no terminal
4. Tente reiniciar o servidor com `npm run dev`

---

**Criado em:** 11 de novembro de 2025  
**Versão:** 1.0.0  
**Status:** ✅ Em funcionamento
