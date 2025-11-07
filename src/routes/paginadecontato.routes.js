const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const EMAIL_DESTINO = //inserir depois//; 
const SMTP_USER = //inserir depois//; 
const SMTP_PASS = //inserir depois//;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
    }
});

router.post ('/enviar', async (req, res) => {
    const { nome, mail, assunto } = req.body;

    const dadosFormulario = {
        nome: nome;
        email_remetente: mail;
        mensagem: assunto;
    }

    const mailOptions = {
        from: `"${dadosFormulario.nome}" <${dadosFormulario.email_remetente}>`,
        to: EMAIL_DESTINO,
        subject: `Novo contato de site dw ${dadosFormulario.nome}`,
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">Mensagem de ${dadosFormulario.nome}</h2>
        <hr>
        <p><strong>E-mail de Resposta:</strong> <a href="mailto:${dadosFormulario.email_remetente}">${dadosFormulario.email_remetente}</a></p>
        
        <h3 style="color: #555;">Conteúdo:</h3>
        <div style="border: 1px solid #ccc; padding: 15px; background-color: #f9f9f9;">
            <p>${dadosFormulario.mensagem}</p>
        </div>
    </div>
    `
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`E-mail enviado com sucesso de ${dadosFormulario.email_remetente}`);
        res.redirect('/pages/paginadecontato.html?status=success');
    } catch {
        console.error('ERRO ao tentar enviar e-mail:', error);
        res.redirect('/pages/paginadecontato.html?status=error');
    }
});

module.exports = router;

