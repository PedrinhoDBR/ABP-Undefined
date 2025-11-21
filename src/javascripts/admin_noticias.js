document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('#admin-noticias-table tbody');
    const rowTemplate = document.getElementById('row-template');
    const btnInserir = document.getElementById('btn-inserir');
    const searchInput = document.getElementById('search-input');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');

    let allNoticias = [];
    let filtered = [];
    let currentPage = 1;
    const pageSize = 10;

    async function loadNoticias() {
        tbody.innerHTML = `<tr><td colspan="5" class="loading">Carregando notícias...</td></tr>`;
        try {
            const res = await fetch('/api/noticias');
            
            if (!res.ok) throw new Error('Erro na resposta do servidor');
            
            const data = await res.json();
            allNoticias = data.results || [];
            filtered = [...allNoticias];
            currentPage = 1;
            renderGrid();
        } catch (err) {
            console.error('Erro ao carregar notícias:', err);
            tbody.innerHTML = `<tr><td colspan="5" class="loading">Erro ao carregar notícias: ${err.message}</td></tr>`;
        }
    }

    function renderGrid() {
        tbody.innerHTML = '';
        const totalPages = Math.ceil(filtered.length / pageSize) || 1;
        
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const current = filtered.slice(start, end);

        if (!current.length) {
            tbody.innerHTML = `<tr><td colspan="5" class="loading">Nenhuma notícia encontrada.</td></tr>`;
            updatePagination();
            return;
        }

        const fragment = document.createDocumentFragment();
        
        current.forEach(noticia => {
            const row = rowTemplate.content.cloneNode(true);
            
            let dataFormatada = 'Data não informada';
            if (noticia.NoticiasData) {
                try {
                    const dataObj = new Date(noticia.NoticiasData);
                    dataFormatada = dataObj.toLocaleDateString('pt-BR');
                } catch (e) {
                    console.error('Erro ao formatar data:', e);
                }
            }
            
            row.querySelector('.titulo').textContent = noticia.NoticiasTitulo || 'Sem título';
            row.querySelector('.data').textContent = dataFormatada;
            row.querySelector('.idioma').textContent = noticia.NoticiasIdioma || 'Não informado';
            
            const imagemCell = row.querySelector('.imagem');
            if (noticia.NoticiasImagem) {
                imagemCell.innerHTML = `<img src="${noticia.NoticiasImagem}" 
                    loading="lazy" 
                    alt="Imagem da notícia" 
                    style="max-width: 60px; max-height: 60px; object-fit: cover; border-radius: 4px;">`;
            } else {
                imagemCell.innerHTML = 'Sem imagem';
            }

            const showBtn = row.querySelector('.show');
            const modifyBtn = row.querySelector('.modify');
            const deleteBtn = row.querySelector('.delete');
            const menuBtn = row.querySelector('.admin-menu-btn');

            showBtn.addEventListener('click', () => {
                window.open(`/noticia?id=${noticia.NoticiasID}`, '_blank');
            });

            modifyBtn.addEventListener('click', () => {
                window.location.href = `/admin/noticia?modo=modificar&Id=${noticia.NoticiasID}`;
            });

            deleteBtn.addEventListener('click', async () => {
                if (confirm(`Deseja realmente excluir a notícia "${noticia.NoticiasTitulo}"?`)) {
                    try {
                        await deleteNoticia(noticia.NoticiasID);
                        await loadNoticias();
                    } catch (error) {
                        alert('Erro ao excluir notícia: ' + error.message);
                    }
                }
            });

            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                document.querySelectorAll('.admin-menu').forEach(menu => {
                    if (menu !== menuBtn.parentElement) {
                        menu.classList.remove('open');
                    }
                });
                menuBtn.parentElement.classList.toggle('open');
            });

            fragment.appendChild(row);
        });

        tbody.appendChild(fragment);
        updatePagination();
    }

    function updatePagination() {
        const totalPages = Math.ceil(filtered.length / pageSize) || 1;
        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
    }

    searchInput.addEventListener('input', () => {
        const term = searchInput.value.toLowerCase().trim();
        if (term === '') {
            filtered = [...allNoticias];
        } else {
            filtered = allNoticias.filter(noticia => {
                const titulo = (noticia.NoticiasTitulo || '').toLowerCase();
                const subtitulo = (noticia.NoticiasSubtitulo || '').toLowerCase();
                return titulo.includes(term) || subtitulo.includes(term);
            });
        }
        currentPage = 1;
        renderGrid();
    });

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderGrid();
        }
    });

    nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filtered.length / pageSize);
        if (currentPage < totalPages) {
            currentPage++;
            renderGrid();
        }
    });

    async function deleteNoticia(id) {
        try {
            const response = await fetch(`/api/noticias/${id}`, { 
                method: 'DELETE' 
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.erro || 'Erro ao excluir notícia');
            }
            
            return await response.json();
        } catch (err) {
            console.error('Erro ao excluir notícia:', err);
            throw err;
        }
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.admin-menu')) {
            document.querySelectorAll('.admin-menu').forEach(menu => {
                menu.classList.remove('open');
            });
        }
    });

    btnInserir.addEventListener('click', () => {
        window.location.href = '/admin/noticia?modo=inserir';
    });

    loadNoticias();
});