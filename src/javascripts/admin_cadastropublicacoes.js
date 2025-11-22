document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const modo = params.get("modo"); // inserir, modificar, visualizar
    const id = params.get("Id");

    const form = document.getElementById('publicacaoForm');
    const title = document.getElementById('form-title');
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const saveButton = document.getElementById('btn-save');
    const imagePreview = document.getElementById('imagePreview');
    const imageFileInput = document.getElementById('PublicacaoImagemFile');
    const existingImagePathInput = document.getElementById('PublicacaoImagem');

    // Pré-visualização da imagem
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

    const setFormState = (isReadOnly) => {
        const elements = form.querySelectorAll('input, textarea, select');
        elements.forEach(el => {
            if (el.type !== 'hidden') {
                el.disabled = isReadOnly;
            }
        });
        saveButton.style.display = isReadOnly ? 'none' : 'block';
        imageFileInput.style.display = isReadOnly ? 'none' : 'block';
    };

    const fillForm = (data) => {
        for (const key in data) {
            const el = document.getElementById(key);
            if (!el) continue;
            if (el.type === "checkbox") {
                el.checked = data[key];
            } else {
                el.value = data[key];
            }
        }
        // Exibe a imagem existente
        if (data.PublicacaoImagem) {
            imagePreview.src = data.PublicacaoImagem;
            imagePreview.style.display = 'block';
        }
    };

    const showError = (message) => {
        loadingDiv.style.display = 'none';
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    };

    if (modo === 'inserir') {
        title.textContent = 'Nova Publicação';
        form.style.display = 'block';
    } else if (modo === 'modificar' || modo === 'visualizar') {
        if (!id) {
            showError("ID da publicação não fornecido.");
            return;
        }
        loadingDiv.style.display = 'block';

        try {
            const response = await fetch(`/publicacao/${id}`);
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados: ${response.statusText}`);
            }
            const data = await response.json();

            loadingDiv.style.display = 'none';
            form.style.display = 'block';
            fillForm(data);

            if (modo === 'visualizar') {
                title.textContent = 'Visualizar Publicação';
                setFormState(true); // Bloqueia os campos
            } else {
                title.textContent = 'Editar Publicação';
                setFormState(false); // Garante que os campos estão editáveis
            }
        } catch (err) {
            showError(`Não foi possível carregar a publicação. ${err.message}`);
        }
    } else {
        showError("Modo de operação inválido.");
    }

    // Lógica de envio do formulário
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (modo === 'visualizar') return;

        const formData = new FormData(form);
        
        // O FormData já pega o valor do checkbox se ele tiver um 'name'
        // Mas para garantir que 'false' seja enviado se desmarcado, fazemos isso:
        if (!formData.has('PublicacaoVisibilidade')) {
            formData.set('PublicacaoVisibilidade', false);
        } else {
            formData.set('PublicacaoVisibilidade', true);
        }

        // O arquivo já é adicionado ao FormData pelo navegador se tiver um 'name'

        const method = modo === 'inserir' ? 'POST' : 'PUT';
        const url = modo === 'inserir' ? '/publicacao' : `/publicacao/${id}`;

        try {
            const response = await fetch(url, {
                method: method,
                body: formData // Não defina o 'Content-Type', o navegador fará isso
            });

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.erro || 'Erro ao salvar os dados.');
            }

            window.location.href = '/admin/publicacoes';

        } catch (err) {
            showError(`Erro: ${err.message}`);
        }
    });
});