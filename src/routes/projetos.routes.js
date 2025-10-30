const express = require('express');
// const multer = require('multer');
// const path = require('path');
const Publicacao = require('../models/projetos');
const Projetos = require('../models/projetos');
const router = express.Router();



/// Rota para todos os projetos


router.get('/', async (res, req) => {


    try {
        const projetos = await Projetos.findAll({
            order: [
                ['id', 'ASC']
            ]
        });

        res.json({ results: projetos });
    } catch(error){
        console.error('Erro ao buscar a lista de projetos:', error);
        res.status(500).json({erro: 'Erro ao buscar projetos', detalhes: error.message});
    }

     
   


})



/// Rota pra noticia especifica 

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