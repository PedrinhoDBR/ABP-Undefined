const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");

dotenv.config();

const EMAIL_DESTINO = process.env.EMAIL_AGRIRS

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: SMTP_USER,
//         pass: SMTP_PASS
//     }
// });

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

router.post('/enviar', async (req, res) => {
    const { nome, mail, assunto } = req.body;

    const dadosFormulario = {
        nome: nome,
        email_remetente: mail,
        mensagem: assunto
    }

    const mailOptions = {
        from: `"${dadosFormulario.nome}" <${dadosFormulario.email_remetente}>`,
        to: EMAIL_DESTINO,
        subject: `Novo contato de site de ${dadosFormulario.nome}`,
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
        res.redirect('/contato?status=success');
    } catch(error) {
        console.error('ERRO ao tentar enviar e-mail:', error);
        res.redirect('/contato?status=error');
    }
});

module.exports = router;

