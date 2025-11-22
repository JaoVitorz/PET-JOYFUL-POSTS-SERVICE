const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { authenticate } = require("../middleware/auth");
const { upload, handleUploadError } = require("../middleware/upload");

// Rotas públicas (sem autenticação)

// #swagger.tags = ['Posts']
// #swagger.description = 'Lista todas as postagens com paginação e filtros opcionais'
// #swagger.parameters['page'] = { in: 'query', description: 'Número da página', type: 'integer', default: 1 }
// #swagger.parameters['limit'] = { in: 'query', description: 'Quantidade de itens por página', type: 'integer', default: 10 }
// #swagger.parameters['categoria'] = { in: 'query', description: 'Filtrar por categoria', type: 'string', enum: ['foto', 'adocao', 'perdido', 'encontrado', 'dica', 'evento', 'outros'] }
// #swagger.parameters['userId'] = { in: 'query', description: 'Filtrar por ID do usuário', type: 'string' }
// #swagger.parameters['tag'] = { in: 'query', description: 'Filtrar por tag', type: 'string' }
// #swagger.responses[200] = { description: 'Lista de postagens retornada com sucesso', schema: { $ref: '#/definitions/PostsListResponse' } }
// #swagger.responses[500] = { description: 'Erro ao listar postagens', schema: { $ref: '#/definitions/ErrorResponse' } }
router.get("/posts", postController.getPosts);

// #swagger.tags = ['Posts']
// #swagger.description = 'Busca uma postagem específica por ID e incrementa o contador de visualizações'
// #swagger.parameters['id'] = { in: 'path', description: 'ID da postagem', required: true, type: 'string' }
// #swagger.responses[200] = { description: 'Postagem encontrada', schema: { $ref: '#/definitions/PostResponse' } }
// #swagger.responses[404] = { description: 'Postagem não encontrada', schema: { $ref: '#/definitions/ErrorResponse' } }
// #swagger.responses[500] = { description: 'Erro ao buscar postagem', schema: { $ref: '#/definitions/ErrorResponse' } }
router.get("/posts/:id", postController.getPostById);

// #swagger.tags = ['Posts']
// #swagger.description = 'Lista todas as postagens de um usuário específico'
// #swagger.parameters['userId'] = { in: 'path', description: 'ID do usuário', required: true, type: 'string' }
// #swagger.parameters['page'] = { in: 'query', description: 'Número da página', type: 'integer', default: 1 }
// #swagger.parameters['limit'] = { in: 'query', description: 'Quantidade de itens por página', type: 'integer', default: 10 }
// #swagger.responses[200] = { description: 'Lista de postagens do usuário retornada com sucesso', schema: { $ref: '#/definitions/PostsListResponse' } }
// #swagger.responses[500] = { description: 'Erro ao listar postagens do usuário', schema: { $ref: '#/definitions/ErrorResponse' } }
router.get("/posts/user/:userId", postController.getUserPosts);

// Rotas protegidas (requerem autenticação)

// #swagger.tags = ['Posts']
// #swagger.description = 'Cria uma nova postagem. Requer autenticação via Bearer Token'
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.consumes = ['multipart/form-data']
// #swagger.parameters['titulo'] = { in: 'formData', description: 'Título da postagem', required: true, type: 'string' }
// #swagger.parameters['descricao'] = { in: 'formData', description: 'Descrição da postagem', type: 'string' }
// #swagger.parameters['categoria'] = { in: 'formData', description: 'Categoria da postagem', type: 'string', enum: ['foto', 'adocao', 'perdido', 'encontrado', 'dica', 'evento', 'outros'], default: 'outros' }
// #swagger.parameters['tags'] = { in: 'formData', description: 'Tags separadas por vírgula', type: 'string' }
// #swagger.parameters['autorNome'] = { in: 'formData', description: 'Nome do autor', type: 'string' }
// #swagger.parameters['imagem'] = { in: 'formData', description: 'Imagem da postagem', type: 'file' }
// #swagger.responses[201] = { description: 'Postagem criada com sucesso', schema: { $ref: '#/definitions/PostResponse' } }
// #swagger.responses[400] = { description: 'Dados inválidos', schema: { $ref: '#/definitions/ErrorResponse' } }
// #swagger.responses[401] = { description: 'Token não fornecido ou inválido', schema: { $ref: '#/definitions/ErrorResponse' } }
// #swagger.responses[500] = { description: 'Erro ao criar postagem', schema: { $ref: '#/definitions/ErrorResponse' } }
router.post(
  "/posts",
  authenticate,
  upload.single("imagem"),
  handleUploadError,
  postController.createPost
);

