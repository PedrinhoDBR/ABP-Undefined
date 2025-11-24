document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.querySelector('#admin-projetos-table tbody');
  const rowTemplate = document.getElementById('row-template');
  const btnInserir = document.getElementById('btn-inserir');
  const searchInput = document.getElementById('search-input');
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');
  const pageInfo = document.getElementById('page-info');

  let allProjetos = [];
  let filtered = [];
  let currentPage = 1;
  const pageSize = 10;

  async function loadProjetos() {
    tbody.innerHTML = `<tr><td colspan="7" class="loading">Carregando projetos...</td></tr>`;
    try {
      const res = await fetch('/api/projetos');
      const contentType = res.headers.get('content-type') || '';
      
      if (!contentType.includes('application/json')) {
        throw new Error('Resposta não é JSON. Content-Type recebido: ' + contentType);
      }
      const data = await res.json();
      if (!data || typeof data !== 'object') throw new Error('Formato inesperado da resposta.');
      allProjetos = Array.isArray(data.results) ? data.results : [];
      filtered = allProjetos;
      currentPage = 1;
      renderGrid();
    } catch (err) {
      console.error('Falha ao carregar projetos:', err);
      tbody.innerHTML = `<tr><td colspan="7" class="loading">Erro ao carregar projetos. ${err.message}</td></tr>`;
    }
  }

  function renderGrid() {
    tbody.innerHTML = '';
    const totalPages = Math.ceil(filtered.length / pageSize);
    if (currentPage > totalPages) currentPage = totalPages || 1;

    const start = (currentPage - 1) * pageSize;
    const current = filtered.slice(start, start + pageSize);

    if (!current.length) {
      tbody.innerHTML = `<tr><td colspan="7" class="loading">Nenhum projeto encontrado.</td></tr>`;
      updatePagination();
      return;
    }

    const fragment = document.createDocumentFragment();
    current.forEach(projeto => {
      const row = rowTemplate.content.cloneNode(true);
      row.querySelector('.projetos-id').textContent = projeto.ProjetosId || '';
      row.querySelector('.projetos-titulo').textContent = projeto.ProjetosTitulo || '';
      row.querySelector('.projetos-titulo-card').textContent = projeto.ProjetosTituloCard || '';
      row.querySelector('.ativo').innerHTML = `
        <span class="status-tag ${projeto.Ativo ? 'status-true' : 'status-false'}">
          ${projeto.Ativo ? 'Ativo' : 'Inativo'}
        </span>
      `;
      row.querySelector('.ordem').textContent = projeto.OrdemdeExibicao || '0';
      
      const imagemCell = row.querySelector('.imagem-card');
      if (projeto.ImagemCard) {
        let imagemPath = projeto.ImagemCard;
        
        if (imagemPath.startsWith('/public/')) {
          imagemPath = imagemPath.substring(8); // Remove "/public/"
        }
        
        if (!imagemPath.startsWith('/')) {
          imagemPath = imagemPath;
        }
        
        const imagemURL = imagemPath;

        imagemCell.innerHTML = `
          <img src="${imagemURL}" 
               loading="lazy" 
               alt="Imagem do projeto" 
               style="max-width: 60px; max-height: 60px; border-radius: 4px; object-fit: cover;"
               onerror="this.style.display='none'; this.parentElement.innerHTML='<span style=\\'color:#888; font-size:12px;\\'>Sem imagem</span>'">
        `;
      } else {
        imagemCell.innerHTML = '<span style="color:#888;">-</span>';
      }

      const showBtn = row.querySelector('.show');
      const modifyBtn = row.querySelector('.modify');
      const deleteBtn = row.querySelector('.delete');
      const menuBtn = row.querySelector('.admin-menu-btn');

      showBtn.addEventListener('click', () => {
        window.open(`/projeto?project=${projeto.ProjetosId}`, '_blank');
      });

      modifyBtn.addEventListener('click', () => {
        window.location.href = `/admin/projeto?modo=modificar&Id=${projeto.ProjetosId}`;
      });

      deleteBtn.addEventListener('click', async () => {
        if (confirm(`Deseja realmente excluir o projeto "${projeto.ProjetosTitulo}"?`)) {
          await deleteProjeto(projeto.ProjetosId);
          await loadProjetos();
        }
      });

      menuBtn.addEventListener('click', e => {
        e.stopPropagation();
        document.querySelectorAll('.admin-menu-dropdown.open').forEach(d => d.classList.remove('open'));
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
    const term = searchInput.value.toLowerCase();
    filtered = allProjetos.filter(projeto => {
        const titulo = (projeto.ProjetosTitulo || '').toLowerCase();
        const tituloCard = (projeto.ProjetosTituloCard || '').toLowerCase();
        const ordem = (projeto.OrdemdeExibicao || '').toString().toLowerCase();
        const status = projeto.Ativo ? 'ativo true' : 'inativo false';

        return (
          titulo.includes(term) ||
          tituloCard.includes(term) ||
          ordem.includes(term) ||
          status.includes(term)
        );
    });
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

  async function deleteProjeto(id) {
    try {
      const response = await fetch(`/projeto/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error('Erro ao excluir projeto');
      }
      
      alert('Projeto excluído com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir projeto.');
    }
  }

  document.addEventListener('click', () => {
    document.querySelectorAll('.admin-menu-dropdown.open').forEach(d => d.classList.remove('open'));
  });

  btnInserir.addEventListener('click', () => {
    window.location.href = '/admin/projeto?modo=inserir';
  });

  loadProjetos();
});