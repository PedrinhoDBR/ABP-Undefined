const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const EMAIL_DESTINO = process.env.EMAIL_AGRIRS;

// Configuração base com timeouts e pooling (porta 587 STARTTLS)
const baseSmtpConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    requireTLS: true,
    connectionTimeout: 15000,
    greetingTimeout: 8000,
    socketTimeout: 20000,
    // Desativa pool para evitar ficar aguardando conexões em ambiente restrito
    pool: false,
    logger: process.env.SMTP_LOG === 'true',
    debug: process.env.SMTP_DEBUG === 'true',
    family: 4, // força IPv4 (alguns hosts têm issues IPv6)
};

let transporter = nodemailer.createTransport(baseSmtpConfig);

function fallbackTransport() {
    return nodemailer.createTransport({
        ...baseSmtpConfig,
        port: 465,
        secure: true,
        requireTLS: false,
    });
}

router.post('/enviar', async (req, res) => {
    const { nome, mail, email, assunto } = req.body;
    const remetenteEmail = mail || email;

    if (!nome || !remetenteEmail || !assunto) {
        console.warn('Contato inválido: campos obrigatórios ausentes', { nome, remetenteEmail, assunto });
        return res.redirect('/contato?status=invalid');
    }

    const dadosFormulario = {
        nome: nome.trim(),
        email_remetente: remetenteEmail.trim(),
        mensagem: assunto.trim(),
    };

    const mailOptions = {
        from: `"${dadosFormulario.nome}" <${dadosFormulario.email_remetente}>`,
        to: EMAIL_DESTINO,
        subject: `Novo contato de ${dadosFormulario.nome}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px;">
                <h1 style="color: #1a73e8; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">Novo Contato do Site</h1>
                <h2 style="color: #333; font-size: 18px; margin-bottom: 10px;">Dados do Remetente</h2>
                <p style="margin-bottom: 10px;"><strong>Nome:</strong> ${dadosFormulario.nome}</p>
                <p style="margin-bottom: 20px;"><strong>E-mail para Resposta:</strong> <a href="mailto:${dadosFormulario.email_remetente}" style="color: #1a73e8; text-decoration: none;">${dadosFormulario.email_remetente}</a></p>
                <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">Mensagem Enviada:</h2>
                <div style="border: 1px solid #ddd; padding: 15px; background-color: #f9f9f9; border-radius: 4px;">
                    <p style="margin: 0; white-space: pre-wrap;">${dadosFormulario.mensagem}</p>
                </div>
                <p style="margin-top: 30px; font-size: 12px; color: #999;">Esta mensagem foi enviada automaticamente pelo formulário de contato do site.</p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`E-mail enviado com sucesso de ${dadosFormulario.email_remetente}. ID: ${info.messageId}`);
        return res.redirect('/contato?status=success');
    } catch (error) {
        console.error('Primeira tentativa falhou:', { message: error.message, code: error.code, command: error.command });
        if (/timeout/i.test(error.message)) {
            console.log('Tentando fallback em porta 465 (SSL)...');
            try {
                const alt = fallbackTransport();
                const info2 = await alt.sendMail(mailOptions);
                console.log(`E-mail enviado (fallback SSL). ID: ${info2.messageId}`);
                return res.redirect('/contato?status=success');
            } catch (err2) {
                console.error('Fallback também falhou:', { message: err2.message, code: err2.code, command: err2.command });
                console.error('Sugestão: verificar se o provedor bloqueia SMTP outbound (porta 587/465).');
            }
        }
        return res.redirect('/contato?status=error');
    }
});

module.exports = router;

