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
        subject: `Novo contato de ${dadosFormulario.nome}`,
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px;">
            
            <h1 style="color: #1a73e8; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">
                Novo Contato do Site
            </h1>

            <h2 style="color: #333; font-size: 18px; margin-bottom: 10px;">
                Dados do Remetente
            </h2>
            <p style="margin-bottom: 10px;">
                <strong>Nome:</strong> ${dadosFormulario.nome}
            </p>
            <p style="margin-bottom: 20px;">
                <strong>E-mail para Resposta:</strong> 
                <a href="mailto:${dadosFormulario.email_remetente}" style="color: #1a73e8; text-decoration: none;">
                    ${dadosFormulario.email_remetente}
                </a>
            </p>

            <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">
                Mensagem Enviada:
            </h2>
            <div style="border: 1px solid #ddd; padding: 15px; background-color: #f9f9f9; border-radius: 4px;">
                <p style="margin: 0; white-space: pre-wrap;">
                    ${dadosFormulario.mensagem}
                </p>
            </div>
            
            <p style="margin-top: 30px; font-size: 12px; color: #999;">
                Esta mensagem foi enviada automaticamente pelo formulário de contato do site.
            </p>
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

