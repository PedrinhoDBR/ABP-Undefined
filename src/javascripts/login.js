document.getElementById('login-btn').addEventListener('click', async function() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const errorDiv = document.getElementById('login-error');
    errorDiv.textContent = '';

    if (!username || !password) {
        errorDiv.textContent = 'Preencha usuário e senha.';
        return;
    }

    try {
        const res = await fetch('/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (res.ok) {

            window.location.href = '/pages/publicacoes-admin.html';
        } else {
            errorDiv.textContent = data.error || 'Usuário ou senha inválidos.';
        }
    } catch (err) {
        errorDiv.textContent = 'Erro ao conectar ao servidor.';
    }
});