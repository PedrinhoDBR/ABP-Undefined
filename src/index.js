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
const contato = require('./routes/contato.routes');
const Users = require('./models/user');
const session = require('express-session');
const dotenv = require("dotenv");
const axios = require('axios');

dotenv.config();

//CRIAR AS TABELAS NO POSTGRES
sequelize.sync({ alter: true })
  .then(async () => {
    console.log('Tabelas sincronizadas com sucesso!');

    // default usuário admin
    const exists = await Users.findOne({ where: { UserName: 'admin' } });
    if (!exists) {
        await Users.create({ UserName: 'admin', UserPassword: 'admin123' });
        console.log('Usuário admin criado automaticamente!');
    }

    // default publicacoes
    const pubCount = await PublicacaoModel.count();
    if (pubCount === 0) {
        const publicacoesDefault = require('./routes/publicacoes.routes');
        if (typeof publicacoesDefault.seedDefault === 'function') {
            await publicacoesDefault.seedDefault();
        } else {
            try {
                await axios.post(`http://localhost:${process.env.PORTA || 3030}/publicacao/default`);
                console.log('Seed de publicações executado!');
            } catch (err) {
                console.error('Erro ao executar seed de publicações:', err.message);
            }
        }
    }

    // default membros
    const membrosCount = await MembrosModel.count();
    if (membrosCount === 0) {
        const membrosDefault = require('./routes/membros.routes');
        if (typeof membrosDefault.seedDefault === 'function') {
            await membrosDefault.seedDefault();
        } else {
            try {
                await axios.post(`http://localhost:${process.env.PORTA || 3030}/membros/default`);
                console.log('Seed de membros executado!');
            } catch (err) {
                console.error('Erro ao executar seed de membros:', err.message);
            }
        }
    }
  })
  .catch((err) => {
    console.error('Erro ao sincronizar tabelas:', err);
  });

//LOGIN DEFAULT

const PORTA = process.env.PORTA || 3030;
const secret = process.env.SESSION_SECRET || 'MYSECRETCOOKIEKEY';

const app = express(); 

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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//paginas html
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

//ROTAS DE ADMIN, ADICIONAR O requireLogin PARA VALIDAR SE O USUARIO ESTÁ LOGADDO
app.get('/admin',requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', '/admin/index.html'));
});

app.get('/admin/publicacoes',requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', '/admin/carteira_publicacoes.html'));
});

app.get('/admin/publicacao', requireLogin, (req, res) => {
    const { Id } = req.query;
    res.sendFile(path.join(__dirname, 'pages', '/admin/cadastro_publicacoes.html'));
});


//rotas publicas
app.use('/publicacao', Publicacao);
app.use('/projeto', Projetos);
app.use('/membros', Membros);
app.use('/noticias', Noticias);
app.use('/user', UserRoutes);
app.use('/contato', contato);


app.use(function(req, res){
    res.json({erro:"Rota desconhecida", path: req.path});
});

app.listen(PORTA,'0.0.0.0', () => {
    console.log(`Rodando na porta ${PORTA}...`);
    console.log(`🏠 Página principal: http://localhost:${PORTA}/`);
});

function requireLogin(req, res, next) {
    if (!req.session.userId) {
        return res.sendFile(path.join(__dirname, 'pages', 'admin', 'login.html'));
    }
    next();
}
