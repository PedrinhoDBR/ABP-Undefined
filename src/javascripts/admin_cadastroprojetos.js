document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const modo = params.get("modo"); // inserir, modificar, visualizar
    const id = params.get("Id");

    const form = document.getElementById('projetoForm');
    const title = document.getElementById('form-title');
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const saveButton = document.getElementById('btn-save');
    const carrosselPreview = document.getElementById('carrosselPreview');
    const cardPreview = document.getElementById('cardPreview');
    const carrosselFileInput = document.getElementById('ImagemCarrosselFile');
    const cardFileInput = document.getElementById('ImagemCardFile');
    const existingCarrosselPathInput = document.getElementById('ImagemCarrossel');
    const existingCardPathInput = document.getElementById('ImagemCard');

    // Pré-visualização das imagens
    carrosselFileInput.addEventListener('change', () => {
        const file = carrosselFileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                carrosselPreview.src = e.target.result;
                carrosselPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    cardFileInput.addEventListener('change', () => {
        const file = cardFileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                cardPreview.src = e.target.result;
                cardPreview.style.display = 'block';
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
        carrosselFileInput.style.display = isReadOnly ? 'none' : 'block';
        cardFileInput.style.display = isReadOnly ? 'none' : 'block';
    };

    const fillForm = (data) => {
        for (const key in data) {
            const el = document.getElementById(key);
            if (!el) continue;
            
            if (el.type === "checkbox") {
                el.checked = data[key];
            } else if (key === "Informacoes" && data[key]) {
                try {
                    el.value = JSON.stringify(data[key], null, 2);
                } catch (e) {
                    el.value = data[key];
                }
            } else {
                el.value = data[key] || '';
            }
        }
        
        // Exibe as imagens existentes
        if (data.ImagemCarrossel) {
            carrosselPreview.src = data.ImagemCarrossel;
            carrosselPreview.style.display = 'block';
        }
        if (data.ImagemCard) {
            cardPreview.src = data.ImagemCard;
            cardPreview.style.display = 'block';
        }
    };

    const showError = (message) => {
        loadingDiv.style.display = 'none';
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    };

    if (modo === 'inserir') {
        title.textContent = 'Novo Projeto';
        form.style.display = 'block';
    } else if (modo === 'modificar' || modo === 'visualizar') {
        if (!id) {
            showError("ID do projeto não fornecido.");
            return;
        }
        loadingDiv.style.display = 'block';

        try {
            const response = await fetch(`/projeto/${id}`);
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados: ${response.statusText}`);
            }
            const data = await response.json();

            loadingDiv.style.display = 'none';
            form.style.display = 'block';
            fillForm(data);

            if (modo === 'visualizar') {
                title.textContent = 'Visualizar Projeto';
                setFormState(true); 
            } else {
                title.textContent = 'Editar Projeto';
                setFormState(false); 
            }
        } catch (err) {
            showError(`Não foi possível carregar o projeto. ${err.message}`);
        }
    } else {
        showError("Modo de operação inválido.");
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (modo === 'visualizar') return;

        const formData = new FormData(form);
        
        if (!formData.has('Ativo')) {
            formData.set('Ativo', false);
        } else {
            formData.set('Ativo', true);
        }

        const informacoesText = formData.get('Informacoes');
        if (informacoesText && informacoesText.trim()) {
            try {
                const informacoesJson = JSON.parse(informacoesText);
                formData.set('Informacoes', JSON.stringify(informacoesJson));
            } catch (e) {
                alert('Erro no formato JSON das informações adicionais. Verifique a sintaxe.');
                return;
            }
        } else {
            formData.set('Informacoes', '{}');
        }

        const ordem = formData.get('OrdemdeExibicao');
        if (!ordem || ordem === '') {
            formData.set('OrdemdeExibicao', '0');
        }

        const method = modo === 'inserir' ? 'POST' : 'PUT';
        const url = modo === 'inserir' ? '/projeto' : `/projeto/${id}`;

        try {
            const carrosselFile = formData.get('ImagemCarrosselFile');
            const cardFile = formData.get('ImagemCardFile');

            let response;
            
            if (carrosselFile.size > 0 || cardFile.size > 0) {
                response = await fetch(url, {
                    method: method,
                    body: formData
                });
            } else {
                const jsonData = {};
                for (let [key, value] of formData.entries()) {
                    if (key !== 'ImagemCarrosselFile' && key !== 'ImagemCardFile') {
                        if (key === 'Ativo') {
                            jsonData[key] = value === 'true';
                        } else if (key === 'OrdemdeExibicao') {
                            jsonData[key] = parseInt(value) || 0;
                        } else if (key === 'Informacoes') {
                            jsonData[key] = JSON.parse(value);
                        } else {
                            jsonData[key] = value;
                        }
                    }
                }
                
                response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(jsonData)
                });
            }

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.erro || 'Erro ao salvar os dados.');
            }

            alert('Projeto salvo com sucesso!');
            window.location.href = '/admin/projetos';

        } catch (err) {
            alert(`Erro: ${err.message}`);
        }
    });
});