const express = require('express');
const Projetos = require('../models/projetos');
const router = express.Router();




router.get('/ultimos', async (req, res) => {
    try {
        const projetos = await Projetos.findAll({
            limit: 3, 
            order: [['ProjetosId', 'DESC']]
        });
        
    
        res.status(200).json({ results: projetos }); 
        
    } catch (error) {
        console.error("ERRO CRÍTICO NA ROTA /ultimos:", error);
        res.status(500).json({ erro: 'Erro interno ao buscar dados do banco' });
    }
});

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