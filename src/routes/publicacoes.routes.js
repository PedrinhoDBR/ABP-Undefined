const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const { Op, fn, col, where: whereFn } = require('sequelize');
const Publicacao = require('../models/publicacao');
const router = express.Router();
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', '..', 'public', 'uploads', 'publicacoes');

        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Gera um nome de arquivo aleatório para evitar conflitos
        const randomName = crypto.randomBytes(16).toString('hex');
        const extension = path.extname(file.originalname);
        cb(null, `${randomName}${extension}`);
    }
});

const upload = multer({ storage: storage });

//ROTA PARA BUSCAR TODAS AS PUBLICAÇÕES, com filtro basico


router.get('/', async (req, res) => {
    try {
        const { id, ano, titulo, idioma} = req.query;
        const where = {};
        if (idioma) {
            where.PublicacaoIdioma = idioma;
        }

        if (ano) { 
            where.PublicacaoAno = ano;
        }

        if (titulo) {
             const termo = titulo.toLowerCase();

            where[Op.or] = [
                whereFn(fn('LOWER', col('PublicacaoTitulo')), { [Op.like]: `%${termo}%` }),
                whereFn(fn('LOWER', col('PublicacaoCitacao')), { [Op.like]: `%${termo}%` })
            ];
        }

        const publicacoes = await Publicacao.findAll({where});

        res.json({results: publicacoes });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar publicações', detalhes: error.message });
    }
});

// Rota para buscar uma publicação específica pelo ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Busca a publicação pelo ID
        const publicacao = await Publicacao.findByPk(id);

        if (!publicacao) {
            return res.status(404).json({ erro: 'Publicação não encontrada' });
        }

        res.json(publicacao);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar publicação', detalhes: error.message });
    }
});


router.post('/', upload.single('PublicacaoImagemFile'), async (req, res) => {
    try {
        const dados = req.body;

        if (req.file) {
            cloudinary.config({ 
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
                api_key: process.env.CLOUDINARY_API_KEY, 
                api_secret: process.env.CLOUDINARY_API_SECRET
            });

            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'publicacoes',
                public_id: `publicacao_${Date.now()}`
            });

            dados.PublicacaoImagem = uploadResult.secure_url;
        }

        dados.PublicacaoID = null;
        const novaPublicacao = await Publicacao.create(dados);
        res.status(201).json(novaPublicacao);
    } catch (error) {
        console.error('Erro ao criar publicação:', error);
        res.status(500).json({ erro: 'Erro ao criar publicação', detalhes: error.message });
    }
});

router.put('/:id', upload.single('PublicacaoImagemFile'), async (req, res) => {
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
                folder: 'publicacoes',
                public_id: `publicacao_${Date.now()}`
            });

            dados.PublicacaoImagem = uploadResult.secure_url;
        }

        const [updated] = await Publicacao.update(dados, {
            where: { PublicacaoID: id }
        });

        if (updated) {
            const publicacaoAtualizada = await Publicacao.findByPk(id);
            return res.json(publicacaoAtualizada);
        }
        throw new Error('Publicação não encontrada para atualização');

    } catch (error) {
        console.error('Erro ao atualizar publicação:', error);
        res.status(500).json({ erro: 'Erro ao atualizar publicação', detalhes: error.message });
    }
});


router.put('/inativar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const publicacao = await Publicacao.findByPk(id);
        if (!publicacao) {
            return res.status(404).json({ erro: "Publicação não encontrada" });
        }
        publicacao.PublicacaoVisibilidade = false; // Inativa a publicação
        await publicacao.save();
        res.json({ mensagem: "Publicação inativada com sucesso!" });
    } catch (error) {
        console.error('Erro ao inativar publicação:', error);
        res.status(500).json({ erro: 'Erro interno ao inativar publicação', detalhes: error.message });
    }
});

