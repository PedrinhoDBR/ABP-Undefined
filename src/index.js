const path = require('path');
const { sequelize } = require('./db/db');
const express = require("express");
const cors = require("cors");
const Publicacao  = require("./routes/publicacoes.routes");
const Projetos = require('./routes/projetos.routes');
const Membros  = require("./routes/membros.routes");
const Noticias = require('./routes/noticias.routes');
const UserRoutes = require('./routes/user.routes');
const PublicacaoModel = require('./models/publicacao');
const MembrosModel = require('./models/membros');
const NoticiasModel = require('./models/noticias');
const ProjetosModel = require('./models/projetos'); 
const contato = require('./routes/contato.routes');
const Users = require('./models/user');
const session = require('express-session');
const dotenv = require("dotenv");
const axios = require('axios');




dotenv.config();

// CRIAR AS TABELAS NO POSTGRES
sequelize.sync({ alter: true })
  .then(async () => {
    console.log('Tabelas sincronizadas com sucesso!');

    // default usuário admin
    const exists = await Users.findOne({ where: { UserName: 'admin' } });
    if (!exists) {
        await Users.create({ UserName: 'admin', UserPassword: 'admin123' });
        console.log('Usuário admin criado automaticamente!');
    }
  })
  .catch((err) => {
    console.error('Erro ao sincronizar tabelas:', err);
  });

const PORTA = process.env.PORTA || 3030;
const secret = process.env.SESSION_SECRET || 'MYSECRETCOOKIEKEY';

const app = express(); 

app.set('view-engine', 'ejs')

//SESSION STORAGE
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1 * 30 * 60 * 1000 } // 30 min
}));

app.use('/Layout', express.static(path.join(__dirname, 'Layout')));
app.use('/public', express.static(path.join(__dirname, '..', 'public')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/javascripts', express.static(path.join(__dirname, 'javascripts')));
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/img', express.static(path.join(__dirname, '..', 'public', 'img')));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    if (!req.session.idioma) {
        req.session.idioma = 'PT-BR'; 
    }
    res.locals.idioma = req.session.idioma; 
    next();
});

// ✅✅✅ ROTAS DE PÁGINAS PRIMEIRO - ESSENCIAIS!
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
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


app.get('/noticia', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'noticia_detalhe.html'));
});

// Rota para página de detalhes de projetos
app.get('/projeto', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'projetoCONAB.html'));
});

// ROTAS DE ADMIN
app.get('/admin', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', '/admin/index.html'));
});

app.get('/admin/publicacoes', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', '/admin/carteira_publicacoes.html'));
});

app.get('/admin/publicacao', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', '/admin/cadastro_publicacoes.html'));
});

app.get('/admin/publicacao', requireLogin, (req, res) => {
    const { Id } = req.query;
    res.sendFile(path.join(__dirname, 'pages', '/admin/cadastro_publicacoes.html'));
});

app.get('/admin/membros', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', '/admin/carteira_membros.html'));
});

app.get('/admin/membro', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', '/admin/cadastro_membros.html'));
});

app.get('/admin/projetos', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', '/admin/carteira_projetos.html'));
});

app.get('/admin/projeto', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', '/admin/cadastro_projetos.html'));
});

app.get('/admin/noticias', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', '/admin/carteira_noticias.html'));
});

app.get('/admin/noticia', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', '/admin/cadastro_noticias.html'));
});


app.use('/api/noticias', Noticias); 
app.use('/publicacao', Publicacao);
app.use('/api/publicacoes', Publicacao);
app.use('/projeto', Projetos);
app.use('/api/projetos', Projetos);
app.use('/api/membros', Membros);
app.use('/user', UserRoutes);
app.use('/contato', contato);

app.get('/inicial', async (req, res) => {
    const idioma = req.session.idioma || 'PT-BR'; 

    try {
        const publicacoes = await PublicacaoModel.findAll({ where: { PublicacaoIdioma: idioma,PublicacaoVisibilidade: true } });
        const membros = await MembrosModel.findAll({ where: { MembrosIdioma: idioma, MembrosVisibilidade: true } });
        const noticias = await NoticiasModel.findAll({ where: { NoticiasIdioma: idioma } });
        const projetos = await ProjetosModel.findAll({ where: { ProjetosIdioma: idioma,Ativo: true } });
         
        res.json({ publicacoes, membros, noticias, projetos });
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        res.status(500).json({ erro: 'Erro ao carregar dados.' });
    }
});

app.get('/get-idioma', (req, res) => {
    res.json({ idioma: req.session.idioma || 'PT-BR' });
});

app.post('/alterar-idioma', (req, res) => {
    const { idioma } = req.body;
    if (idioma) {
        req.session.idioma = idioma; 
    }
    res.status(200).json({ message: 'Idioma alterado com sucesso' });
});

app.use(function(req, res){
    res.json({erro:"Rota desconhecida", path: req.path});
});

app.listen(PORTA, '0.0.0.0', () => {
    console.log(`✅ Servidor rodando na porta ${PORTA}...`);
    console.log(`🏠 Página principal: http://localhost:${PORTA}/`);
    console.log(`👨‍💼 Admin : http://localhost:${PORTA}/admin/`);
});

function requireLogin(req, res, next) {
    if (!req.session.userId) {
        return res.sendFile(path.join(__dirname, 'pages', 'admin', 'login.html'));
    }
    next();
}