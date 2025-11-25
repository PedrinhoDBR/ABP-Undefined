// const projetosData = {
//     "conab": {
//         id: "conab",
//         titulo: "Mapeamento de áreas agrícolas junto a CONAB",
//         imagemCarrossel: "../public/img/projetos/Carrosel.png",
//         imagemCard: "../public/img/projetos/Carrosel.png",
//         descricao: `
//             <p>O AgriRS integra um projeto firmado entre a Companhia Nacional de Abastecimento (Conab) e o Instituto Nacional de Pesquisas Espaciais (INPE) com o objetivo de mapear, por meio de imagens de satélite, as áreas cultivadas com milho primeira safra, arroz irrigado e trigo no estado do Rio Grande do Sul, além de milho (primeira e segunda safra) e trigo nos estados do Paraná e de São Paulo.</p>

//             <p>A metodologia adotada inclui a construção de um painel utilizando amostragem aleatória estratificada em dois estágios que serviu para estimar a área cultivada e para validar o mapeamento. Após a seleção das amostras são realizados trabalhos de campo para visitar os pontos sorteados in loco (pontos para validação) e para coletar dados de treinamento.</p>

//             <p>Com os dados coletados, a classificação da áreas agrícolas é feita com o uso de modelos de machine learning. A iniciativa busca fortalecer o monitoramento agrícola nacional, melhorar as estimativas de safra, apoiar ações de segurança alimentar e contribuir para a mitigação dos impactos das mudanças climáticas e para o desenvolvimento sustentável da agricultura.</p>
//         `,
//         resumo: "O AgriRS integra um projeto firmado entre a Companhia Nacional de Abastecimento (Conab) e o Instituto Nacional de Pesquisas Espaciais (INPE)",
//         informacoes: {
//             "Parcerias": "CONAB e INPE",
//             "Culturas Mapeadas": "Milho (1ª e 2ª safra), Arroz Irrigado e Trigo",
//             "Estados Abrangidos": "Rio Grande do Sul, Paraná e São Paulo",
//             "Tecnologia Utilizada": "Imagens de Satélite e Machine Learning"
//         }
//     },
//     "cobertura-solo": {
//         id: "cobertura-solo",
//         titulo: "Estimativa do Percentual de Cobertura do Solo por Resíduos Culturais através de Sensoriamento Remoto Orbital",
//         imagemCarrossel: "../public/img/Figura_P1_PS.png",
//         imagemCard: "../public/img/Figura_P1_PS.png",
//         descricao: `
//             <h3>Integrantes:</h3>
//             <ul>
//                 <li>Marina Galdez de Castro Silva - Mestranda INPE</li>
//                 <li>Marcos Adami - Orientador INPE</li>
//                 <li>Julio Franchini - Embrapa Soja</li>
//             </ul>

//             <h3>Projeto:</h3>
//             <p>Os resíduos culturais mantidos na superfície das áreas agrícolas auxiliam na conservação do solo e da água. Por sua estimativa em campo ser onerosa, uma opção é utilizar dados e técnicas de sensoriamento remoto para detectá-los. Nesse contexto, esta pesquisa tem como objetivo estimar o percentual de cobertura do solo por resíduos culturais a partir de imagens multiespectrais de sensoriamento remoto orbital, utilizando dados do sensor MSI/Sentinel-2, regressões linear e quadrática, e o algoritmo Random Forest (RF).</p>

//             <p>Espera-se encontrar no sensoriamento remoto orbital um método eficaz para estimar a cobertura do solo por resíduos culturais em larga escala, tornando a variável de fácil aplicabilidade em programas nacionais que incentivem o manejo sustentável do solo.</p>
//         `,
//         resumo: "Estimativa do Percentual de Cobertura do Solo por Resíduos Culturais através de Sensoriamento Remoto Orbital",
//         informacoes: {
//             "Tecnologia": "Sensor MSI/Sentinel-2",
//             "Algoritmos": "Regressões linear/quadrática e Random Forest",
//             "Aplicação": "Monitoramento da cobertura do solo",
//             "Benefícios": "Manejo sustentável do solo"
//         }
//     },
//     "desmatamento-cerrado": {
//         id: "desmatamento-cerrado",
//         titulo: "Detecção de Desmatamento e Cicatriz de Fogo no Cerrado via Redes Neurais Artificiais",
//         imagemCarrossel: "../public/img/projetos/Projeto 5.jpg",
//         imagemCard: "../public/img/projetos/Projeto 5.jpg",
//         descricao: `
//             <h3>Integrantes:</h3>
//             <ul>
//                 <li>Ana Júlia Dias</li>
//                 <li>Marcos Adami</li>
//                 <li>Lênio Soares Galvão</li>
//                 <li>Valdivino Santiago</li>
//             </ul>

