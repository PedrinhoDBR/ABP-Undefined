const express = require('express');
const Projetos = require('../models/projetos');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Rota para todos os projetos - RESPONDE A /projeto/
router.get('/', async (req, res) => {
    try {
        const projetos = await Projetos.findAll({
            order: [['ProjetosId', 'ASC']]
        });

        res.json({ results: projetos });
    } catch(error){
        console.error('Erro ao buscar a lista de projetos:', error);
        res.status(500).json({erro: 'Erro ao buscar projetos', detalhes: error.message});
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
    // configurar dest para imagens
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

    // Função auxiliar que processa os dados depois do upload
    const processBody = async (body, files) => {
        try {
            const data = {};
            // Campos simples
            data.ProjetosTitulo = body.ProjetosTitulo || null;
            data.ProjetosTituloCard = body.ProjetosTituloCard || null;
            data.CardResumo = body.CardResumo || null;
            data.ProjetoDescricao = body.ProjetoDescricao || null;

            // Imagens: se arquivo enviado, use o arquivo, senão use valor do campo hidden (campos ImagemCarrossel/ImagemCard)
            if (files && files.ImagemCarrosselFile && files.ImagemCarrosselFile[0]) {
                data.ImagemCarrossel = '/uploads/projetos/' + files.ImagemCarrosselFile[0].filename;
            } else if (body.ImagemCarrossel) {
                data.ImagemCarrossel = body.ImagemCarrossel;
            }

            if (files && files.ImagemCardFile && files.ImagemCardFile[0]) {
                data.ImagemCard = '/uploads/projetos/' + files.ImagemCardFile[0].filename;
            } else if (body.ImagemCard) {
                data.ImagemCard = body.ImagemCard;
            }

            // Ordem e ativo
            data.OrdemdeExibicao = body.OrdemdeExibicao ? parseInt(body.OrdemdeExibicao) : 0;
            if (body.Ativo === 'true' || body.Ativo === true || body.Ativo === 'on') {
                data.Ativo = true;
            } else if (body.Ativo === 'false' || body.Ativo === false) {
                data.Ativo = false;
            } else {
                data.Ativo = !!body.Ativo;
            }

            // Informacoes: pode vir como objeto (JSON) ou string
            if (body.Informacoes) {
                if (typeof body.Informacoes === 'object') {
                    data.Informacoes = body.Informacoes;
                } else {
                    try {
                        data.Informacoes = JSON.parse(body.Informacoes);
                    } catch (e) {
                        // se não for JSON, armazenar como objeto vazio
                        data.Informacoes = {};
                    }
                }
            } else {
                data.Informacoes = {};
            }

            // Criar registro
            const criado = await Projetos.create(data);
            return res.status(201).json(criado);
        } catch (err) {
            console.error('Erro ao inserir projeto:', err);
            return res.status(500).json({ erro: 'Erro ao inserir projeto', detalhes: err.message });
        }
    };

    // Se for multipart/form-data, usar multer
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
        // JSON / x-www-form-urlencoded
        return processBody(req.body, null);
    }
});