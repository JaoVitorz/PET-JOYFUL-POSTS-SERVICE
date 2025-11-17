const Post = require('../models/postModel');
const mongoose = require('mongoose');
const { uploadImage, deleteImage } = require('../config/cloudinary');

// Criar postagem
exports.createPost = async (req, res) => {
  try {
    const { titulo, descricao, categoria, tags } = req.body;
    const { userId, email } = req.user;

    // Validação básica
    if (!titulo) {
      return res.status(400).json({
        success: false,
        message: 'Título é obrigatório'
      });
    }

    // Converte userId para ObjectId se necessário
    let userIdObjectId = userId;
    if (typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId)) {
      userIdObjectId = new mongoose.Types.ObjectId(userId);
    }

    // Prepara dados da postagem
    const postData = {
      titulo,
      descricao,
      categoria: categoria || 'outros',
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      autor: {
        userId: userIdObjectId,
        nome: req.body.autorNome || 'Usuário',
        email: email
      },
      ativo: true // Garante que o post está ativo
    };

    // Se houver imagem, faz upload para Cloudinary
    if (req.file) {
      try {
        const imageData = await uploadImage(req.file.buffer);
        postData.imagem = imageData;
      } catch (uploadError) {
        console.error('Erro ao fazer upload da imagem:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Erro ao fazer upload da imagem',
          error: uploadError.message
        });
      }
    }

    // Cria a postagem
    const post = await Post.create(postData);
    
    // Log para debug
    console.log('Post criado com sucesso:', {
      id: post._id,
      titulo: post.titulo,
      autor: post.autor.userId,
      ativo: post.ativo
    });

    return res.status(201).json({
      success: true,
      message: 'Postagem criada com sucesso',
      data: post
    });
  } catch (error) {
    console.error('Erro ao criar postagem:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar postagem',
      error: error.message
    });
  }
};

// Listar postagens com paginação
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtros opcionais
    const filters = { ativo: { $ne: false } }; // Busca posts ativos (inclui null/undefined como ativo)
    if (req.query.categoria) filters.categoria = req.query.categoria;
    if (req.query.userId) {
      // Converte userId para ObjectId se necessário
      let userIdFilter = req.query.userId;
      if (typeof req.query.userId === 'string' && mongoose.Types.ObjectId.isValid(req.query.userId)) {
        userIdFilter = new mongoose.Types.ObjectId(req.query.userId);
      }
      filters['autor.userId'] = userIdFilter;
    }
    if (req.query.tag) filters.tags = req.query.tag;

    const posts = await Post.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Post.countDocuments(filters);

    // Log para debug
    console.log('Posts recuperados:', {
      total,
      encontrados: posts.length,
      filtros: filters,
      pagina: page
    });

    return res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao listar postagens:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao listar postagens',
      error: error.message
    });
  }
};

// Buscar postagem por ID
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Postagem não encontrada'
      });
    }

    // Incrementa visualizações
    post.visualizacoes += 1;
    await post.save();

    return res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Erro ao buscar postagem:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar postagem',
      error: error.message
    });
  }
};

// Atualizar postagem
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { titulo, descricao, categoria, tags } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Postagem não encontrada'
      });
    }

    // Verifica se o usuário é o autor
    if (post.autor.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para editar esta postagem'
      });
    }

    // Atualiza campos
    if (titulo) post.titulo = titulo;
    if (descricao !== undefined) post.descricao = descricao;
    if (categoria) post.categoria = categoria;
    if (tags) post.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());

    // Se houver nova imagem, deleta a antiga e faz upload da nova
    if (req.file) {
      // Deleta imagem antiga se existir
      if (post.imagem && post.imagem.public_id) {
        try {
          await deleteImage(post.imagem.public_id);
        } catch (delError) {
          console.error('Erro ao deletar imagem antiga:', delError);
        }
      }

      // Upload da nova imagem
      try {
        const imageData = await uploadImage(req.file.buffer);
        post.imagem = imageData;
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: 'Erro ao fazer upload da imagem',
          error: uploadError.message
        });
      }
    }

    await post.save();

    return res.json({
      success: true,
      message: 'Postagem atualizada com sucesso',
      data: post
    });
  } catch (error) {
    console.error('Erro ao atualizar postagem:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar postagem',
      error: error.message
    });
  }
};

// Deletar postagem
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Postagem não encontrada'
      });
    }

    // Verifica se o usuário é o autor
    if (post.autor.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para deletar esta postagem'
      });
    }

    // Deleta imagem do Cloudinary se existir
    if (post.imagem && post.imagem.public_id) {
      try {
        await deleteImage(post.imagem.public_id);
      } catch (delError) {
        console.error('Erro ao deletar imagem:', delError);
      }
    }

    await Post.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: 'Postagem deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar postagem:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao deletar postagem',
      error: error.message
    });
  }
};

// Curtir/Descurtir postagem
exports.toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Postagem não encontrada'
      });
    }

    const likeIndex = post.likes.findIndex(like => like.toString() === userId.toString());

    if (likeIndex === -1) {
      // Adiciona like
      post.likes.push(userId);
      await post.save();
      return res.json({
        success: true,
        message: 'Postagem curtida',
        liked: true,
        likesCount: post.likes.length
      });
    } else {
      // Remove like
      post.likes.splice(likeIndex, 1);
      await post.save();
      return res.json({
        success: true,
        message: 'Like removido',
        liked: false,
        likesCount: post.likes.length
      });
    }
  } catch (error) {
    console.error('Erro ao curtir postagem:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao curtir postagem',
      error: error.message
    });
  }
};

// Adicionar comentário
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { texto } = req.body;

    if (!texto || texto.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Texto do comentário é obrigatório'
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Postagem não encontrada'
      });
    }

    const comentario = {
      userId: userId,
      nome: req.body.autorNome || 'Usuário',
      texto: texto.trim()
    };

    post.comentarios.push(comentario);
    await post.save();

    return res.json({
      success: true,
      message: 'Comentário adicionado com sucesso',
      data: post.comentarios[post.comentarios.length - 1]
    });
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao adicionar comentário',
      error: error.message
    });
  }
};

// Listar postagens de um usuário
exports.getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Converte userId para ObjectId se necessário
    let userIdFilter = userId;
    if (typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId)) {
      userIdFilter = new mongoose.Types.ObjectId(userId);
    }

    const filters = {
      'autor.userId': userIdFilter,
      ativo: { $ne: false } // Busca posts ativos (inclui null/undefined como ativo)
    };

    const posts = await Post.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Post.countDocuments(filters);

    return res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao listar postagens do usuário:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao listar postagens do usuário',
      error: error.message
    });
  }
};