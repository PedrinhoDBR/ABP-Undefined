const express = require('express');
// const multer = require('multer');
// const path = require('path');
const { Op, fn, col, where: whereFn } = require('sequelize');
const Membros = require('../models/membros');
const router = express.Router();

//ROTA PARA BUSCAR TODAS OS MEMBROS, com filtro basico

router.get('/', async (req, res) => {
    try {
        const { id, nome, cargo, idioma} = req.query;
        const where = {};
        if (idioma) {
            where.MembrosIdioma = idioma;
        }

        if (nome) { 
            where.MembrosNome = nome;
        }

        if (cargo) {
             const termo = cargo.toLowerCase();

            where[Op.or] = [
                whereFn(fn('LOWER', col('MembrosCargo')), { [Op.like]: `%${termo}%` })
            ];
        }
        // console.log('Filtros:', where);
        const membros = await Membros.findAll({where});
        // console.log('RET:',publicacoes)

        res.json({results: membros });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar membro', detalhes: error.message });
    }
});

router.post('/default', async (req, res) => {
    const seed = [
        {
            id: 'AC1',
            nome: 'Marcos Adami',
            cargo: 'Coordenador',
            imagem: '../public/img/membros/Marcos_Adami.jpg', 
            descricao: 'Pesquisador titular do Instituto Nacional de Pesquisas Espaciais, graduado em Ciências Econômicas pela Faculdade de Filosofia Ciências e Letras de Cornélio Procópio(1997), mestrado e doutorado em Sensoriamento Remoto pelo Instituto Nacional de Pesquisas Espaciais (2003 e 2010). Possui experiência em sistemas de informação geográfica e sensoriamento remoto com ênfase nos seguintes temas: análise de séries temporais, mudança de uso da terra, amostragem e estatísticas agrícolas.',
            lattes: 'http://lattes.cnpq.br/7484071887086439',
            idioma: 'PT-BR'
        },

    ];
try {
    const mapped = seed.map(p => ({
       
        MembrosNome: p.nome,
        MembrosCargo: p.cargo,
        MembrosImagem: p.imagem || null,
        MembrosDescricao: p.descricao || null,
        MembrosLattes: (Array.isArray(p.links) && p.links.length) ? p.links[0] : (p.doi || null),
        MembrosIdioma: p.idioma || 'PT-BR'
    }));

    const created = await Membros.bulkCreate(mapped, { validate: true });

    res.json({ inserted: created.length, results: created });
} catch (error) {
    console.error('Erro ao inserir seed de membros:', error);
    res.status(500).json({ erro: 'Erro ao inserir membros seed', detalhes: error.message });
}
});

module.exports = router;