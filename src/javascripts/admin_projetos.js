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

  // Verificar se já estamos em uma página administrativa para evitar duplicação
  const isAdminPage = window.location.pathname.includes('/admin');
  
  // Traduções específicas para a página administrativa
  function applyAdminTranslations() {
    if (!isAdminPage) return;
    
    // Verificar se já foi traduzido para evitar duplicação
    if (document.documentElement.lang === 'en') return;
    
    const h1 = document.querySelector('h1');
    if (h1 && h1.textContent.includes('Gerenciamento de Projetos')) {
      h1.textContent = 'Projects Management';
    }
    
    if (searchInput) {
      searchInput.placeholder = '🔍 Search by title...';
    }
    
    if (btnInserir) {
      btnInserir.textContent = '➕ New Project';
    }
    
    if (pageInfo) {
      pageInfo.textContent = pageInfo.textContent.replace('Página', 'Page').replace('de', 'of');
    }
    
    const prevBtnText = document.querySelector('#prev-page');
    const nextBtnText = document.querySelector('#next-page');
    if (prevBtnText) prevBtnText.textContent = '⬅️ Previous';
    if (nextBtnText) nextBtnText.textContent = 'Next ➡️';
    
    // Marcar como já traduzido
    document.documentElement.lang = 'en';
  }

  async function loadProjetos() {
    tbody.innerHTML = `<tr><td colspan="6" class="loading">${isAdminPage && document.documentElement.lang === 'en' ? 'Loading projects...' : 'Carregando projetos...'}</td></tr>`;
    try {
      console.log('Fazendo requisição para /projeto...');
      const res = await fetch('/api/projetos');
      
      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status} ${res.statusText}`);
      }

      // Tenta ler como texto primeiro para debug
      const responseText = await res.text();
      console.log('Resposta bruta:', responseText.substring(0, 500));

      // Tenta parsear como JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Erro ao parsear JSON:', parseError);
        throw new Error('Resposta do servidor não é JSON válido');
      }
      
      console.log('Dados recebidos:', data);
      
      allProjetos = data.results || data || [];
      filtered = allProjetos;
      currentPage = 1;
      renderGrid();
    } catch (err) {
      console.error('Erro ao carregar projetos:', err);
      const errorMsg = isAdminPage && document.documentElement.lang === 'en' 
        ? 'Error loading projects. Check if the server is responding correctly.'
        : 'Erro ao carregar projetos. Verifique se o servidor está respondendo corretamente.';
      
      tbody.innerHTML = `<tr><td colspan="6" class="loading" style="color: #dc3545;">
        ${errorMsg}
        <br><small>${err.message}</small>
      </td></tr>`;
    }
  }

  function renderGrid() {
    tbody.innerHTML = '';
    const totalPages = Math.ceil(filtered.length / pageSize);
    if (currentPage > totalPages) currentPage = totalPages || 1;

    const start = (currentPage - 1) * pageSize;
    const current = filtered.slice(start, start + pageSize);

    if (!current.length) {
      const noProjectsMsg = isAdminPage && document.documentElement.lang === 'en' 
        ? 'No projects registered.' 
        : 'Nenhum projeto cadastrado.';
      tbody.innerHTML = `<tr><td colspan="6" class="loading">${noProjectsMsg}</td></tr>`;
      updatePagination();
      return;
    }

    const fragment = document.createDocumentFragment();
    current.forEach(projeto => {
      const row = rowTemplate.content.cloneNode(true);
      
      row.querySelector('.projetos-titulo').textContent = projeto.ProjetosTitulo || '';
      row.querySelector('.projetos-titulo-card').textContent = projeto.ProjetosTituloCard || '';
      
      // Status em português/inglês
      const ativoStatus = isAdminPage && document.documentElement.lang === 'en' 
        ? (projeto.Ativo ? 'Active' : 'Inactive')
        : (projeto.Ativo ? 'Ativo' : 'Inativo');
      
      row.querySelector('.ativo').innerHTML = `
        <span class="status-tag ${projeto.Ativo ? 'status-true' : 'status-false'}">
          ${ativoStatus}
        </span>
      `;
      
      row.querySelector('.ordem').textContent = projeto.OrdemdeExibicao || '0';
      
      // TRATAMENTO DAS IMAGENS
      const imagemCell = row.querySelector('.imagem-card');
      if (projeto.ImagemCard) {
        let imagemPath = projeto.ImagemCard;
        
        
        const imagemURL = imagemPath;
        
        const noImageText = isAdminPage && document.documentElement.lang === 'en' 
          ? 'No image' 
          : 'Sem imagem';
        
        imagemCell.innerHTML = `
          <img src="${imagemURL}" 
               loading="lazy" 
               alt="Imagem do projeto" 
               style="max-width: 60px; max-height: 60px; border-radius: 4px; object-fit: cover;"
               onerror="this.style.display='none'; this.parentElement.innerHTML='<span style=\\'color:#888; font-size:12px;\\'>${noImageText}</span>'">
        `;
      } else {
        imagemCell.innerHTML = '<span style="color:#888;">-</span>';
      }

      const showBtn = row.querySelector('.show');
      const modifyBtn = row.querySelector('.modify');
      const deleteBtn = row.querySelector('.delete');
      const menuBtn = row.querySelector('.admin-menu-btn');

      // Traduzir textos dos botões do menu
      if (isAdminPage && document.documentElement.lang === 'en') {
        showBtn.textContent = '👁️ View';
        modifyBtn.textContent = '✏️ Edit';
        deleteBtn.textContent = '🗑️ Delete';
      }

      showBtn.addEventListener('click', () => {
        window.open(`/pages/projetoCONAB.html?project=${projeto.ProjetosId}`, '_blank');
      });

      modifyBtn.addEventListener('click', () => {
        window.location.href = `/admin/projeto?modo=modificar&Id=${projeto.ProjetosId}`;
      });

      deleteBtn.addEventListener('click', async () => {
        const confirmMsg = isAdminPage && document.documentElement.lang === 'en'
          ? `Do you really want to delete the project "${projeto.ProjetosTitulo}"?`
          : `Deseja realmente excluir o projeto "${projeto.ProjetosTitulo}"?`;
          
        if (confirm(confirmMsg)) {
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
    
    if (isAdminPage && document.documentElement.lang === 'en') {
      pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    } else {
      pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    }
    
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
  }

  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    filtered = allProjetos.filter(projeto => {
        const titulo = (projeto.ProjetosTitulo || '').toLowerCase();
        const tituloCard = (projeto.ProjetosTituloCard || '').toLowerCase();
        const ordem = (projeto.OrdemdeExibicao || '').toString().toLowerCase();
        const status = projeto.Ativo ? 'ativo active true' : 'inativo inactive false';

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
      
      const successMsg = isAdminPage && document.documentElement.lang === 'en'
        ? 'Project deleted successfully!'
        : 'Projeto excluído com sucesso!';
      
      alert(successMsg);
    } catch (err) {
      console.error(err);
      const errorMsg = isAdminPage && document.documentElement.lang === 'en'
        ? 'Error deleting project.'
        : 'Erro ao excluir projeto.';
      
      alert(errorMsg);
    }
  }

  document.addEventListener('click', () => {
    document.querySelectorAll('.admin-menu-dropdown.open').forEach(d => d.classList.remove('open'));
  });

  btnInserir.addEventListener('click', () => {
    window.location.href = '/admin/projeto?modo=inserir';
  });

  // Aplicar traduções e inicializar
  applyAdminTranslations();
  loadProjetos();
});