const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Pet Joyful Posts Service API',
    description: 'API para gerenciamento de postagens do Pet Joyful',
    version: '1.0.0',
  },
  host: 'localhost:3003',
  schemes: ['http'],
  consumes: ['application/json', 'multipart/form-data'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Posts',
      description: 'Endpoints relacionados a postagens'
    },
    {
      name: 'Likes',
      description: 'Endpoints relacionados a curtidas'
    },
    {
      name: 'Comments',
      description: 'Endpoints relacionados a comentários'
    }
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Insira o token JWT no formato: Bearer {token}'
    }
  },
  definitions: {
    Post: {
      titulo: 'Meu pet adorável',
      descricao: 'Olha só como ele é lindo!',
      categoria: 'foto',
      tags: ['cachorro', 'filhote'],
      imagem: {
        url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        public_id: 'sample',
        width: 800,
        height: 600
      },
      autor: {
        userId: '507f1f77bcf86cd799439011',
        nome: 'João Silva',
        email: 'joao@example.com'
      },
      likes: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013'],
      comentarios: [
        {
          userId: '507f1f77bcf86cd799439014',
          nome: 'Maria Santos',
          texto: 'Que fofo!',
          data: '2024-01-15T10:30:00.000Z'
        }
      ],
      visualizacoes: 150,
      ativo: true,
      createdAt: '2024-01-15T08:00:00.000Z',
      updatedAt: '2024-01-15T10:30:00.000Z'
    },
    CreatePost: {
      $titulo: 'Meu pet adorável',
      descricao: 'Olha só como ele é lindo!',
      categoria: 'foto',
      tags: 'cachorro,filhote',
      autorNome: 'João Silva'
    },
    UpdatePost: {
      titulo: 'Título atualizado',
      descricao: 'Descrição atualizada',
      categoria: 'dica',
      tags: 'cachorro,cuidados'
    },
    Comment: {
      $texto: 'Que lindo!',
      autorNome: 'Maria Santos'
    },
    PostResponse: {
      success: true,
      message: 'Postagem criada com sucesso',
      data: {
        $ref: '#/definitions/Post'
      }
    },
    PostsListResponse: {
      success: true,
      data: [
        {
          $ref: '#/definitions/Post'
        }
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 50,
        pages: 5
      }
    },
    LikeResponse: {
      success: true,
      message: 'Postagem curtida',
      liked: true,
      likesCount: 15
    },
    CommentResponse: {
      success: true,
      message: 'Comentário adicionado com sucesso',
      data: {
        userId: '507f1f77bcf86cd799439011',
        nome: 'João Silva',
        texto: 'Que fofo!',
        data: '2024-01-15T10:30:00.000Z',
        _id: '507f1f77bcf86cd799439015'
      }
    },
    ErrorResponse: {
      success: false,
      message: 'Mensagem de erro',
      error: 'Detalhes do erro'
    }
  }
};

const outputFile = './swagger.output.json';
const endpointsFiles = ['./src/routes/postRoutes.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Swagger documentation generated');
});