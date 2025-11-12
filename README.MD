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

## 📋 Endpoints

- `POST /api/posts` - Criar postagem
- `GET /api/posts` - Listar postagens
- `GET /api/posts/:id` - Buscar postagem
- `PUT /api/posts/:id` - Atualizar postagem
- `DELETE /api/posts/:id` - Deletar postagem
- `POST /api/posts/:id/like` - Curtir postagem
- `POST /api/posts/:id/comment` - Comentar postagem

## 🔧 Tecnologias

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer + Cloudinary
- CORS

## 📝 Licença

ISC