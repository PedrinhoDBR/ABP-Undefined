let currentPage = 1;
const itemsPerPage = 12;
let totalPages = 1;

// DOM Elements
const publicationsGrid = document.getElementById('publications-grid');
const filterAno = document.getElementById('filter-ano');
const filterSearch = document.getElementById('filter-search');
const modal = document.getElementById('publication-modal');
const closeButton = document.querySelector('.close-button');

// Event Listeners
filterAno.addEventListener('change', () => {
    currentPage = 1;
    fetchPublications();
});

filterSearch.addEventListener('input', debounce(() => {
    currentPage = 1;
    fetchPublications();
}, 300));

closeButton.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// BUSCAR O IDIOMA DA SESSÃO
async function getIdiomaFromSession() {
    try {
        const response = await fetch('/get-idioma');
        const data = await response.json();
        return data.idioma || 'PT-BR'; // Retorna o idioma ou 'PT-BR' como padrão
    } catch (error) {
        console.error('Erro ao buscar idioma da sessão:', error);
        return 'PT-BR';
    }
}

// BUSCAR AS PUBLICAÇÕES DO BANCO
async function fetchPublications() {
    try {
        const ano = filterAno.value;
        const titulo = filterSearch.value;
        const idioma = await getIdiomaFromSession(); // Busca o idioma da sessão

        const params = new URLSearchParams({
            idioma: idioma
        });

        if (ano) params.append('ano', ano);
        if (titulo) params.append('titulo', titulo);

        const url = `/api/publicacoes?${params.toString()}`;
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            renderPublications(data.results, idioma);
            updatePagination(data.page, Math.ceil(data.total / data.limit));
        } else {
            console.error('Erro ao buscar publicações:', data.erro);
        }
    } catch (error) {
        console.error('Erro ao buscar publicações:', error);
    }
}

// RENDERIZAR AS PUBLICAÇÕES
function renderPublications(publications, idioma) {
    publicationsGrid.innerHTML = publications.map(pub => `
        <div 
            class="publication-card"
            ${pub.PublicacaoLinkExterno ? `onclick="window.open('${pub.PublicacaoLinkExterno}', '_blank')"` : ''}
            style="${pub.PublicacaoLinkExterno ? 'cursor: pointer;' : ''}"
        >
            <div class="card-content">
                <h3 class="card-title">${pub.PublicacaoTitulo}</h3>
                
                ${pub.PublicacaoImagem ? `
                    <img src="${pub.PublicacaoImagem}" 
                        alt="${pub.PublicacaoTitulo}" 
                        class="card-image"
                        onerror="this.src='/public/img/publicacoes/Figura_A1_GR.jpg'">
                ` : ''}

                <div class="card-year">${pub.PublicacaoAno}</div>
            </div>

            ${pub.PublicacaoCitacao ? `
                <p class="card-excerpt">${pub.PublicacaoCitacao}</p>
            ` : ''}
        </div>
    `).join('');

    // Atualiza os textos do filtro e mensagens com base no idioma
    if (publications.length === 0) {
        publicationsGrid.innerHTML = `<div class="no-results">${
            idioma === 'EN-US' ? 'No publications found.' : 'Nenhuma publicação encontrada.'
        }</div>`;
    }
}

function updatePagination(page, total) {
    currentPage = page;
    totalPages = total;
}

// Carregamento inicial
document.addEventListener('DOMContentLoaded', fetchPublications);