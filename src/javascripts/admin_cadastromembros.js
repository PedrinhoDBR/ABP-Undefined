document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const modo = params.get("modo"); // inserir, modificar, visualizar
    const id = params.get("Id");

    const form = document.getElementById('membroForm');
    // CORREÇÃO: Usar MembrosNome (Plural)
    const formTitle = document.getElementById('form-title'); 
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const saveButton = document.getElementById('btn-save');
    const imagePreview = document.getElementById('imagePreview');
    // CORREÇÃO: Usar MembrosImagemFile (Plural)
    const imageFileInput = document.getElementById('MembrosImagemFile');
    // CORREÇÃO: Usar MembrosImagem (Plural)
    const existingImagePathInput = document.getElementById('MembrosImagem');

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
        // CORREÇÃO: Ocultar o input de arquivo (MembrosImagemFile) em modo visualização
        imageFileInput.style.display = isReadOnly ? 'none' : 'block'; 
    };

    const fillForm = (data) => {
        for (const key in data) {
            // O ID do elemento no HTML agora é Membros[NomeDoCampo]
            const el = document.getElementById(key); 
            if (!el) continue;
            
            if (el.type === "checkbox") {
                el.checked = data[key];
            } else {
                el.value = data[key] || ''; // Garante que campos vazios não causem erro
            }
        }
        
        // CORREÇÃO: Usar a chave MembrosImagem do objeto de dados
        if (data.MembrosImagem) { 
            imagePreview.src = data.MembrosImagem;
            imagePreview.style.display = 'block';
        }
    };

    const showError = (message) => {
        loadingDiv.style.display = 'none';
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        form.style.display = 'none';
    };

    if (modo === 'inserir') {
        formTitle.textContent = 'Novo Membro';
        loadingDiv.style.display = 'none';
        form.style.display = 'block';
        setFormState(false);
    } else if (modo === 'modificar' || modo === 'visualizar') {
        if (!id) {
            showError("ID do membro não fornecido.");
            return;
        }
        loadingDiv.style.display = 'block';

        try {
            // CORREÇÃO: A URL da API é /membros (plural)
            const response = await fetch(`/membros/${id}`); 
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados: ${response.statusText}`);
            }
            const data = await response.json();

            loadingDiv.style.display = 'none';
            form.style.display = 'block';
            fillForm(data);

            if (modo === 'visualizar') {
                formTitle.textContent = 'Visualizar Membro';
                setFormState(true); // Bloqueia os campos
            } else {
                formTitle.textContent = 'Editar Membro';
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
        
        // CORREÇÃO: Usar a chave MembrosVisibilidade (Plural)
        if (!formData.has('MembrosVisibilidade')) {
            formData.set('MembrosVisibilidade', false);
        } else {
            // O valor do checkbox, se marcado, é geralmente "on". 
            // Para garantir que o Sequelize receba um booleano:
            formData.set('MembrosVisibilidade', true);
        }
        
        // O input hidden MembrosImagem (caminho antigo) é mantido, 
        // e o novo arquivo (MembrosImagemFile) é enviado pelo FormData.

        const method = modo === 'inserir' ? 'POST' : 'PUT';
        // CORREÇÃO: A URL da API é /membros (plural)
        const url = modo === 'inserir' ? '/membros' : `/membros/${id}`; 

        try {
            const response = await fetch(url, {
                method: method,
                body: formData
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