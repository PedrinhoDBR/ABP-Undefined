document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const modo = params.get("modo"); // inserir, modificar, visualizar
    const id = params.get("Id");

    const form = document.getElementById('membroForm');
    const formTitle = document.getElementById('form-title'); 
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const saveButton = document.getElementById('btn-save');
    const imagePreview = document.getElementById('imagePreview');
    const imageFileInput = document.getElementById('MembrosImagemFile');
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

        imageFileInput.style.display = isReadOnly ? 'none' : 'block'; 
    };

    const fillForm = (data) => {
        for (const key in data) {

            const el = document.getElementById(key); 
            if (!el) continue;
            
            if (el.type === "checkbox") {
                el.checked = data[key];
            } else {
                el.value = data[key] || ''; 
            }
        }
        
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
            const response = await fetch(`/api/membros/${id}`); 
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados: ${response.statusText}`);
            }
            const data = await response.json();

            loadingDiv.style.display = 'none';
            form.style.display = 'block';
            fillForm(data);

            if (modo === 'visualizar') {
                formTitle.textContent = 'Visualizar Membro';
                setFormState(true); 
            } else {
                formTitle.textContent = 'Editar Membro';
                setFormState(false); 
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
        
      
        if (!formData.has('MembrosVisibilidade')) {
            formData.set('MembrosVisibilidade', false);
        } else {
            formData.set('MembrosVisibilidade', true);
        }
        


        const method = modo === 'inserir' ? 'POST' : 'PUT';
        const url = modo === 'inserir' ? '/api/membros' : `/api/membros/${id}`; 

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