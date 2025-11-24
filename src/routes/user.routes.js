const express = require('express');
const Users = require('../models/user');
const router = express.Router();

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


router.post('/logout', async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao encerrar sessão:', err);
            return res.status(500).json({ error: 'Erro ao encerrar sessão' });
        }
        res.clearCookie('connect.sid');
        res.redirect('/'); 
    });
});


module.exports = router;