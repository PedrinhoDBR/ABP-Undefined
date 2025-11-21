document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const modo = params.get("modo");
    const id = params.get("Id");

    const form = document.getElementById('noticiaForm');
    const title = document.getElementById('form-title');
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const saveButton = document.getElementById('btn-save');
    const imagePreview = document.getElementById('imagePreview');
    const imageFileInput = document.getElementById('NoticiasImagemFile');
    const existingImagePathInput = document.getElementById('NoticiasImagem');

    imageFileInput.addEventListener('change', () => {
        const file = imageFileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    //  Formata data para exibição
    function formatarDataParaInput(data) {
        if (!data) return '';
        
        try {
            const dataObj = new Date(data);
            // Ajusta fuso horário para exibição
            const dataAjustada = new Date(dataObj.getTime() + dataObj.getTimezoneOffset() * 60000);
            return dataAjustada.toISOString().split('T')[0];
        } catch (e) {
            console.error('Erro ao formatar data:', e);
            return '';
        }
    }

    const fillForm = (data) => {
        for (const key in data) {
            const el = document.getElementById(key);
            if (!el) continue;
            
            if (key === 'NoticiasData' && data[key]) {
                // ✅ USA FUNÇÃO CORRIGIDA
                el.value = formatarDataParaInput(data[key]);
            } else {
                el.value = data[key] || '';
            }
        }
        
        if (data.NoticiasImagem) {
            imagePreview.src = data.NoticiasImagem;
            imagePreview.style.display = 'block';
        }
    };

    const showError = (message) => {
        loadingDiv.style.display = 'none';
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    };

    if (modo === 'inserir') {
        title.textContent = 'Nova Notícia';
        form.style.display = 'block';
        // DATA ATUAL CORRETA
        document.getElementById('NoticiasData').value = new Date().toISOString().split('T')[0];
    } else if (modo === 'modificar') {
        if (!id) {
            showError("ID da notícia não fornecido.");
            return;
        }
        loadingDiv.style.display = 'block';

        try {
            const response = await fetch(`/api/noticias/${id}`);
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados: ${response.statusText}`);
            }
            const data = await response.json();

            loadingDiv.style.display = 'none';
            form.style.display = 'block';
            fillForm(data);
            title.textContent = 'Editar Notícia';
            
        } catch (err) {
            showError(`Não foi possível carregar a notícia. ${err.message}`);
        }
    } else {
        showError("Modo de operação inválido.");
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        
        const noticiasID = formData.get('NoticiasID');
        if (noticiasID === '') {
            formData.delete('NoticiasID');
        }

        // Data correta para envio (sem ajuste de fuso)
        const dataInput = document.getElementById('NoticiasData').value;
        if (dataInput) {
            // Mantém a data como está para o servidor
            formData.set('NoticiasData', dataInput + 'T00:00:00.000Z');
        }

        const method = modo === 'inserir' ? 'POST' : 'PUT';
        const url = modo === 'inserir' ? '/api/noticias' : `/api/noticias/${id}`;

        try {
            console.log('Enviando dados...', Object.fromEntries(formData));
            
            const response = await fetch(url, {
                method: method,
                body: formData
            });

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.erro || 'Erro ao salvar os dados.');
            }

            alert('Notícia salva com sucesso!');
            window.location.href = '/admin/noticias';

        } catch (err) {
            console.error('Erro completo:', err);
            alert(`Erro: ${err.message}`);
        }
    });
});