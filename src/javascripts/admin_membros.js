document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('#admin-membros-table tbody');
    const rowTemplate = document.getElementById('row-template'); // Assuming this template is in carteira_membros.html
    const btnInserir = document.getElementById('btn-inserir');
    const searchInput = document.getElementById('search-input');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
  
    let allMembros = [];
    let filtered = [];
    let currentPage = 1;
    const pageSize = 10;
  
    async function loadMembros() {
      tbody.innerHTML = `<tr><td colspan="6" class="loading">Carregando membros...</td></tr>`;
      try {
        const res = await fetch('/api/membros?limit=1000'); // Use relative path
        const data = await res.json();
        allMembros = data.results || [];
        filtered = allMembros;
        currentPage = 1;
        renderGrid();
      } catch (err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="6" class="loading">Erro ao carregar membros.</td></tr>`;
      }
    }
  
    function renderGrid() {
      tbody.innerHTML = '';
      const totalPages = Math.ceil(filtered.length / pageSize);
      if (currentPage > totalPages) currentPage = totalPages || 1;
  
      const start = (currentPage - 1) * pageSize;
      const current = filtered.slice(start, start + pageSize);
  
      if (!current.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="loading">Nenhum membro encontrado.</td></tr>`;
        updatePagination();
        return;
      }
  
      const fragment = document.createDocumentFragment();
      current.forEach(pub => {
        const row = rowTemplate.content.cloneNode(true);
        row.querySelector('.nome').textContent = pub.MembrosNome || '';
        row.querySelector('.cargo').textContent = pub.MembrosCargo || '';
        row.querySelector('.idioma').textContent = pub.MembrosIdioma || '';
        row.querySelector('.visivel').innerHTML = `
    <span class="status-tag ${pub.MembrosVisibilidade ? 'status-true' : 'status-false'}">
        ${pub.MembrosVisibilidade ? 'Visível' : 'Oculto'} 
    </span>
`;
        row.querySelector('.imagem').innerHTML = pub.MembrosImagem
          ? `<img src="${pub.MembrosImagem}" loading="lazy" alt="Imagem do membro">`
          : '';
  
        const showBtn = row.querySelector('.show');
        const modifyBtn = row.querySelector('.modify');
        const deleteBtn = row.querySelector('.delete');
        const menuBtn = row.querySelector('.admin-menu-btn');
  
        showBtn.addEventListener('click', () => {
          window.location.href = `/admin/membro?modo=visualizar&Id=${pub.MembrosID}`;
        });
  
        modifyBtn.addEventListener('click', () => {
          window.location.href = `/admin/membro?modo=modificar&Id=${pub.MembrosID}`;
        });
  
        deleteBtn.addEventListener('click', async () => {
          if (confirm(`Deseja realmente excluir o membro "${pub.MembrosNome}"?`)) {
            await deleteMembros(pub.MembrosID);
            await loadMembros();
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
      filtered = allMembros.filter(pub => {
          const nome = (pub.MembrosNome || '').toLowerCase();
          const cargo = (pub.MembrosCargo || '').toString().toLowerCase();
          const idioma = (pub.MembrosIdioma || '').toLowerCase();
          const status = pub.MembrosVisibilidade
          ? 'visível visivel true ativo'
          : 'oculto false inativo';
  
          return (
          nome.includes(term) ||
          cargo.includes(term) ||
          idioma.includes(term) ||
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
  
    async function deleteMembros(id) {
    try {
        const response = await fetch(`/api/membros/${id}`, {
            method: 'DELETE' 
        });
        
        if (response.status === 204) {
            alert('Membro excluído permanentemente com sucesso!');
            return; 
        }
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.erro || response.statusText);
        }
        alert('Membro excluído permanentemente com sucesso!');

    } catch (err) {
        console.error('Erro ao excluir membro:', err);
        alert(`Erro ao excluir membro: ${err.message}`); 
        throw err;
    }
}
  
    document.addEventListener('click', () => {
      document.querySelectorAll('.admin-menu-dropdown.open').forEach(d => d.classList.remove('open'));
    });
  
    btnInserir.addEventListener('click', () => {
      window.location.href = '/admin/membro?modo=inserir';
    });
  
    loadMembros();
  });
  