// #swagger.tags = ['Posts']
// #swagger.description = 'Atualiza uma postagem existente. Apenas o autor pode editar'
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.consumes = ['multipart/form-data']
// #swagger.parameters['id'] = { in: 'path', description: 'ID da postagem', required: true, type: 'string' }
// #swagger.parameters['titulo'] = { in: 'formData', description: 'Título da postagem', type: 'string' }
// #swagger.parameters['descricao'] = { in: 'formData', description: 'Descrição da postagem', type: 'string' }
// #swagger.parameters['categoria'] = { in: 'formData', description: 'Categoria da postagem', type: 'string', enum: ['foto', 'adocao', 'perdido', 'encontrado', 'dica', 'evento', 'outros'] }
// #swagger.parameters['tags'] = { in: 'formData', description: 'Tags separadas por vírgula', type: 'string' }
// #swagger.parameters['imagem'] = { in: 'formData', description: 'Nova imagem da postagem', type: 'file' }
// #swagger.responses[200] = { description: 'Postagem atualizada com sucesso', schema: { $ref: '#/definitions/PostResponse' } }
// #swagger.responses[403] = { description: 'Usuário não tem permissão para editar esta postagem', schema: { $ref: '#/definitions/ErrorResponse' } }
// #swagger.responses[404] = { description: 'Postagem não encontrada', schema: { $ref: '#/definitions/ErrorResponse' } }
// #swagger.responses[401] = { description: 'Token não fornecido ou inválido', schema: { $ref: '#/definitions/ErrorResponse' } }
// #swagger.responses[500] = { description: 'Erro ao atualizar postagem', schema: { $ref: '#/definitions/ErrorResponse' } }
router.put(
  "/posts/:id",
  authenticate,
  upload.single("imagem"),
  handleUploadError,
  postController.updatePost
);

// #swagger.tags = ['Posts']
// #swagger.description = 'Deleta uma postagem. Apenas o autor pode deletar'
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.parameters['id'] = { in: 'path', description: 'ID da postagem', required: true, type: 'string' }
// #swagger.responses[200] = { description: 'Postagem deletada com sucesso', schema: { success: true, message: 'Postagem deletada com sucesso' } }
// #swagger.responses[403] = { description: 'Usuário não tem permissão para deletar esta postagem', schema: { $ref: '#/definitions/ErrorResponse' } }
// #swagger.responses[404] = { description: 'Postagem não encontrada', schema: { $ref: '#/definitions/ErrorResponse' } }
// #swagger.responses[401] = { description: 'Token não fornecido ou inválido', schema: { $ref: '#/definitions/ErrorResponse' } }
// #swagger.responses[500] = { description: 'Erro ao deletar postagem', schema: { $ref: '#/definitions/ErrorResponse' } }
router.delete("/posts/:id", authenticate, postController.deletePost);

// #swagger.tags = ['Likes']
// #swagger.description = 'Curtir ou descurtir uma postagem. Se já estiver curtida, remove a curtida'
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.parameters['id'] = { in: 'path', description: 'ID da postagem', required: true, type: 'string' }
// #swagger.responses[200] = { description: 'Operação realizada com sucesso', schema: { $ref: '#/definitions/LikeResponse' } }
// #swagger.responses[404] = { description: 'Postagem não encontrada', schema: { $ref: '#/definitions/ErrorResponse' } }
// #swagger.responses[401] = { description: 'Token não fornecido ou inválido', schema: { $ref: '#/definitions/ErrorResponse' } }
// #swagger.responses[500] = { description: 'Erro ao curtir postagem', schema: { $ref: '#/definitions/ErrorResponse' } }
router.post("/posts/:id/like", authenticate, postController.toggleLike);

// #swagger.tags = ['Comments']
// #swagger.description = 'Adiciona um comentário a uma postagem'
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.parameters['id'] = { in: 'path', description: 'ID da postagem', required: true, type: 'string' }
/* #swagger.parameters['obj'] = {
    in: 'body',
    description: 'Dados do comentário',
    required: true,
    schema: {
        texto: 'Que lindo!',
        autorNome: 'João Silva'
    }
} */
// #swagger.responses[200] = { description: 'Comentário adicionado com sucesso', schema: { $ref: '#/definitions/CommentResponse' } }
// #swagger.responses[400] = { description: 'Texto do comentário é obrigatório', schema: { $ref: '#/definitions/ErrorResponse' } }
// #swagger.responses[404] = { description: 'Postagem não encontrada', schema: { $ref: '#/definitions/ErrorResponse' } }
// #swagger.responses[401] = { description: 'Token não fornecido ou inválido', schema: { $ref: '#/definitions/ErrorResponse' } }
// #swagger.responses[500] = { description: 'Erro ao adicionar comentário', schema: { $ref: '#/definitions/ErrorResponse' } }
router.post("/posts/:id/comment", authenticate, postController.addComment);

module.exports = router;
