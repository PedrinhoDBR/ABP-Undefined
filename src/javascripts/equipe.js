document.addEventListener('DOMContentLoaded', () => {
    // Mapeamento dos containers por cargo (inclui variações possíveis)
    const containers = {
        'Coordenador': document.getElementById('coordenadores-grid'),
        'Pesquisadores - Coordenadores': document.getElementById('coordenadores-grid'),
        'Pesquisador Coordenador': document.getElementById('coordenadores-grid'),
        'Pesquisador Titular': document.getElementById('coordenadores-grid'),
        'Pesquisador Associado': document.getElementById('associados-grid'),
        'Estudante de Pós-graduação': document.getElementById('doutorandos-grid'),
        'Doutorando': document.getElementById('doutorandos-grid'),
        'Mestrando': document.getElementById('doutorandos-grid'),
        'Bolsista': document.getElementById('bolsistas-grid'),
        'Colaborador Externo': document.getElementById('bolsistas-grid'),
        'Colaborador': document.getElementById('bolsistas-grid')
    };

    const mainWrap = document.querySelector('.members-wrap');

    async function getIdiomaFromSession() {
        try {
            const resp = await fetch('/get-idioma');
            const data = await resp.json();
            return data.idioma || 'PT-BR';
        } catch (e) {
            console.warn('Falha ao obter idioma da sessão, usando PT-BR');
            return 'PT-BR';
        }
    }

    let currentIdioma = 'PT-BR';

    async function loadEquipe() {
        mainWrap.insertAdjacentHTML('beforeend', '<p id="loading-message">Carregando Equipe...</p>');
        try {
            const idioma = await getIdiomaFromSession();
            currentIdioma = idioma;
            // Busca membros visíveis filtrando por idioma
            const response = await fetch(`/api/membros?visivel=true&idioma=${encodeURIComponent(idioma)}`);
            if (!response.ok) throw new Error('Falha ao carregar dados da API.');
            const data = await response.json();
            const membros = data.results || [];
            document.getElementById('loading-message')?.remove();

            if (membros.length === 0) {
                mainWrap.insertAdjacentHTML('beforeend', '<p>Nenhum membro visível no momento.</p>');
                document.querySelectorAll('.members-grid').forEach(el => el.style.display = 'none');
                document.querySelectorAll('h2[id$="-title"]').forEach(el => el.style.display = 'none');
                return;
            }

            membros.forEach(membro => {
                const cargoBruto = membro.MembrosCargo || '';
                // Normaliza pequenos desvios (ex: espaços extras)
                const cargo = cargoBruto.trim();
                const container = containers[cargo];
                console.log(cargo, container);
                console.log(membro);
                if (container) {
                    const card = createMembroCard(membro);
                    container.appendChild(card);
                } else {
                    console.log(`Cargo desconhecido: '${cargo}'. Membro '${membro.MembrosNome}' não renderizado.`);
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
        const lattesLabel = currentIdioma === 'EN-US' ? 'Lattes:' : 'Lattes:';
        const lattesContent = membro.MembrosLattes 
            ? `<span>${lattesLabel}</span> <br> <a target="_blank" href="${membro.MembrosLattes}">${membro.MembrosLattes}</a>` 
            : '';

        const sobreLabel = currentIdioma === 'EN-US' ? 'About' : 'Sobre';
        const noDesc = currentIdioma === 'EN-US' ? 'No description available.' : 'Nenhuma descrição disponível.';

        // Tradução do cargo se idioma for EN-US
        const cargoOriginal = membro.MembrosCargo || '';
        const cargoMapEN = {
            'Coordenador': 'Coordinator',
            'Pesquisadores - Coordenadores': 'Coordinator',
            'Pesquisador Coordenador': 'Coordinator',
            'Pesquisador Titular': 'Lead Researcher',
            'Pesquisador Associado': 'Associate Researcher',
            'Estudante de Pós-graduação': 'Graduate Student',
            'Doutorando': 'PhD Student',
            'Mestrando': "Master's Student",
            'Bolsista': 'Fellow',
            'Colaborador Externo': 'External Collaborator',
            'Colaborador': 'Collaborator'
        };
        const displayCargo = currentIdioma === 'EN-US' ? (cargoMapEN[cargoOriginal] || cargoOriginal) : cargoOriginal;
        const altLabel = currentIdioma === 'EN-US' ? 'Photo of' : 'Foto de';

        article.innerHTML = `
            <img class="member-image" src="${imagemSrc}" alt="Foto de ${membro.MembrosNome}" />
            <div class="member-info">
                <h3 class="member-name">${membro.MembrosNome}</h3>
                <p class="member-role">${displayCargo}</p>
            </div>
            <div class="member-bio" aria-hidden="true">
                <h4 class="bio-title">${sobreLabel} ${membro.MembrosNome}</h4>
                <p class="bio-text">
                    ${membro.MembrosDescricao || noDesc}
                    <br>
                    ${lattesContent}
                </p>
            </div>
        `;
        return article;
    }

    loadEquipe();
});