//             <h3>Projeto:</h3>
//             <p>O Cerrado passou a ser degradado intensivamente com o avanço da ocupação humana. Para auxiliar na conservação da biodiversidade do Cerrado, programas brasileiros, como o Projeto de Monitoramento do Desmatamento (PRODES) e o Sistema de Detecção e Desmatamento em Tempo Real (DETER), têm sido propostos para quantificar desmatamentos.</p>

//             <p>Buscando a compreensão da resposta espectro-temporal da vegetação e a semi-automatização da detecção de distúrbios (desmatamento e fogo) nas formações campestre, florestal e savânica do Cerrado, a presente pesquisa busca avaliar a detecção de desmatamento e de áreas queimadas neste bioma utilizando redes Convolutional Long Short-Term Memory (ConvLSTM), treinadas e testadas com imagens do sensor MultiSpectral Instrument (MSI)/Sentinel-2, e comparadas com a classificação gerada pelo Random Forest.</p>
//         `,
//         resumo: "Detecção de Desmatamento e Cicatriz de Fogo no Cerrado via Redes Neurais Artificiais.",
//         informacoes: {
//             "Técnica": "Redes ConvLSTM e Random Forest",
//             "Bioma": "Cerrado",
//             "Sensor": "MSI/Sentinel-2",
//             "Aplicações": "PRODES e DETER"
//         }
//     },
//     "mapeamento-cultivos": {
//         id: "mapeamento-cultivos",
//         titulo: "Mapeamento e Monitoramento de Cultivos Agrícolas no Brasil",
//         imagemCarrossel: "../public/img/projetos/Projeto 3.jpg",
//         imagemCard: "../public/img/projetos/Projeto 3.jpg",
//         descricao: `
//             <h3>Integrantes:</h3>
//             <ul>
//                 <li>Priscilla Azevedo dos Santos - Doutoranda INPE</li>
//                 <li>Marcos Adami - Orientador INPE</li>
//             </ul>

//             <h3>Contato:</h3>
//             <p>priscilla.santos@inpe.br</p>

//             <h3>Projeto:</h3>
//             <p>O objetivo da pesquisa é tornar mais assertivos os produtos cartográficos oriundos de mapeamentos de cultivos agrícolas por Sensoriamento Remoto existentes no Brasil, contribuindo para a diminuição das dissimilaridades entre as áreas e classes agrícolas no espaço-tempo, auxiliando a tomada de decisão no monitoramento agrícola e suas aplicações (estimativa de área, produtividade, sustentabilidade, mudanças de uso, outros).</p>

//             <p>Em seu desenvolvimento, a pesquisa conta com abordagens espaço-temporais que envolvem a integração de dados/produtos multifonte (EO1), análise de mudanças e dissimilaridades nas áreas/classes agrícolas (EO2) e a modelagem probabilística de incertezas (EO3) no mapeamento de áreas agrícolas no Brasil por Sensoriamento Remoto, tendo como foco os cultivos agrícolas anuais.</p>
//         `,
//         resumo: "Mapeamento e Monitoramento de Cultivos Agrícolas no Brasil com foco em cultivos anuais.",
//         informacoes: {
//             "Objetivo": "Mapeamento assertivo de cultivos agrícolas",
//             "Foco": "Cultivos agrícolas anuais",
//             "Abordagem": "Análise espaço-temporal multifonte",
//             "Contato": "priscilla.santos@inpe.br"
//         }
//     },
//     "alteracoes-uso-terra": {
//         id: "alteracoes-uso-terra",
//         titulo: "Detecção de alterações no uso da terra utilizando sensoriamento remoto",
//         imagemCarrossel: "../public/img/projetos/Projeto 4.jpg",
//         imagemCard: "../public/img/projetos/Projeto 4.jpg",
//         descricao: `
//             <p>O AgriRS aplica técnicas de sensoriamento remoto para detectar alterações no uso da terra, como desmatamentos e mudanças na cobertura vegetal.</p>

