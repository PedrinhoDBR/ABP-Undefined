const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const { Resend } = require('resend');

dotenv.config();

const EMAIL_DESTINO = process.env.EMAIL_AGRIRS;
const RESEND_API_KEY = process.env.RESEND_API_KEY; // NUNCA deixe chave hardcoded
const RESEND_FROM = process.env.RESEND_FROM || 'onboarding@resend.dev'; // ajuste para domínio verificado

if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY ausente: configure no ambiente para envio de e-mails.');
}

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// Removido SMTP/SendGrid: uso exclusivo de Resend (HTTP API)

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

    if (!resend) {
        console.error('Resend não inicializado (falta RESEND_API_KEY).');
        return res.redirect('/contato?status=error');
    }
    try {


        const { data, error } = await resend.emails.send({
            from: 'AGRIRS <onboarding@resend.dev>',
            to: EMAIL_DESTINO,
            reply_to: dadosFormulario.email_remetente,
            subject: `Novo contato de ${dadosFormulario.nome}`,
            html: mailOptions.html,
        });
        
        
        console.log('E-mail enviado via Resend API.');
        return res.redirect('/contato?status=success');
    } catch (e) {
        console.error('Erro Resend:', { message: e.message });
        return res.redirect('/contato?status=error');
    }
});


module.exports = router;

