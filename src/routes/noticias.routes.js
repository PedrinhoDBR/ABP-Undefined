const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const { Op } = require('sequelize');
const Noticias = require('../models/noticias');
const router = express.Router();
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Salvar em public/img/noticias
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', '..', 'public', 'uploads', 'noticias');
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const randomName = crypto.randomBytes(16).toString('hex');
        const extension = path.extname(file.originalname);
        cb(null, `${randomName}${extension}`);
    }
});

const upload = multer({ storage: storage });

// GET todas as notícias
// GET todas as notícias
router.get('/', async (req, res) => {
    try {
        const { idioma, titulo, ano } = req.query;
        const where = {};
        
        if (idioma) {
            where.NoticiasIdioma = idioma;
        }
        if (titulo) {
            where.NoticiasTitulo = { [Op.like]: `%${titulo}%` };
        }
        if (ano) {
            const inicioAno = new Date(`${ano}-01-01`);
            const fimAno = new Date(`${ano}-12-31`);
            where.NoticiasData = { [Op.between]: [inicioAno, fimAno] };
        }

        const noticias = await Noticias.findAll({
            where: where,
            order: [['NoticiasData', 'DESC']]
        });

        res.json({ results: noticias });
    } catch (error) {
        console.error('Erro ao buscar notícias:', error);
        res.status(500).json({ erro: 'Erro ao buscar notícias', detalhes: error.message });
    }
});

// GET notícia específica
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const noticia = await Noticias.findByPk(id);
        if (!noticia) {
            return res.status(404).json({ erro: "Notícia não encontrada" });
        }
        res.json(noticia);
    } catch (error) {
        console.error('Erro ao buscar notícia:', error);
        res.status(500).json({
            erro: 'Erro interno ao buscar notícia',
            detalhes: error.message
        });
    }
});

// POST nova notícia
router.post('/', upload.single('NoticiasImagemFile'), async (req, res) => {
    try {
        const dados = req.body;

        if (dados.NoticiasID === '') {
            delete dados.NoticiasID;
        }

        if (req.file) {
            cloudinary.config({ 
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
                api_key: process.env.CLOUDINARY_API_KEY, 
                api_secret: process.env.CLOUDINARY_API_SECRET
            });

            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'noticias',
                public_id: `noticia_${Date.now()}`
            });

            dados.NoticiasImagem = uploadResult.secure_url;
        }

        if (dados.NoticiasData) {
            // Já deve vir no formato correto do input date
        }


        const novaNoticia = await Noticias.create(dados);
        res.status(201).json(novaNoticia);
    } catch (error) {
        console.error('Erro ao criar notícia:', error);
        res.status(500).json({ 
            erro: 'Erro ao criar notícia', 
            detalhes: error.message,
            stack: error.stack 
        });
    }
});

// PUT atualizar notícia
router.put('/:id', upload.single('NoticiasImagemFile'), async (req, res) => {
    const { id } = req.params;
    try {
        const dados = req.body;

        if (req.file) {
            cloudinary.config({ 
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
                api_key: process.env.CLOUDINARY_API_KEY, 
                api_secret: process.env.CLOUDINARY_API_SECRET
            });

            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'noticias',
                public_id: `noticia_${Date.now()}`
            });

            dados.NoticiasImagem = uploadResult.secure_url;
        }

        const [updated] = await Noticias.update(dados, {
            where: { NoticiasID: id }
        });

        if (updated) {
            const noticiaAtualizada = await Noticias.findByPk(id);
            return res.json(noticiaAtualizada);
        }
        throw new Error('Notícia não encontrada para atualização');

    } catch (error) {
        console.error('Erro ao atualizar notícia:', error);
        res.status(500).json({ erro: 'Erro ao atualizar notícia', detalhes: error.message });
    }
});

// DELETE notícia
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Noticias.destroy({
            where: { NoticiasID: id }
        });

        if (deleted) {
            return res.json({ mensagem: "Notícia excluída com sucesso!" });
        }
        throw new Error('Notícia não encontrada para exclusão');
    } catch (error) {
        console.error('Erro ao excluir notícia:', error);
        res.status(500).json({ erro: 'Erro interno ao excluir notícia', detalhes: error.message });
    }
});

module.exports = router;