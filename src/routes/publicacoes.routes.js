const express = require('express');
// const multer = require('multer');
// const path = require('path');
const { Op, fn, col, where: whereFn } = require('sequelize');
const Publicacao = require('../models/publicacao');
const router = express.Router();

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

        // console.log('Filtros:', where);
        const publicacoes = await Publicacao.findAll({where});
        // console.log('RET:',publicacoes)

        res.json({results: publicacoes });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar publicações', detalhes: error.message });
    }
});

/* tEMPORARIO */
router.post('/default', async (req, res) => {

    const seed = [
        {
            id: 'AC1',
            type: 'AC',
            image: '../public/img/publicacoes/Figura_AC1_PS.png',
            title: 'Avaliação do uso e cobertura da terra no Mato Grosso entre 1985-2020',
            links: ['https://proceedings.science/sbsr/sbsr-2023/trabalhos/avaliacao-do-uso-e-cobertura-da-terra-no-mato-grosso-entre-1985-2020-mudancas-as?lang=pt-br'],
            citation: 'SANTOS, Priscilla Azevedo dos; ESCADA, Maria Isabel Sobral; ADAMI, Marcos. ... (SBSR 2023).',
            year: '2023',
            idioma: 'PT-BR'
        },
        {
            id: 'AC3',
            type: 'AC',
            image: '../public/img/publicacoes/Figura_AC3_PS.png',
            title: 'Rumo a Estimativa Objetivas de Safras Agrícolas',
            links: ['https://proceedings.science/sbsr/sbsr-2023/trabalhos/rumo-a-estimativa-objetivas-de-safras-agricolas?lang=pt-br.'],
            citation: 'ADAMI, Marcos; CAMPOS, Patrícia; ... (SBSR 2023).',
            year: '2023',
            idioma: 'PT-BR'
        }

    ];

    try {
        const mapped = seed.map(p => ({
            // PublicacaoTipo: p.type || null,
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