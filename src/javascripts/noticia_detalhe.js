// ✅ SISTEMA DE CARREGAMENTO DE NOTÍCIAS - RESPONSIVO
class NoticiaDetalhe {
    constructor() {
        this.noticiaContainer = document.getElementById('noticia-container');
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.carregarNoticia();
        });
    }

    //  Formata data
    formatarData(data) {
        if (!data) return 'Data não informada';
        
        try {
            const dataObj = new Date(data);
            const dataAjustada = new Date(dataObj.getTime() + dataObj.getTimezoneOffset() * 60000);
            
            if (isNaN(dataAjustada.getTime())) {
                return 'Data inválida';
            }
            
            return dataAjustada.toLocaleDateString('pt-BR');
        } catch (e) {
            console.error('Erro ao formatar data:', e);
            return 'Data inválida';
        }
    }

    //  Formata conteúdo com parágrafos
    formatarConteudo(conteudo) {
        if (!conteudo) return '';
        return conteudo.split('\n')
            .filter(para => para.trim())
            .map(para => `<p>${this.sanitizarHTML(para)}</p>`)
            .join('');
    }

    //   HTML para segurança
    sanitizarHTML(texto) {
        if (!texto) return '';
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }

    // FUNÇÃO PRINCIPAL: Carrega a notícia
    async carregarNoticia() {
        const urlParams = new URLSearchParams(window.location.search);
        const noticiaId = urlParams.get('id');
        
        if (!noticiaId) {
            this.mostrarErro('Notícia não encontrada.');
            return;
        }

        try {
            const response = await fetch(`/api/noticias/${noticiaId}`);
            
            if (!response.ok) {
                throw new Error('Notícia não encontrada');
            }
            
            const noticia = await response.json();
            
            if (!noticia || !noticia.NoticiasTitulo) {
                throw new Error('Dados da notícia inválidos');
            }
            
            this.renderizarNoticia(noticia);
            
        } catch (error) {
            console.error('Erro ao carregar notícia:', error);
            this.mostrarErro(`Erro ao carregar a notícia: ${error.message}`);
        }
    }

    // Renderiza a notícia na página
    renderizarNoticia(noticia) {
        const dataFormatada = this.formatarData(noticia.NoticiasData);
        console.log(noticia)
        const conteudoHTML = `
            <section class="corpo-total-noticia">
                <div class="titulo-noticia-geral">
                    <div class="data-noticia">${dataFormatada}</div>
                    <div class="titulo-principal-noticia">
                        <h1>${this.sanitizarHTML(noticia.NoticiasTitulo)}</h1>
                    </div>
                    <div class="subtitulo-titulo-noticia">
                        ${this.sanitizarHTML(noticia.NoticiasSubtitulo || '')}
                    </div>
                </div>

                ${noticia.NoticiasImagem ? `
                <div class="imagem-da-noticia1">
                    <img src="${noticia.NoticiasImagem}" 
                         title="${this.sanitizarHTML(noticia.NoticiasTitulo)}" 
                         alt="${this.sanitizarHTML(noticia.NoticiasTitulo)}"
                         onerror="this.src='/public/img/placeholder.jpg'"
                         loading="lazy">
                </div>
                ` : ''}

                <div class="conteudo-noticia">
                    ${noticia.NoticiasConteudo ? this.formatarConteudo(noticia.NoticiasConteudo) : '<p>Conteúdo não disponível.</p>'}
                    
                    ${noticia.NoticiasCardcitacao ? `
                    <div class="card-citacao">
                        <div class="citacao-noticia">
                            ${this.sanitizarHTML(noticia.NoticiasCardcitacao)}
                        </div>
                    </div>
                    ` : ''}
                    
                    ${noticia.NoticiasConteudoPosCitacao ? this.formatarConteudo(noticia.NoticiasConteudoPosCitacao) : ''}
                    
                    ${noticia.NoticiasTituloCorpo ? `
                    <div class="titulo1-corpo-noticia">
                        <h2>${this.sanitizarHTML(noticia.NoticiasTituloCorpo)}</h2>
                    </div>
                    ` : ''}
                    
                    ${noticia.NoticiasConteudoTituloCorpo ? this.formatarConteudo(noticia.NoticiasConteudoTituloCorpo) : ''}
                </div>
            </section>
        `;
        
        this.noticiaContainer.innerHTML = conteudoHTML;
        document.title = `${noticia.NoticiasTitulo} - AgriRS`;
        
        // Scroll suave para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Mostra mensagem de erro
    mostrarErro(mensagem) {
        this.noticiaContainer.innerHTML = `
            <div class="error">
                <p>${this.sanitizarHTML(mensagem)}</p>
                <p><small>Tente recarregar a página ou voltar mais tarde.</small></p>
            </div>
        `;
    }
}

// INICIALIZAÇÃO
new NoticiaDetalhe();