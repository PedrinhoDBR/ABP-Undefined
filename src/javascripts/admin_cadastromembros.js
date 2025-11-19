document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const modo = params.get("modo"); // inserir, modificar, visualizar
    const id = params.get("Id");

    const form = document.getElementById('membroForm');
    const nome = document.getElementById('MembroNome');
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const saveButton = document.getElementById('btn-save');
    const imagePreview = document.getElementById('imagePreview');
    const imageFileInput = document.getElementById('MembroImagemFile');
    const existingImagePathInput = document.getElementById('MembroImagem');

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
        if (data.MembroImagem) {
            imagePreview.src = data.MembroImagem;
            imagePreview.style.display = 'block';
        }
    };

    const showError = (message) => {
        loadingDiv.style.display = 'none';
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    };

    if (modo === 'inserir') {
        nome.textContent = 'Novo Membro';
        form.style.display = 'block';
    } else if (modo === 'modificar' || modo === 'visualizar') {
        if (!id) {
            showError("ID do membro não fornecido.");
            return;
        }
        loadingDiv.style.display = 'block';

        try {
            const response = await fetch(`/membro/${id}`);
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados: ${response.statusText}`);
            }
            const data = await response.json();

            loadingDiv.style.display = 'none';
            form.style.display = 'block';
            fillForm(data);

            if (modo === 'visualizar') {
                nome.textContent = 'Visualizar Membro';
                setFormState(true); // Bloqueia os campos
            } else {
                nome.textContent = 'Editar Membro';
                setFormState(false); // Garante que os campos estão editáveis
            }
        } catch (err) {
            showError(`Não foi possível carregar o membro. ${err.message}`);
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
        if (!formData.has('MembroVisibilidade')) {
            formData.set('MembroVisibilidade', false);
        } else {
            formData.set('MembroVisibilidade', true);
        }

        // O arquivo já é adicionado ao FormData pelo navegador se tiver um 'name'

        const method = modo === 'inserir' ? 'POST' : 'PUT';
        const url = modo === 'inserir' ? '/membro' : `/membro/${id}`;

        try {
            const response = await fetch(url, {
                method: method,
                body: formData // Não defina o 'Content-Type', o navegador fará isso
            });

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.erro || 'Erro ao salvar os dados.');
            }

            alert('Membro salvo com sucesso!');
            window.location.href = '/admin/membros';

        } catch (err) {
            alert(`Erro: ${err.message}`);
        }
    });
});