const express = require('express');
const Projetos = require('../models/projetos');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const router = express.Router();




router.get('/ultimos', async (req, res) => {
    try {
        const { idioma } = req.query;
        const where = {};
        if (idioma) {
            where.ProjetosIdioma = idioma;
        }
        const projetos = await Projetos.findAll({
            where,
            limit: 3,
            order: [['ProjetosId', 'DESC']]
        });
        res.status(200).json({ results: projetos });
    } catch (error) {
        console.error('ERRO CRÍTICO NA ROTA /ultimos:', error);
        res.status(500).json({ erro: 'Erro interno ao buscar dados do banco', detalhes: error.message });
    }
});

// Rota para todos os projetos - RESPONDE A /projeto/
router.get('/', async (req, res) => {
    try {
        const { idioma } = req.query;
        const where = {};
        if (idioma) {
            where.ProjetosIdioma = idioma;
        }
        
        const projetos = await Projetos.findAll({
            where,
            order: [['ProjetosId', 'ASC']]
        });
       

        res.json({ results: projetos });
    } catch (error) {
        console.error('Erro ao buscar a lista de projetos:', error);
        res.status(500).json({ erro: 'Erro ao buscar projetos', detalhes: error.message });
    }
});

// Rota pra projeto específico - RESPONDE A /projeto/1
router.get('/:projetoId', async (req, res) => {
    const { projetoId } = req.params;

    try {
        const projeto = await Projetos.findByPk(projetoId)

        if (!projeto) {
            return res.status(404).json({ erro: "Projeto não pode ser encontrado" })
        }

        res.json(projeto)
    }
    catch (error) {
        console.error('Erro ao buscar projeto:', error);
        res.status(500).json({
            erro: 'Erro interno ao buscar projeto',
            detalhes: error.message
        });
    }

})

module.exports = router;

// Rota para criar/ inserir um novo projeto - RESPONDE A POST /projeto/
router.post('/', async (req, res) => {
    const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'projetos');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-\_]/g, '_');
            cb(null, uniqueSuffix + '-' + safeName);
        }
    });

    const upload = multer({ storage: storage });

    const processBody = async (body, files) => {

        try {
            const data = {};
            data.ProjetosTitulo = body.ProjetosTitulo || null;
            data.ProjetosTituloCard = body.ProjetosTituloCard || null;
            data.CardResumo = body.CardResumo || null;
            data.ProjetoDescricao = body.ProjetoDescricao || null;
            data.ProjetosIdioma = body.ProjetosIdioma || null;    

            if (files && files.ImagemCarrosselFile && files.ImagemCarrosselFile[0]) {
                const hasCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
                if (hasCloudinary) {
                    cloudinary.config({ 
                        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
                        api_key: process.env.CLOUDINARY_API_KEY, 
                        api_secret: process.env.CLOUDINARY_API_SECRET
                    });
                    const uploadResult = await cloudinary.uploader.upload(files.ImagemCarrosselFile[0].path, {
                        folder: 'projetos',
                        public_id: `projeto_carrossel_${Date.now()}`
                    });
                    data.ImagemCarrossel = uploadResult.secure_url;
                } else {
                    const filename = path.basename(files.ImagemCarrosselFile[0].path);
                    data.ImagemCarrossel = `/public/uploads/projetos/${filename}`;
                }
            } else if (body.ImagemCarrossel) {
                data.ImagemCarrossel = body.ImagemCarrossel;
            }

            if (files && files.ImagemCardFile && files.ImagemCardFile[0]) {
                const hasCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
                if (hasCloudinary) {
                    const uploadResult = await cloudinary.uploader.upload(files.ImagemCardFile[0].path, {
                        folder: 'projetos',
                        public_id: `projeto_card_${Date.now()}`
                    });
                    data.ImagemCard = uploadResult.secure_url;
                } else {
                    const filename = path.basename(files.ImagemCardFile[0].path);
                    data.ImagemCard = `/public/uploads/projetos/${filename}`;
                }
            } else if (body.ImagemCard) {
                data.ImagemCard = body.ImagemCard;
            }

            data.OrdemdeExibicao = body.OrdemdeExibicao ? parseInt(body.OrdemdeExibicao) : 0;
            if (body.Ativo === 'true' || body.Ativo === true || body.Ativo === 'on') {
                data.Ativo = true;
            } else if (body.Ativo === 'false' || body.Ativo === false) {
                data.Ativo = false;
            } else {
                data.Ativo = !!body.Ativo;
            }

            if (body.Informacoes) {
                if (typeof body.Informacoes === 'object') {
                    data.Informacoes = body.Informacoes;
                } else {
                    try {
                        data.Informacoes = JSON.parse(body.Informacoes);
                    } catch (e) {
                        data.Informacoes = {};
                    }
                }
            } else {
                data.Informacoes = {};
            }

            const criado = await Projetos.create(data);
            return res.status(201).json(criado);
        } catch (err) {
            console.error('Erro ao inserir projeto:', err);
            return res.status(500).json({ erro: 'Erro ao inserir projeto', detalhes: err.message });
        }
    };

    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
        upload.fields([
            { name: 'ImagemCarrosselFile', maxCount: 1 },
            { name: 'ImagemCardFile', maxCount: 1 }
        ])(req, res, function (err) {
            if (err) {
                console.error('Erro no upload:', err);
                return res.status(400).json({ erro: 'Erro no upload', detalhes: err.message });
            }
            return processBody(req.body, req.files);
        });
    } else {
        return processBody(req.body, null);
    }
});

// Rota para atualizar um projeto - RESPONDE A PUT /projeto/1
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const dados = req.body;

        // Atualiza o idioma se fornecido
        if (dados.ProjetosIdioma) {
            dados.ProjetosIdioma = dados.ProjetosIdioma;
        }

        const [updated] = await Projetos.update(dados, {
            where: { ProjetosId: id }
        });

        if (updated) {
            const projetoAtualizado = await Projetos.findByPk(id);
            return res.json(projetoAtualizado);
        }
        throw new Error('Projeto não encontrado para atualização');

    } catch (error) {
        console.error('Erro ao atualizar projeto:', error);
        res.status(500).json({ erro: 'Erro ao atualizar projeto', detalhes: error.message });
    }
});