//             <p>Esta capacidade é fundamental para o planejamento territorial e políticas de conservação ambiental.</p>
//         `,
//         resumo: "O AgriRS aplica técnicas de sensoriamento remoto para detectar alterações no uso da terra, como desmatamentos",
//         informacoes: {
//             "Aplicações": "Detecção de desmatamentos, mudanças na cobertura vegetal",
//             "Importância": "Planejamento territorial e conservação ambiental"
//         }
//     },
//     "impactos-agricultura": {
//         id: "impactos-agricultura",
//         titulo: "Monitoramento via Sensoriamento Remoto: Impactos da Agricultura na Floresta",
//         imagemCarrossel: "../public/img/Figura_P2_MG.JPG",
//         imagemCard: "../public/img/Figura_P2_MG.JPG",
//         descricao: `
//             <p>Monitoramento dos impactos da atividade agrícola nas áreas florestais através de técnicas avançadas de sensoriamento remoto.</p>

//             <p>O projeto visa equilibrar produção agrícola e conservação ambiental.</p>
//         `,
//         resumo: "Monitoramento via Sensoriamento Remoto: Impactos da Agricultura na Floresta.",
//         informacoes: {
//             "Foco": "Impactos ambientais da agricultura",
//             "Objetivo": "Equilíbrio entre produção e conservação"
//         }
//     },
//     "acompanhamento-frutas": {
//         id: "acompanhamento-frutas",
//         titulo: "Tecnologia e Agricultura: Acompanhamento de Frutas por Imagens",
//         imagemCarrossel: "../public/img/projetos/Projeto 6.jpg",
//         imagemCard: "../public/img/projetos/Projeto 6.jpg",
//         descricao: `
//             <p>Utilização de tecnologias de imageamento para acompanhamento do desenvolvimento e qualidade de frutas.</p>

//             <p>Esta abordagem permite otimizar a produção e melhorar a qualidade dos produtos frutícolas.</p>
//         `,
//         resumo: "Tecnologia e Agricultura: Acompanhamento de Frutas por Imagens.",
//         informacoes: {
//             "Aplicação": "Fruticultura",
//             "Tecnologia": "Imageamento e análise visual",
//             "Benefícios": "Otimização da produção e qualidade"
//         }
//     }
// };

// const projetosOrdenados = [
//     "cobertura-solo", 
//     "desmatamento-cerrado", 
//     "mapeamento-cultivos", 
//     "alteracoes-uso-terra",
//     "impactos-agricultura", 
//     "acompanhamento-frutas" 
// ];
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

