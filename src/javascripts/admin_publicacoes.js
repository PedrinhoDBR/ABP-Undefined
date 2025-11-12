document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.querySelector('#admin-publicacoes-table tbody');
  const rowTemplate = document.getElementById('row-template'); // Assuming this template is in carteira_publicacoes.html
  const btnInserir = document.getElementById('btn-inserir');
  const searchInput = document.getElementById('search-input');
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');
  const pageInfo = document.getElementById('page-info');

  let allPublicacoes = [];
  let filtered = [];
  let currentPage = 1;
  const pageSize = 10;

  async function loadPublicacoes() {
    tbody.innerHTML = `<tr><td colspan="6" class="loading">Carregando publicações...</td></tr>`;
    try {
      const res = await fetch('/publicacao?limit=1000'); // Use relative path
      const data = await res.json();
      allPublicacoes = data.results || [];
      filtered = allPublicacoes;
      currentPage = 1;
      renderGrid();
    } catch (err) {
      console.error(err);
      tbody.innerHTML = `<tr><td colspan="6" class="loading">Erro ao carregar publicações.</td></tr>`;
    }
  }

  function renderGrid() {
    tbody.innerHTML = '';
    const totalPages = Math.ceil(filtered.length / pageSize);
    if (currentPage > totalPages) currentPage = totalPages || 1;

    const start = (currentPage - 1) * pageSize;
    const current = filtered.slice(start, start + pageSize);

    if (!current.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="loading">Nenhuma publicação encontrada.</td></tr>`;
      updatePagination();
      return;
    }

    const fragment = document.createDocumentFragment();
    current.forEach(pub => {
      const row = rowTemplate.content.cloneNode(true);
      row.querySelector('.titulo').textContent = pub.PublicacaoTitulo || '';
      row.querySelector('.ano').textContent = pub.PublicacaoAno || '';
      row.querySelector('.idioma').textContent = pub.PublicacaoIdioma || '';
      row.querySelector('.visivel').innerHTML = `
        <span class="status-tag ${pub.PublicacaoVisibilidade ? 'status-true' : 'status-false'}">
          ${pub.PublicacaoVisibilidade ? 'Visível' : 'Oculto'}
        </span>
      `;
      row.querySelector('.imagem').innerHTML = pub.PublicacaoImagem
        ? `<img src="${pub.PublicacaoImagem}" loading="lazy" alt="Imagem da publicação">`
        : '';

      const showBtn = row.querySelector('.show');
      const modifyBtn = row.querySelector('.modify');
      const deleteBtn = row.querySelector('.delete');
      const menuBtn = row.querySelector('.admin-menu-btn');

      showBtn.addEventListener('click', () => {
        window.location.href = `/admin/publicacao?modo=visualizar&Id=${pub.PublicacaoID}`;
      });

      modifyBtn.addEventListener('click', () => {
        window.location.href = `/admin/publicacao?modo=modificar&Id=${pub.PublicacaoID}`;
      });

      deleteBtn.addEventListener('click', async () => {
        if (confirm(`Deseja realmente inativar a publicação "${pub.PublicacaoTitulo}"?`)) {
          await deletePublicacao(pub.PublicacaoID);
          await loadPublicacoes();
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
    filtered = allPublicacoes.filter(pub => {
        const titulo = (pub.PublicacaoTitulo || '').toLowerCase();
        const ano = (pub.PublicacaoAno || '').toString().toLowerCase();
        const idioma = (pub.PublicacaoIdioma || '').toLowerCase();
        const status = pub.PublicacaoVisibilidade
        ? 'visível visivel true ativo'
        : 'oculto false inativo';

        return (
        titulo.includes(term) ||
        ano.includes(term) ||
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

  async function deletePublicacao(id) {
    try {
      await fetch(`/publicacao/inativar/${id}`, { method: 'PUT' }); // Call inactivation endpoint
      alert('Publicação inativada com sucesso!');
    } catch (err) {
      alert('Erro ao inativar publicação.');
    }
  }

  document.addEventListener('click', () => {
    document.querySelectorAll('.admin-menu-dropdown.open').forEach(d => d.classList.remove('open'));
  });

  btnInserir.addEventListener('click', () => {
    window.location.href = '/admin/publicacao?modo=inserir';
  });

  loadPublicacoes();
});
