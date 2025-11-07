const express = require('express');
const Users = require('../models/user');
const router = express.Router();

// Rota para inserir o usuário admin (executar uma vez)
router.post('/seed', async (req, res) => {
    try {
        const exists = await Users.findOne({ where: { MembrosName: 'admin' } });
        if (exists) {
            return res.status(400).json({ message: 'Usuário admin já existe.' });
        }
        const user = await Users.create({
            MembrosName: 'admin',
            UsersPassword: 'admin123'
        });
        res.json({ message: 'Usuário admin criado!', user });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário admin', detalhes: error.message });
    }
});

// Rota para validar login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await Users.findOne({ where: { MembrosName: username } });
        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }
        if (user.UsersPassword !== password) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }
        res.json({ message: 'Login bem-sucedido', user: { id: user.UsersID, name: user.MembrosName } });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao validar login', detalhes: error.message });
    }
});

module.exports = router;