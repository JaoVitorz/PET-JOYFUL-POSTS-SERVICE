const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticate } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');

// Rotas públicas (sem autenticação)
router.get('/posts', postController.getPosts);
router.get('/posts/:id', postController.getPostById);
router.get('/posts/user/:userId', postController.getUserPosts);

// Rotas protegidas (requerem autenticação)
router.post(
  '/posts',
  authenticate,
  upload.single('imagem'),
  handleUploadError,
  postController.createPost
);

router.put(
  '/posts/:id',
  authenticate,
  upload.single('imagem'),
  handleUploadError,
  postController.updatePost
);

router.delete('/posts/:id', authenticate, postController.deletePost);
router.post('/posts/:id/like', authenticate, postController.toggleLike);
router.post('/posts/:id/comment', authenticate, postController.addComment);

module.exports = router;