document.addEventListener('DOMContentLoaded', () => {
    // 1. Mapeamento dos containers HTML
    const containers = {
        'Coordenador': document.getElementById('coordenadores-grid'),
        'Pesquisador Titular': document.getElementById('coordenadores-grid'), // Pode agrupar com Coordenador
        'Pesquisador Associado': document.getElementById('associados-grid'),
        'Estudante de Pós-graduação': document.getElementById('doutorandos-grid'), // Agrupamento mais geral
        'Doutorando': document.getElementById('doutorandos-grid'),
        'Bolsista': document.getElementById('bolsistas-grid'),
        'Colaborador Externo': document.getElementById('bolsistas-grid'), // Pode agrupar com Bolsistas
    };
    
    // Contêiner principal para mensagens de erro/loading
    const mainWrap = document.querySelector('.members-wrap');
    
    // Função para buscar e exibir os membros
    async function loadEquipe() {
        mainWrap.insertAdjacentHTML('beforeend', '<p id="loading-message">Carregando Equipe...</p>');
        
        try {
            // Busca apenas membros visíveis (assumindo que sua API faz a filtragem)
            const response = await fetch('/api/membros?visivel=true'); 
            if (!response.ok) throw new Error('Falha ao carregar dados da API.');

            const data = await response.json();
            const membros = data.results || [];
            
            document.getElementById('loading-message')?.remove();

            if (membros.length === 0) {
                mainWrap.insertAdjacentHTML('beforeend', '<p>Nenhum membro visível no momento.</p>');
                // Esconder títulos de seção se estiverem vazios
                document.querySelectorAll('.members-grid').forEach(el => el.style.display = 'none');
                document.querySelectorAll('h2[id$="-title"]').forEach(el => el.style.display = 'none');
                return;
            }

            // 2. Renderiza os cards nos containers corretos
            membros.forEach(membro => {
                const cargo = membro.MembrosCargo;
                const container = containers[cargo];
                
                if (container) {
                    const card = createMembroCard(membro);
                    container.appendChild(card);
                } else {
                    console.warn(`Cargo desconhecido: ${cargo}. Membro ${membro.MembrosNome} não renderizado.`);
                }
            });

        } catch (error) {
            console.error('Erro ao carregar a equipe:', error);
            document.getElementById('loading-message')?.remove();
            mainWrap.insertAdjacentHTML('beforeend', '<p>Erro ao carregar a equipe. Tente novamente mais tarde.</p>');
        }
    }

    // Função para criar o elemento HTML (card) de cada membro (MESMA ESTRUTURA DO SEU HTML ESTÁTICO)
    function createMembroCard(membro) {
        const article = document.createElement('article');
        article.classList.add('member-card');
        article.setAttribute('tabindex', '0');

        const imagemSrc = membro.MembrosImagem || '/public/img/placeholder.jpg'; // Ajuste o placeholder
        
        // Crie o link Lattes com a URL completa
        const lattesContent = membro.MembrosLattes 
            ? `<span>Lattes :</span> <br> <a target="_blank" href="${membro.MembrosLattes}">${membro.MembrosLattes}</a>` 
            : '';

        article.innerHTML = `
            <img class="member-image" src="${imagemSrc}" alt="Foto de ${membro.MembrosNome}" />
            <div class="member-info">
                <h3 class="member-name">${membro.MembrosNome}</h3>
                <p class="member-role">${membro.MembrosCargo}</p>
            </div>
            <div class="member-bio" aria-hidden="true">
                <h4 class="bio-title">Sobre ${membro.MembrosNome}</h4>
                <p class="bio-text">
                    ${membro.MembrosDescricao || 'Nenhuma descrição disponível.'}
                    <br>
                    ${lattesContent}
                </p>
            </div>
        `;
        return article;
    }

    loadEquipe();
});