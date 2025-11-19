const express = require('express');
const multer = require('multer');
const path = require('path');
const { Op, fn, col, where: whereFn } = require('sequelize');
const Membros = require('../models/membros');
const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ajuste o caminho conforme a estrutura do seu projeto
        cb(null, path.join(__dirname, '..', '..', 'public', 'img', 'membros')); 
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + ext);
    }
});

const upload = multer({ storage: storage });

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

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Busca a publicação pelo ID
        const membro = await Membros.findByPk(id);

        if (!membro) {
            return res.status(404).json({ erro: 'Membro não encontrado' });
        }

        res.json(membro);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar membro', detalhes: error.message });
    }
});


router.post('/', upload.single('MembroImagemFile'), async (req, res) => {
    try {
        const dados = req.body;

        // Se uma imagem foi enviada, salva o caminho dela no banco
        if (req.file) {
            // Salva o caminho relativo que pode ser usado no frontend
            dados.MembrosImagem = `/img/membros/${req.file.filename}`;
        }
        dados.MembrosID = null
        const novoMembro = await Membros.create(dados);
        res.status(201).json(novoMembro);
    } catch (error) {
        console.error('Erro ao criar membro:', error);
        res.status(500).json({ erro: 'Erro ao criar membro', detalhes: error.message });
    }
});

router.put('/:id', upload.single('MembroImagemFile'), async (req, res) => {
    const { id } = req.params;
    try {
        const dados = req.body;
        console.log(dados)
        // Se uma nova imagem foi enviada, atualiza o caminho
        if (req.file) {
            dados.MembrosImagem = `/public/uploads/membros/${req.file.filename}`;
        }

        const [updated] = await Membros.update(dados, {
            where: { MembrosID: id }
        });

        if (updated) {
            const membroAtualizado = await Membros.findByPk(id);
            return res.json(membroAtualizado);
        }
        throw new Error('Membro não encontrada para atualização');

    } catch (error) {
        console.error('Erro ao atualizar membro:', error);
        res.status(500).json({ erro: 'Erro ao atualizar membro', detalhes: error.message });
    }
});


router.put('/inativar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const membro = await Membros.findByPk(id);
        if (!membro) {
            return res.status(404).json({ erro: "Membro não encontrado" });
        }
        membro.MembrosVisibilidade = false; // Inativa o membro
        await membro.save();
        res.json({ mensagem: "Membro inativado com sucesso!" });
    } catch (error) {
        console.error('Erro ao inativar membro:', error);
        res.status(500).json({ erro: 'Erro interno ao inativar membro', detalhes: error.message });
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
        {
            id: 'AC2',
            nome: 'Marcus Adami',
            cargo: 'Coordenador',
            imagem: '../public/img/membros/Marcos_Adami.jpg', 
            descricao: 'Pesquisador titular do Instituto Nacional de Pesquisas Espaciais, graduado em Ciências Econômicas pela Faculdade de Filosofia Ciências e Letras de Cornélio Procópio(1997), mestrado e doutorado em Sensoriamento Remoto pelo Instituto Nacional de Pesquisas Espaciais (2003 e 2010). Possui experiência em sistemas de informação geográfica e sensoriamento remoto com ênfase nos seguintes temas: análise de séries temporais, mudança de uso da terra, amostragem e estatísticas agrícolas.',
            lattes: 'http://lattes.cnpq.br/7484071887086439',
            idioma: 'PT-BR'
        }        
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