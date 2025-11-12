const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  nome: {
    type: String,
    required: true
  },
  texto: {
    type: String,
    required: true,
    maxlength: 500
  },
  data: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true,
    maxlength: [200, 'Título não pode ter mais de 200 caracteres']
  },
  descricao: {
    type: String,
    trim: true,
    maxlength: [2000, 'Descrição não pode ter mais de 2000 caracteres']
  },
  imagem: {
    url: {
      type: String,
      default: null
    },
    public_id: {
      type: String,
      default: null
    },
    width: Number,
    height: Number
  },
  categoria: {
    type: String,
    enum: ['foto', 'adocao', 'perdido', 'encontrado', 'dica', 'evento', 'outros'],
    default: 'outros'
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  autor: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    nome: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  comentarios: [comentarioSchema],
  visualizacoes: {
    type: Number,
    default: 0
  },
  ativo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices para melhorar performance
postSchema.index({ 'autor.userId': 1 });
postSchema.index({ categoria: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ createdAt: -1 });

// Método para verificar se usuário curtiu
postSchema.methods.isLikedBy = function(userId) {
  return this.likes.some(like => like.toString() === userId.toString());
};

// Método para contar likes
postSchema.methods.getLikesCount = function() {
  return this.likes.length;
};

// Método para contar comentários
postSchema.methods.getCommentsCount = function() {
  return this.comentarios.length;
};

const Post = mongoose.model('Post', postSchema);

module.exports = Post;