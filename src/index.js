const path = require('path');
const { sequelize } = require('./db/db');
const express = require("express");
const cors = require("cors");
const Publicacao  = require("./routes/publicacoes.routes");
const Projetos = require('./routes/projetos.routes');
const Membros  = require("./routes/membros.routes");
const Noticias = require('./routes/noticias.routes');
const UserRoutes = require('./routes/user.routes');

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

// Ajuste dos caminhos estáticos para dentro de src/
app.use('/Layout', express.static(path.join(__dirname, 'Layout')));
app.use('/public', express.static(path.join(__dirname, '..', 'public')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/javascripts', express.static(path.join(__dirname, 'javascripts')));
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', '/admin/login.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', '/admin/index.html'));
});

app.get('/projetos', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'projetos.html'));
});

app.get('/publicacoes', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'publicacoes.html'));
});

app.get('/contato', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'paginadecontato.html'));
});

app.get('/sobre', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'sobre.html'));
});

app.get('/facaparte', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'facaparte.html'));
});

app.get('/noticias', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'paginanoticias.html'));
});

app.get('/equipe', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'membros.html'));
});



//rotas publicas
app.use('/publicacao', Publicacao);
app.use('/projeto', Projetos);
app.use('/membros', Membros);
app.use('/noticias', Noticias);
app.use('/user', UserRoutes);


app.use(function(req, res){
    res.json({erro:"Rota desconhecida", path: req.path});
});

app.listen(PORTA, () => {
    console.log(`Rodando na porta ${PORTA}...`);
    console.log(`🏠 Página principal: http://localhost:${PORTA}/`);
});