const path = require('path');
const { sequelize } = require('./db/db');
const express = require("express");
const cors = require("cors");
const Publicacao  = require("./routes/publicacoes.routes");
const Projetos = require('./routes/projetos.routes');
const Membros  = require("./routes/membros.routes");
const Noticias = require('./routes/noticias.routes')

// const Projetos = require('./routes/projetos.routes');

const dotenv = require("dotenv");
dotenv.config();

//CRIAR AS TABELAS NO POSTGRES
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Tabelas sincronizadas com sucesso!');
  })
  .catch((err) => {
    console.error('Erro ao sincronizar tabelas:', err);
  });

const PORTA = process.env.PORTA || 3030;

const app = express(); 

app.use('/Layout', express.static(path.join(__dirname, '..', 'Layout')));

app.use(cors())

app.use(express.json());


app.use(express.static(path.join(__dirname, '..')));
app.use('/public', express.static(path.join(__dirname, '..', 'public')));
app.use('/css', express.static(path.join(__dirname, '..', 'css')));
app.use('/javascripts', express.static(path.join(__dirname, '..', 'javascripts')));
app.use('/img', express.static(path.join(__dirname, '..', 'public', 'img')));

// Servir páginas HTML
app.use('/pages', express.static(path.join(__dirname, '..', 'pages')));

// Rota para a página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'projetos.html'));
});

// Rota para projetos
app.get('/projetos', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'projetos.html'));
});

//rotas publicas
app.use('/publicacao', Publicacao);
app.use('/projeto', Projetos);

app.use('/membros', Membros);

app.use('/noticias' , Noticias)

app.use(function(req,res){
    res.json({erro:"Rota desconhecida", path: req.path});
});

app.listen(PORTA, () => {
    console.log(`Rodando na porta ${PORTA}...`);
    console.log(`🏠 Página principal: http://localhost:${PORTA}/`);
    console.log(`📋 Página de projetos: http://localhost:${PORTA}/projetos`);
    console.log(`📊 API Projetos: http://localhost:${PORTA}/projeto`);
    console.log(`🎨 CSS: http://localhost:${PORTA}/css/projetos.css`);
});
// app.use('/projetos', Projetos);
