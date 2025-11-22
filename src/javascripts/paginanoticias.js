// ✅ SISTEMA COM PAGINAÇÃO E INTERNACIONALIZAÇÃO
let noticiasCarregadas = [];
let noticiasFiltradas = [];
let idiomaAtual = 'PT-BR';
let paginaAtual = 1;
const CARDS_POR_PAGINA = 9;

const textos = {
    'PT-BR': {
        tituloPagina: 'AgriNews',
        idioma: 'Idioma:',
        pesquisaTitulo: 'Pesquisa por Título:',
        placeholderTitulo: 'Insira o Título da Notícia',
        filtrarMes: 'Filtrar por mês:',
        todosMeses: 'Todos os meses',
        filtrarAno: 'Filtrar por Ano:',
        todosAnos: 'Todos os Anos',
        aplicarFiltros: 'Aplicar Filtros',
        limparFiltros: 'Limpar Filtros',
        nenhumaNoticia: 'Nenhuma notícia encontrada.',
        leiaMais: 'Leia mais',
        anterior: 'Anterior',
        proxima: 'Próxima',
        mostrando: 'Mostrando',
        de: 'de',
        noticias: 'notícias',
        meses: [
            '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ]
    },
    'EN-US': {
        tituloPagina: 'AgriNews',
        idioma: 'Language:',
        pesquisaTitulo: 'Search by Title:',
        placeholderTitulo: 'Enter News Title',
        filtrarMes: 'Filter by month:',
        todosMeses: 'All months',
        filtrarAno: 'Filter by Year:',
        todosAnos: 'All Years',
        aplicarFiltros: 'Apply Filters',
        limparFiltros: 'Clear Filters',
        nenhumaNoticia: 'No news found.',
        leiaMais: 'Read more',
        anterior: 'Previous',
        proxima: 'Next',
        mostrando: 'Showing',
        de: 'of',
        noticias: 'news',
        meses: [
            '', 'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ]
    }
};

function atualizarTextosPagina(idioma) {
    const textosIdioma = textos[idioma];
    
    // Atualiza título da página
    const tituloPagina = document.querySelector('.titulo-da-pagina h1');
    if (tituloPagina) tituloPagina.textContent = textosIdioma.tituloPagina;
    
    // Atualiza filtro de idioma
    const labelIdioma = document.querySelector('.filtro-idioma label');
    if (labelIdioma) labelIdioma.textContent = textosIdioma.idioma;
    
    // Atualiza pesquisa por título
    const labelTitulo = document.querySelector('.filtro-titulo label');
    if (labelTitulo) labelTitulo.textContent = textosIdioma.pesquisaTitulo;
    
    const inputTitulo = document.getElementById('filtro-titulo');
    if (inputTitulo) inputTitulo.placeholder = textosIdioma.placeholderTitulo;
    
    // Atualiza filtro de mês
    const labelMes = document.querySelector('.filtro-data .filtro-grupo:nth-child(1) label');
    if (labelMes) labelMes.textContent = textosIdioma.filtrarMes;
    
    const selectMes = document.getElementById('filtro-mes');
    if (selectMes && selectMes.options.length > 0) {
        selectMes.options[0].textContent = textosIdioma.todosMeses;
        // Atualiza nomes dos meses
        for (let i = 1; i <= 12; i++) {
            if (selectMes.options[i]) {
                selectMes.options[i].textContent = textosIdioma.meses[i];
            }
        }
    }
    
    // Atualiza filtro de ano
    const labelAno = document.querySelector('.filtro-data .filtro-grupo:nth-child(2) label');
    if (labelAno) labelAno.textContent = textosIdioma.filtrarAno;
    
    const selectAno = document.getElementById('filtro-ano');
    if (selectAno && selectAno.options.length > 0) {
        selectAno.options[0].textContent = textosIdioma.todosAnos;
    }
    
    // Atualiza botões
    const botaoFiltrar = document.getElementById('botao-filtrar');
    if (botaoFiltrar) botaoFiltrar.textContent = textosIdioma.aplicarFiltros;
    
    const botaoLimpar = document.getElementById('botao-limpar');
    if (botaoLimpar) botaoLimpar.textContent = textosIdioma.limparFiltros;
    
    // Atualiza botões de paginação
    const btnAnterior = document.getElementById('pagina-anterior');
    if (btnAnterior) {
        btnAnterior.innerHTML = `<i class="fas fa-chevron-left"></i> ${textosIdioma.anterior}`;
    }
    
    const btnProxima = document.getElementById('proxima-pagina');
    if (btnProxima) {
        btnProxima.innerHTML = `${textosIdioma.proxima} <i class="fas fa-chevron-right"></i>`;
    }
    
    // Atualiza textos dos cards dinâmicos (se houver)
    atualizarTextosCards(idioma);
}

function atualizarTextosCards(idioma) {
    const textosIdioma = textos[idioma];
    const cardsLeiaMais = document.querySelectorAll('.card-leiamais');
    
    cardsLeiaMais.forEach(card => {
        card.textContent = textosIdioma.leiaMais;
    });
}


function atualizarInfoPagina(idioma, inicio, fim, total) {
    const textosIdioma = textos[idioma];
    const infoPagina = document.querySelector('.info-pagina');
    
    if (infoPagina) {
        infoPagina.innerHTML = `
            ${textosIdioma.mostrando} <span id="cards-exibidos">${inicio}-${fim}</span> 
            ${textosIdioma.de} <span id="total-cards">${total}</span> 
            ${textosIdioma.noticias}
        `;
    }
}

function formatarData(data, idioma) {
    if (!data) return idioma === 'PT-BR' ? 'Data não informada' : 'Date not provided';
    
    try {
        const dataObj = new Date(data);
        const dataAjustada = new Date(dataObj.getTime() + dataObj.getTimezoneOffset() * 60000);
        
        if (isNaN(dataAjustada.getTime())) {
            return idioma === 'PT-BR' ? 'Data inválida' : 'Invalid date';
        }
        
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        return dataAjustada.toLocaleDateString(idioma === 'PT-BR' ? 'pt-BR' : 'en-US', options);
    } catch (e) {
        console.error('Erro ao formatar data:', e);
        return idioma === 'PT-BR' ? 'Data inválida' : 'Invalid date';
    }
}

async function carregarNoticias(idioma = 'PT-BR') {
    try {
        console.log(`🔍 Carregando notícias em ${idioma}...`);
        
        const response = await fetch(`/api/noticias?idioma=${idioma}`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        noticiasCarregadas = data.results || [];
        noticiasFiltradas = [...noticiasCarregadas];
        
        console.log(`✅ ${noticiasCarregadas.length} notícias em ${idioma} carregadas do banco`);
        
        // Atualiza todos os textos da página
        atualizarTextosPagina(idioma);
        
        paginaAtual = 1; // Reset para primeira página
        limparECarregarCards();
        
    } catch (error) {
        console.error('❌ Erro ao carregar notícias do banco:', error);
        mostrarMensagemNenhumaNoticia();
    }
}

function limparECarregarCards() {
    const container = document.querySelector('.cards-noticias-global');
    
    if (!container) return;
    
    // Remove mensagem anterior se existir
    const mensagemAnterior = container.querySelector('.sem-noticias');
    if (mensagemAnterior) {
        mensagemAnterior.remove();
    }
    
    // Remove cards dinâmicos anteriores
    const cardsDinamicos = container.querySelectorAll('.card-dinamico');
    cardsDinamicos.forEach(card => card.remove());
    
    adicionarCardsDoBanco(noticiasFiltradas);
}

function adicionarCardsDoBanco(noticias) {
    const container = document.querySelector('.cards-noticias-global');
    
    if (!container) return;
    
    // Remove mensagem anterior se existir
    const mensagemAnterior = container.querySelector('.sem-noticias');
    if (mensagemAnterior) {
        mensagemAnterior.remove();
    }
    
    if (!noticias || noticias.length === 0) {
        console.log('ℹ️ Nenhuma notícia encontrada');
        mostrarMensagemNenhumaNoticia();
        return;
    }

    // Limpa container antes de adicionar novos cards
    const cardsDinamicos = container.querySelectorAll('.card-dinamico');
    cardsDinamicos.forEach(card => card.remove());

    noticias.forEach((noticia, index) => {
        try {
            const dataFormatada = formatarData(noticia.NoticiasData, idiomaAtual);
            const imagemUrl = noticia.NoticiasImagem ? 
                noticia.NoticiasImagem.startsWith('/') ? noticia.NoticiasImagem : '/' + noticia.NoticiasImagem
                : '/public/img/placeholder.jpg';
            
            const titulo = noticia.NoticiasTitulo || (idiomaAtual === 'PT-BR' ? 'Nova Notícia' : 'New News');
            const subtitulo = noticia.NoticiasSubtitulo || '';
            const subtituloTruncado = subtitulo.substring(0, 120) + 
                (subtitulo.length > 120 ? '...' : '');

            const textosIdioma = textos[idiomaAtual];
            const textoLeiaMais = textosIdioma.leiaMais;

            const card = document.createElement('div');
            card.className = 'cards-noticia-geral card-dinamico';
            card.setAttribute('data-indice', index);
            card.innerHTML = `
                <div class="cards-imagens">
                    <img src="${imagemUrl}" 
                         alt="${titulo}"
                         onerror="this.src='/public/img/placeholder.jpg'">
                </div>
                <div class="card-conjunto-texto">
                    <div class="card-noticia-data">${dataFormatada}</div>
                    <h4 class="card-titulo">${titulo}</h4>
                    <p class="card-conteudo">${subtituloTruncado || (idiomaAtual === 'PT-BR' ? 'Clique para ler mais...' : 'Click to read more...')}</p>
                    <a href="/noticia?id=${noticia.NoticiasID}" class="card-leiamais">${textoLeiaMais}</a>
                </div>
            `;
            
            container.appendChild(card);
            
        } catch (cardError) {
            console.error('❌ Erro ao criar card:', cardError);
        }
    });

    // Atualiza paginação e exibe primeira página
    atualizarPaginacao(noticias.length);
    mostrarPagina(paginaAtual);
}


function mostrarMensagemNenhumaNoticia() {
    const container = document.querySelector('.cards-noticias-global');
    
    if (!container) return;
    
    // Remove mensagem anterior se existir
    const mensagemAnterior = container.querySelector('.sem-noticias');
    if (mensagemAnterior) {
        mensagemAnterior.remove();
    }
    
    const mensagem = document.createElement('div');
    mensagem.className = 'sem-noticias mostrar';
    mensagem.textContent = textos[idiomaAtual].nenhumaNoticia;
    
    container.appendChild(mensagem);
    atualizarPaginacao(0);
}


function atualizarPaginacao(totalCards) {
    const totalPaginas = Math.ceil(totalCards / CARDS_POR_PAGINA);
    const containerNumeros = document.getElementById('numeros-pagina');
    const btnAnterior = document.getElementById('pagina-anterior');
    const btnProximo = document.getElementById('proxima-pagina');

    if (!containerNumeros) return;

    // Atualiza informações da paginação
    const inicio = Math.min((paginaAtual - 1) * CARDS_POR_PAGINA + 1, totalCards);
    const fim = Math.min(paginaAtual * CARDS_POR_PAGINA, totalCards);
    atualizarInfoPagina(idiomaAtual, inicio, fim, totalCards);

    // Atualiza botões de navegação
    if (btnAnterior) btnAnterior.disabled = paginaAtual === 1;
    if (btnProximo) btnProximo.disabled = paginaAtual === totalPaginas || totalPaginas === 0;

    // Gera números das páginas
    if (containerNumeros) {
        containerNumeros.innerHTML = '';
        
        if (totalPaginas <= 1) {
            containerNumeros.style.display = 'none';
            return;
        }
        
        containerNumeros.style.display = 'flex';

        // Lógica para mostrar páginas (máximo 5 números)
        let inicioPagina = Math.max(1, paginaAtual - 2);
        let fimPagina = Math.min(totalPaginas, inicioPagina + 4);
        
        // Ajusta se não há páginas suficientes no início
        if (fimPagina - inicioPagina < 4) {
            inicioPagina = Math.max(1, fimPagina - 4);
        }

        // Botão primeira página se necessário
        if (inicioPagina > 1) {
            const btnPrimeira = document.createElement('button');
            btnPrimeira.className = 'numero-pagina';
            btnPrimeira.textContent = '1';
            btnPrimeira.onclick = () => mudarPagina(1);
            containerNumeros.appendChild(btnPrimeira);
            
            if (inicioPagina > 2) {
                const reticencias = document.createElement('span');
                reticencias.className = 'reticencias';
                reticencias.textContent = '...';
                reticencias.style.padding = '10px 5px';
                containerNumeros.appendChild(reticencias);
            }
        }

        // Números das páginas
        for (let i = inicioPagina; i <= fimPagina; i++) {
            const btnPagina = document.createElement('button');
            btnPagina.className = `numero-pagina ${i === paginaAtual ? 'ativa' : ''}`;
            btnPagina.textContent = i;
            btnPagina.onclick = () => mudarPagina(i);
            containerNumeros.appendChild(btnPagina);
        }

        // Botão última página se necessário
        if (fimPagina < totalPaginas) {
            if (fimPagina < totalPaginas - 1) {
                const reticencias = document.createElement('span');
                reticencias.className = 'reticencias';
                reticencias.textContent = '...';
                reticencias.style.padding = '10px 5px';
                containerNumeros.appendChild(reticencias);
            }
            
            const btnUltima = document.createElement('button');
            btnUltima.className = 'numero-pagina';
            btnUltima.textContent = totalPaginas;
            btnUltima.onclick = () => mudarPagina(totalPaginas);
            containerNumeros.appendChild(btnUltima);
        }
    }
}

function mostrarPagina(pagina) {
    const cards = document.querySelectorAll('.card-dinamico');
    const inicio = (pagina - 1) * CARDS_POR_PAGINA;
    const fim = inicio + CARDS_POR_PAGINA;

    // Oculta todos os cards
    cards.forEach(card => {
        card.classList.remove('pagina-ativa');
    });

    // Mostra apenas os cards da página atual
    for (let i = inicio; i < fim && i < cards.length; i++) {
        if (cards[i]) {
            cards[i].classList.add('pagina-ativa');
        }
    }
}

function mudarPagina(novaPagina) {
    paginaAtual = novaPagina;
    mostrarPagina(paginaAtual);
    atualizarPaginacao(noticiasFiltradas.length);
    
    // Scroll suave para o topo dos cards
    const cardsContainer = document.querySelector('.cards-noticias-global');
    if (cardsContainer) {
        cardsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function aplicarFiltrosAvancados() {
    const filtroTitulo = document.getElementById('filtro-titulo').value.toLowerCase();
    const filtroMes = document.getElementById('filtro-mes').value;
    const filtroAno = document.getElementById('filtro-ano').value;
    
    noticiasFiltradas = noticiasCarregadas.filter(noticia => {
        if (filtroTitulo && !noticia.NoticiasTitulo.toLowerCase().includes(filtroTitulo)) {
            return false;
        }
        
        if (filtroMes || filtroAno) {
            const dataNoticia = new Date(noticia.NoticiasData);
            const mesNoticia = dataNoticia.getMonth() + 1;
            const anoNoticia = dataNoticia.getFullYear();
            
            if (filtroMes && parseInt(filtroMes) !== mesNoticia) {
                return false;
            }
            if (filtroAno && parseInt(filtroAno) !== anoNoticia) {
                return false;
            }
        }
        
        return true;
    });
    
    paginaAtual = 1; // Volta para primeira página ao filtrar
    
    const container = document.querySelector('.cards-noticias-global');
    
    // Remove mensagem anterior se existir
    const mensagemAnterior = container.querySelector('.sem-noticias');
    if (mensagemAnterior) {
        mensagemAnterior.remove();
    }
    
    // Remove cards dinâmicos anteriores
    const cardsDinamicos = container.querySelectorAll('.card-dinamico');
    cardsDinamicos.forEach(card => card.remove());
    
    if (noticiasFiltradas.length === 0) {
        mostrarMensagemNenhumaNoticia();
    } else {
        adicionarCardsDoBanco(noticiasFiltradas);
    }
    
    console.log(`🔍 ${noticiasFiltradas.length} notícias após filtros`);
}

function limparFiltros() {
    document.getElementById('filtro-titulo').value = '';
    document.getElementById('filtro-mes').value = '';
    document.getElementById('filtro-ano').value = '';
    
    noticiasFiltradas = [...noticiasCarregadas];
    paginaAtual = 1; // Volta para primeira página
    limparECarregarCards();
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Página de notícias carregada');
    
    const filtroIdioma = document.getElementById('filtro-idioma');
    const botaoFiltrar = document.getElementById('botao-filtrar');
    const botaoLimpar = document.getElementById('botao-limpar');
    const btnAnterior = document.getElementById('pagina-anterior');
    const btnProximo = document.getElementById('proxima-pagina');
    
    // CARREGA NOTÍCIAS INICIAIS
    carregarNoticias(idiomaAtual);
    
    if (filtroIdioma) {
        filtroIdioma.addEventListener('change', function() {
            idiomaAtual = this.value;
            console.log(`🌐 Idioma alterado para: ${idiomaAtual}`);
            carregarNoticias(idiomaAtual);
        });
    }
    
    if (botaoFiltrar) {
        botaoFiltrar.addEventListener('click', aplicarFiltrosAvancados);
    }
    
       if (botaoLimpar) {
        botaoLimpar.addEventListener('click', limparFiltros);
    }
    
       if (btnAnterior) {
        btnAnterior.addEventListener('click', () => {
            if (paginaAtual > 1) {
                mudarPagina(paginaAtual - 1);
            }
        });
    }
    
       if (btnProximo) {
        btnProximo.addEventListener('click', () => {
            const totalPaginas = Math.ceil(noticiasFiltradas.length / CARDS_POR_PAGINA);
            if (paginaAtual < totalPaginas) {
                mudarPagina(paginaAtual + 1);
            }
        });
    }
});