/* tEMPORARIO */
router.post('/default', async (req, res) => {

    const seed = [
        {
            id: 'A1',
            type: 'A',
            image: '/public/img/publicacoes/Figura_A1_GR.jpg',
            title: 'Estimating crop sowing and harvesting dates using satellite vegetation index: A comparative analysis',
            doi: 'https://doi.org/10.3390/rs15225366',
            citation: 'Rodigheri, G., Sanches, I. D. A., Richetti, J., Tsukahara, R. Y., Lawes, R., Bendini, H. D. N., & Adami, M. (2023). Estimating crop sowing and harvesting dates using satellite vegetation index: A comparative analysis. Remote sensing, 15(22), 5366.',
            year: '2023',
            abstract: '',
            idioma: 'EN-US'
        },
        {
            id: 'A2',
            type: 'A',
            image: '/public/img/publicacoes/Figura_A2_NS.png',
            title: 'Sugarcane Yield Estimation Using Satellite Remote Sensing Data in Empirical or Mechanistic Modeling: A Systematic Review',
            doi: 'https://doi.org/10.3390/rs16050863',
            citation: 'de França e Silva, N. R., Chaves, M. E. D., Luciano, A. C. d. S., Sanches, I. D., de Almeida, C. M., & Adami, M. (2024). Sugarcane Yield Estimation Using Satellite Remote Sensing Data in Empirical or Mechanistic Modeling: A Systematic Review. Remote Sensing, 16(5), 863.',
            year: '2024',
            abstract: '',
            idioma: 'EN-US'
        },
        {
            id: 'A3',
            type: 'A',
            image: '/public/img/publicacoes/Figura_A3_VP.png',
            title: 'Limitations of cloud cover for optical remote sensing of agricultural areas across South America',
            doi: 'https://doi.org/10.1016/j.rsase.2020.100414',
            citation: 'Prudente, V.H.R., Martins, V.S., Vieira, D.C., et al. (2020) Limitations of Cloud Cover for Optical Remote Sensing of Agricultural Areas across South America. Remote Sensing Applications: Society and Environment, 20, Article ID: 100414.',
            year: '2020',
            abstract: '',
            idioma: 'EN-US'
        },
        {
            id: 'A4',
            type: 'A',
            image: '/public/img/publicacoes/Figura_A4_PS.png',
            title: 'Land Use and Land Cover Products for Agricultural Mapping Applications in Brazil: Challenges and Limitations',
            doi: 'https://doi.org/10.3390/rs17132324',
            citation: 'Santos, P.A.d.; Adami, M.; Picoli, M.C.A.; Prudente, V.H.R.; Esquerdo, J.C.D.M.; Queiroz, G.R.d.; Carneiro de Santana, C.T.; Chaves, M.E.D. Land Use and Land Cover Products for Agricultural Mapping Applications in Brazil: Challenges and Limitations. Remote Sens. 2025, 17, 2324.',
            year: '2025',
            abstract: '',
            idioma: 'EN-US'
        },
        {
            id: 'A5',
            type: 'A',
            image: '/public/img/publicacoes/Figura_A5_CS.jpeg',
            title: 'A Method for Estimating Soybean Sowing, Beginning Seed, and Harvesting Dates in Brazil Using NDVI-MODIS Data',
            doi: 'https://doi.org/10.3390/rs16142520',
            citation: 'Santana, C.T.C.; Sanches, I.D.; Caldas, M.M.; Adami, M. A Method for Estimating Soybean Sowing, Beginning Seed, and Harvesting Dates in Brazil Using NDVI-MODIS Data. Remote Sens. 2024, 16, 2520.',
            year: '2024',
            abstract: '',
            idioma: 'EN-US'
        },
        {
            id: 'A6',
            type: 'A',
            image: '/public/img/publicacoes/Figura_A6_AG.png',
            title: 'Comprehensive workflow for image segmentation of rice fields utilizing the PLANET model',
            doi: 'https://doi.org/10.1016/j.acags.2025.100223',
            citation: 'Garcia, A. D. B., Islam, M. S., Prudente, V. H. R., Sanches, I. D. A., & Cheng, I. Irrigated rice-field mapping in Brazil using phenological stage information and optical and microwave remote sensing. Applied Computing and Geosciences, v. 25, p. 100223, 2025.',
            year: '2025',
            abstract: '',
            idioma: 'EN-US'
        },
        {
            id: 'A7',
            type: 'A',
            image: '/public/img/publicacoes/Figura_A7_AG.png',
            title: 'Growth behavior of irrigated rice according to different indices, sensors, and stages of the growth cycle',
            doi: 'https://doi.org/10.3390/agriengineering7030065',
            citation: 'Garcia, A. D. B., Sanches, I. D. A., Prudente, V. H. R., & Trabaquini, K. Characterization of Irrigated Rice Cultivation Cycles and Classification in Brazil Using Time Series Similarity and Machine Learning Models with Sentinel Imagery. AgriEngineering, v. 7, n. 3, p. 65, 2025.',
            year: '2025',
            abstract: '',
            idioma: 'EN-US'
        },
        {
            id: 'A8',
            type: 'A',
            image: '/public/img/publicacoes/Figura_A8_AG.png',
            title: 'Example of detailed features in irrigated rice fields',
            doi: 'https://doi.org/10.5753/jidm.2025.4181',
            citation: 'Garcia, A. D. B., Prudente, V. H. R., da Silva, D. T., Chaves, M. E. D., Trabaquini, K., & Sanches, I. D. A. Detailed Mapping of Irrigated Rice Fields Using Remote Sensing data and Segmentation Techniques: A case of study in Turvo, Santa Catarina, Brazil. Journal of Information and Data Management, v. 16, n. 1, p. 92-109, 2025.',
            year: '2025',
            abstract: '',
            idioma: 'EN-US'
        },
        {
            id: 'AC1',
            type: 'AC',
            image: '../public/img/publicacoes/Figura_AC1_PS.png',
            title: 'Avaliação do uso e cobertura da terra no Mato Grosso entre 1985-2020',
            doi: '',
            links: ['https://proceedings.science/sbsr/sbsr-2023/trabalhos/avaliacao-do-uso-e-cobertura-da-terra-no-mato-grosso-entre-1985-2020-mudancas-as?lang=pt-br'],
            citation: 'SANTOS, Priscilla Azevedo dos; ESCADA, Maria Isabel Sobral; ADAMI, Marcos. ... (SBSR 2023).',
            year: '2023',
            abstract: '',
            idioma: 'PT-BR'
        },
        {
            id: 'AC3',
            type: 'AC',
            image: '../public/img/publicacoes/Figura_AC3_PS.png',
            title: 'Rumo a Estimativa Objetivas de Safras Agrícolas',
            doi: '',
            links: ['https://proceedings.science/sbsr/sbsr-2023/trabalhos/rumo-a-estimativa-objetivas-de-safras-agricolas?lang=pt-br.'],
            citation: 'ADAMI, Marcos; CAMPOS, Patrícia; ... (SBSR 2023).',
            year: '2023',
            abstract: '',
            idioma: 'PT-BR'
        }
    ];

    try {
        const mapped = seed.map(p => ({
            PublicacaoTitulo: p.title,
            PublicacaoAno: p.year,
            PublicacaoImagem: p.image || null,
            PublicacaoCitacao: p.citation || null,
            PublicacaoLinkExterno: (Array.isArray(p.links) && p.links.length) ? p.links[0] : (p.doi || null),
            PublicacaoIdioma: p.idioma || 'PT-BR'
        }));

        const created = await Publicacao.bulkCreate(mapped, { validate: true });

        res.json({ inserted: created.length, results: created });
    } catch (error) {
        console.error('Erro ao inserir seed de publicações:', error);
        res.status(500).json({ erro: 'Erro ao inserir publicações seed', detalhes: error.message });
    }
});


module.exports = router;