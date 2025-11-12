const cloudinary = require('cloudinary').v2;

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.dc1d3tzms,
  api_key: process.env.A861985578347826,
  api_secret: process.env.F-jBctEDV8bJqKQ4tg4oIgDoXCM
});

/**
 * Faz upload de imagem para o Cloudinary
 * @param {Buffer} fileBuffer - Buffer do arquivo
 * @param {String} folder - Pasta no Cloudinary
 * @returns {Promise<Object>} Dados da imagem
 */
const uploadImage = async (fileBuffer, folder = 'pet-joyful/posts') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height
          });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Deleta imagem do Cloudinary
 * @param {String} publicId - ID público da imagem
 * @returns {Promise<Object>} Resultado da operação
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    throw error;
  }
};

module.exports = {
  uploadImage,
  deleteImage
};