class ProjetosManager {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.currentProject = this.getProjectFromURL();
        // Base dinâmica: usa mesma origem do site para evitar CORS
        this.apiBaseURL = window.location.origin || '';
        this.projetosCarregados = false;
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        // Página de detalhe pode ser servida em /projeto (sem nome de arquivo) ou com arquivo direto
        if (path === '/projeto' || path.startsWith('/projeto/')) {
            return 'project-detail';
        }
        // Fallback: se existir container de detalhe no DOM, assume detalhe
        if (document.getElementById('projeto-titulo')) {
            return 'project-detail';
        }
        return 'projects-list';
    }

    getProjectFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('project');
        return id ? id : '1';
    }

    init() {
        if (this.projetosCarregados) return;

        if (this.currentPage === 'project-detail') {
            this.renderProjectDetail();
        } else {
            this.renderProjectsList();
        }
        
        this.projetosCarregados = true;
    }



    async renderProjectsList() {
   
        const containers = document.querySelectorAll('.cardsProjetos');

        if (!containers.length) return;

        try {
            // Detecta idioma da página (html lang="pt-BR" ou "en-US" etc.)
            const idioma = await getIdiomaFromSession();
            // Normaliza para valores usados no backend

            const response = await fetch(`/api/projetos?idioma=${encodeURIComponent(idioma)}`, { headers: { 'Accept': 'application/json' } });
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

            const contentType = response.headers.get('content-type') || '';
            if (!contentType.includes('application/json')) {
                console.error('Resposta não é JSON. Content-Type=', contentType);
                return; // evita tentar fazer parse de HTML
            }

            const data = await response.json();
            
            const todosProjetos = data.results || [];
            console.log(data.length)
            containers[0].classList.remove('vazia');
            containers[1].classList.remove('vazia');
            containers[0].innerHTML = '';
            containers[1].innerHTML = '';

            if (todosProjetos.length === 0) return;

            const projetosUnicos = this.removerDuplicatas(todosProjetos);

            const projetosAtivos = projetosUnicos
                .filter(projeto => projeto.Ativo !== false)
                .sort((a, b) => (a.OrdemdeExibicao || 0) - (b.OrdemdeExibicao || 0));


            const projetosLinha1 = projetosAtivos.slice(0, 3);
            const projetosLinha2 = projetosAtivos.slice(3, 6);

            projetosLinha1.forEach(projeto => {
                const card = this.createProjectCard(projeto);
                containers[0].appendChild(card);
            });

            projetosLinha2.forEach(projeto => {
                const card = this.createProjectCard(projeto);
                containers[1].appendChild(card);
            });

        } catch (error) {
            console.error('Erro ao carregar projetos:', error);
        }
    }

    removerDuplicatas(projetos) {
        const idsVistos = new Set();
        return projetos.filter(projeto => {
            if (idsVistos.has(projeto.ProjetosId)) {

                return false;
            }
            idsVistos.add(projeto.ProjetosId);
            return true;
        });
    }

    createProjectCard(projeto) {
        const card = document.createElement('div');
        card.className = 'PROJETOScard';

        let imagemCard = '';
        
        if (projeto.ImagemCard) {
            let imagemPath = projeto.ImagemCard.trim();
            // se vier a URL completa (Cloudinary etc) usa direto
            if (/^https?:\/\//i.test(imagemPath)) {
                imagemCard = imagemPath;
            } else {
                if (imagemPath.startsWith('/public')) {
                    imagemPath = imagemPath.replace('/public', '');
                }
                if (!imagemPath.startsWith('/')) imagemPath = '/' + imagemPath;
                imagemCard = `${imagemPath}`; // caminho relativo ao site
            }
        } else {
            imagemCard = `/public/img/projetos/Carrosel.png`;
        }

        card.innerHTML = `
            <a href="/projeto?project=${projeto.ProjetosId}" title="${projeto.ProjetosTitulo}" class="card-link">
                <div class="card-img-container">
                    <img src="${imagemCard}" alt="${projeto.ProjetosTitulo}" class="card-img" onerror="this.style.display='none'">
                </div>
                <div class="cardText">
                    <h4>${projeto.ProjetosTituloCard || projeto.ProjetosTitulo}</h4>
                    <p>${projeto.CardResumo || 'Descrição não disponível'}</p>
                </div>
            </a>
        `;

        return card;
    }

    async renderProjectDetail() {
        const projetoId = this.currentProject;
        if (!projetoId) {
            console.warn('Nenhum ID de projeto fornecido na URL. Adicione ?project=ID.');
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseURL}/projeto/${projetoId}`);
            if (!response.ok) {
                console.error('Erro na resposta da API:', response.status);
                return;
            }

            const project = await response.json();

            this.updateProjectDetail(project);

        } catch (error) {
            console.error('Erro ao carregar detalhes:', error);
        }
    }

    updateProjectDetail(project) {
        const tituloElement = document.getElementById('projeto-titulo');
        if (tituloElement && project.ProjetosTitulo) {
            tituloElement.textContent = project.ProjetosTitulo;
        }

        const descricaoElement = document.getElementById('projeto-descricao');
        if (descricaoElement && project.ProjetoDescricao) {
            descricaoElement.innerHTML = project.ProjetoDescricao;
        }

        const carrosselImg = document.getElementById('carrossel-imagem');
        if (carrosselImg && project.ImagemCarrossel) {
            let imagemPath = project.ImagemCarrossel;

            carrosselImg.src = `${imagemPath}`;
            carrosselImg.alt = project.ProjetosTitulo;
        }

        const infoElement = document.getElementById('projeto-info');
        if (infoElement && project.Informacoes) {
            const infoItems = Object.entries(project.Informacoes)
                .map(([key, value]) => `
                    <div class="info-item">
                        <h3>${key}</h3>
                        <p>${value}</p>
                    </div>
                `).join('');
            infoElement.innerHTML = infoItems;
        }

        if (project.ProjetosTitulo) {
            document.title = `AgriRS - ${project.ProjetosTitulo}`;
        }
    }
}

let managerInstancia = null;
document.addEventListener('DOMContentLoaded', function () {
    if (!managerInstancia) {
        managerInstancia = new ProjetosManager();
    }
});