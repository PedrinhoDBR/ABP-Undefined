const express = require('express');
const Users = require('../models/user');
const router = express.Router();

// Rota para validar login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await Users.findOne({ where: { UserName: username } });
        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }
        if (user.UserPassword !== password) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }
        
        req.session.userId = user.UserID;
        req.session.userName = user.UserName;
        res.json({ message: 'Login bem-sucedido', user: { id: user.UserID, name: user.UserName } });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao validar login', detalhes: error.message });
    }
});

module.exports = router;