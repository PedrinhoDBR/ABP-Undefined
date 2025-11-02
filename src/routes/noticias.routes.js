const express = require('express');
// const multer = require('multer');
// const path = require('path');
const { Op, fn, col, where: whereFn } = require('sequelize');
const Noticias = require('../models/noticias');
const router = express.Router();

/// Rota para todas as Noticias


router.get('/', async (res, req) => {


    try {
        const paginanoticias = await Noticias.findAll({
            order: [
                ['id', 'ASC']
            ]
        });

        res.json({ results: paginanoticias });
    } catch(error){
        console.error('Erro ao buscar a pagina de noticias:', error);
        res.status(500).json({erro: 'Erro ao buscar noticias', detalhes: error.message});
    }


})


/// Rota pra noticia especifica 

router.get('/:paginanoticiasId', async (req, res) => {
    const { paginanoticiasId } = req.params;

    try {

        const paginanoticias = await Noticias.findByPk(paginanoticiasId)

        if (!paginanoticias) {
            return res.status(404).json({ erro: "Pagina noticia não pode ser encontrado" })
        }


        res.json(projeto)


    }
    catch (error) {
        console.error('Erro ao buscar noticia:', error);
        res.status(500).json({
            erro: 'Erro interno ao buscar noticia',
            detalhes: error.message
        });
    }

})

router.post('/default' , async (req , res) => {
    
    const seed = [
    {
       imagem :'../public/img/noticias/imagemcarroselnoticias1.png', 
       titulo:'Distribuição espacial dos grupos de pesquisa responsáveis pelos artigos identificados e produção (megatons) de cana-de-açúcar para 2021.',
       Tipo: 'carrosel'
     
    },
   {
       imagem :'../public/img/1paginanoticia.png',
       data:'12 de Maio de 2025',
       titulo:'Sistemas de Irrigação Inteligente Economizam até 50% de Água',
       subtitulo:'Tecnologia que combina sensores de umidade do solo e dados meteorológicos está revolucionando a forma como a agricultura utiliza recursos hídricos.',
       conteudo:'',
       cardcitacao:'',
       idioma:'PT-BR'
    },
  {
       imagem :'../public/img/noticias/2hovernoticia.png',
       data:'10 de Maio de 2025',
       titulo:'Novo Sensor Portátil Realiza Análise de Solo em Tempo Real',
       subtitulo:'Pesquisadores desenvolvem dispositivo capaz de medir nutrientes do solo instantaneamente, eliminando a espera por laboratórios.',
       conteudo:'',
       cardcitacao:'',
       idioma:'PT-BR'
    },
    {
       imagem :'../public/img/noticias/3hovernoticia.png',
       data:'07 de Maio de 2025',
       titulo:'Tecnologias Verdes Transformam a Agricultura Sustentável',
       subtitulo:'Combinação de sensoriamento remoto e inteligência artificial está criando novas possibilidades para uma agricultura mais ecológica e eficiente.',
       conteudo:'',
       cardcitacao:'',
       idioma:'PT-BR'
    },
    {
       imagem :'../public/img/noticias/4hovernoticia.jpg',
       data:'29 de Abril de 2025',
       titulo:'Plataforma Integrada de Monitoramento Agrícola Ganha Prêmio Internacional',
       subtitulo:'Sistema brasileiro que une dados de satélite, drones e sensores terrestres é reconhecido como inovação do ano no agronegócio.',
       conteudo:'',
       cardcitacao:'',
       idioma:'PT-BR'
    },
    {
       imagem :'../public/img/noticias/5hovernoticia.jpg',
       data:'14 de Abril de 2025',
       titulo:'Agricultura Digital: Como a Tecnologia Está Transformando o Campo',
       subtitulo:'Agricultura Digital: Como a Tecnologia Está Transformando o Campo',
       conteudo:'',
       cardcitacao:'',
       idioma:'PT-BR'
    },
    {
       imagem :'../public/img/noticias/6hovernoticia.jpg',
       data:'30 de Março de 2025',
       titulo:'Sistemas de Gestão Agrícola Aumentam Lucratividade em 40%',
       subtitulo:'Plataformas integradas de gestão estão ajudando produtores a reduzir custos e aumentar a produtividade através de dados em tempo real.',
       conteudo:'',
       cardcitacao:'',
       idioma:'PT-BR'
    },
    {
       imagem :'../public/img/noticias/7hovernoticia.jpg',
       data:'17 de Março de 2025',
       titulo:'Monitoramento Climático Preciso Aumenta Segurança na Agricultura',
       subtitulo:'Tecnologias de previsão do tempo e monitoramento climático estão ajudando agricultores a mitigar riscos e tomar decisões mais assertivas.',
       conteudo:'',
       cardcitacao:'',
       idioma:'PT-BR'
    },
    {
       imagem :'../public/img/noticias/8hovernoticia.jpg',
       data:'18 de Fevereiro de 2025',
       titulo:'nergia Solar se Torna Opção Viável para Propriedades Rurais',
       subtitulo:'Cada vez mais agricultores estão adotando sistemas de energia solar para reduzir custos e aumentar a sustentabilidade de suas operações.',
       conteudo:'',
       cardcitacao:'',
       idioma:'PT-BR'
    }
];
    try {
        const mapped = seed.map(n => ({
            //NoticiasTipo: n.type || null,
            NoticiasImagem: n.imagem ||null,
            NoticiasData: n.data || null,
            NoticiasTitulo: n.titulo ||null,
            NoticiasSubtitulo: n.subtitulo || null,
            NoticiasConteudo: n.conteudo || null,
            NoticiasCardcitacao: n.cardcitacao || null,
            NoticiasIdioma: n.idioma || 'PT-BR'

        }));
   
        const created = await Noticias.bulkCreate(mapped, { validate: true });
        res.json({ inserted: created.length, results: created });
    } catch (error) {
        console.error('Erro ao inserir noticias padrão:', error);
        res.status(500).json({ erro: 'Erro ao inserir noticias padrão', detalhes: error.message });
    }
  
});

module.exports = router;