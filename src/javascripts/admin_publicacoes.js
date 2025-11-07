document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#admin-publicacoes-table tbody');
    const btnInserir = document.getElementById('btn-inserir');

    // Carregar publicações da API
    async function loadPublicacoes() {
        try {
            const res = await fetch('http://localhost:3030/publicacao?limit=1000');
            const data = await res.json();
            renderGrid(data.results || []);
        } catch (err) {
            tableBody.innerHTML = `<tr><td colspan="5">Erro ao carregar publicações.</td></tr>`;
        }
    }

    // Renderizar grid
    function renderGrid(publicacoes) {
        if (!publicacoes.length) {
            tableBody.innerHTML = `<tr><td colspan="5">Nenhuma publicação encontrada.</td></tr>`;
            return;
        }
        tableBody.innerHTML = '';
        publicacoes.forEach(pub => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>
                <div class="admin-menu-dropdown">
                    <button class="admin-menu-btn">
                        <i class="fa fa-bars"></i>
                    </button>
                    <div class="admin-menu-list">
                        <button class="admin-menu-item show" data-id="${pub.PublicacaoID}">
                            <i class="fas fa-magnifying-glass"></i><span class="text">Mostrar</span>
                        </button>
                        <button class="admin-menu-item modify" data-id="${pub.PublicacaoID}">
                            <i class="fas fa-pen"></i><span class="text">Modificar</span>
                        </button>
                        <button class="admin-menu-item delete" data-id="${pub.PublicacaoID}">
                            <i class="fas fa-times"></i><span class="text">Inativar</span>
                        </button>
                    </div>
                </div>
            </td>
            <td>${pub.PublicacaoTitulo || ''}</td>
            <td>${pub.PublicacaoAno || ''}</td>
            <td>
                ${pub.PublicacaoImagem ? `<img src="${pub.PublicacaoImagem}" class="admin-image-thumb" alt="Imagem">` : ''}
            </td>
            `;
            tableBody.appendChild(tr);
        });

        // Adiciona eventos aos menus hamburguer e itens do menu APÓS renderizar a grid
        tableBody.querySelectorAll('.admin-menu-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                document.querySelectorAll('.admin-menu-dropdown.open').forEach(drop => {
                    if (drop !== btn.parentElement) drop.classList.remove('open');
                });
                btn.parentElement.classList.toggle('open');
            });
        });

        // Fecha menu ao clicar fora
        document.addEventListener('click', () => {
            document.querySelectorAll('.admin-menu-dropdown.open').forEach(drop => drop.classList.remove('open'));
        });

        // Ações dos itens do menu
        tableBody.querySelectorAll('.admin-menu-item.show').forEach(btn => {
            btn.addEventListener('click', () => {
                alert('Mostrar publicação: ' + btn.getAttribute('data-id'));
            });
        });
        tableBody.querySelectorAll('.admin-menu-item.modify').forEach(btn => {
            btn.addEventListener('click', () => {
                alert('Modificar publicação: ' + btn.getAttribute('data-id'));
            });
        });
        tableBody.querySelectorAll('.admin-menu-item.delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                if (confirm('Deseja realmente inativar esta publicação?')) {
                    await deletePublicacao(id);
                    loadPublicacoes();
                }
            });
        });
    }

    // Função para deletar publicação
    async function deletePublicacao(id) {
        try {
            await fetch(`http://localhost:3030/publicacao/${id}`, { method: 'DELETE' });
        } catch (err) {
            alert('Erro ao deletar publicação.');
        }
    }

    // Evento do botão inserir
    btnInserir.addEventListener('click', () => {
        alert('Abrir formulário de inserção de publicação');
    });

    // Inicialização
    loadPublicacoes();
});