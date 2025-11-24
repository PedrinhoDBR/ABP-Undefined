let slideAtual = 0;

let slideAtualEquipe = 0;

const slides = document.querySelectorAll(".carrosel")

const slide0 = document.querySelector("#slide0")

const slide1 = document.querySelector('#slide1')

const leftArrow = document.querySelector("#leftArrowNews")

const rightArrow = document.querySelector("#rightArrowNews")


leftArrow.addEventListener('click', () => {

    if(slideAtual == 2){
                    slideAtual--
 slides.forEach((slide => {
            slide.style.transition = 'transform 200ms'
            slide.style.transform = "translate(-100%)"
            
         }))

    }
    else if(slideAtual == 1){
                            slideAtual--
 slides.forEach((slide => {
            slide.style.transition = 'transform 200ms'
            slide.style.transform = "translate(0%)"
            
         }))
        

    }
    else{
        slideAtual = 2
 slides.forEach((slide => {
            slide.style.transition = 'transform 200ms'
            slide.style.transform = "translate(-200%)"
            
         }))
    }

    
})




rightArrow.addEventListener('click', () => {
 
        // lista.next()
         if(slideAtual == 0){
            slideAtual++
 slides.forEach((slide => {
            slide.style.transition = 'transform 200ms'
            slide.style.transform = "translate(-100%)"
            
         }))

         }  
         else if(slideAtual == 1){
             slideAtual++
 slides.forEach((slide => { 
            slide.style.transition = 'transform 200ms'
            slide.style.transform = "translate(-200%)"
            
         }))

         }

         else{
            slideAtual = 0
 slides.forEach((slide => { 
            slide.style.transition = 'transform 200ms'
            slide.style.transform = "translate(0%)"
            
         }))
         }

         
         

          
        
        
})



// Carrosel equipe 

const slidesCarrosel = document.querySelectorAll(".equipeCarrosel")

const leftArrowTeam = document.querySelector("#leftArrow")

const rightArrowTeam = document.querySelector("#rightArrow")


document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Recupera o idioma da sessão
        const idiomaResponse = await fetch('/get-idioma');
        const { idioma } = await idiomaResponse.json();

        // Busca os dados da rota /inicial
        const res = await fetch(`/inicial`);
        const { publicacoes, membros, noticias, projetos } = await res.json();

        // Renderiza os dados na página
        renderNoticias(noticias, idioma);
        renderProjetos(projetos, idioma);
        renderPublicacoes(publicacoes, idioma);
        renderEquipe(membros, idioma);

        // Ativa setas e auto-scroll do carrossel de equipe (scroll horizontal)
        const equipeContainer = document.querySelector('.equipeCarrosel');
        if (equipeContainer) {
            const getStep = () => Math.max(200, Math.floor(equipeContainer.clientWidth * 0.5));
            const scrollLeft = () => equipeContainer.scrollBy({ left: -getStep(), behavior: 'smooth' });
            const scrollRight = () => equipeContainer.scrollBy({ left: getStep(), behavior: 'smooth' });

            leftArrowTeam && leftArrowTeam.addEventListener('click', scrollLeft);
            rightArrowTeam && rightArrowTeam.addEventListener('click', scrollRight);

            // Auto-scroll lento
            let autoTimer;
            const startAuto = () => {
                stopAuto();
                autoTimer = setInterval(() => {
                    const maxScroll = equipeContainer.scrollWidth - equipeContainer.clientWidth - 2;
                    if (equipeContainer.scrollLeft >= maxScroll) {
                        equipeContainer.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        equipeContainer.scrollBy({ left: Math.max(120, Math.floor(equipeContainer.clientWidth * 0.25)), behavior: 'smooth' });
                    }
                }, 3000); // a cada 3s
            };
            const stopAuto = () => { if (autoTimer) clearInterval(autoTimer); };

            // Pausa ao interagir, retoma depois
            ['mouseenter','touchstart','focusin'].forEach(evt => {
                equipeContainer.addEventListener(evt, stopAuto, { passive: true });
            });
            ['mouseleave','touchend','focusout'].forEach(evt => {
                equipeContainer.addEventListener(evt, startAuto, { passive: true });
            });
            // Também pausa quando clicar nas setas e retoma depois de um curto tempo
            const resumeSoon = () => { stopAuto(); setTimeout(startAuto, 4000); };
            leftArrowTeam && leftArrowTeam.addEventListener('click', resumeSoon);
            rightArrowTeam && rightArrowTeam.addEventListener('click', resumeSoon);

            startAuto();
        }

        // Botões de mais...
        const btnNoticias = document.getElementById('btnMaisNoticias');
        const btnProjetos = document.getElementById('btnMaisProjetos');
        const btnPublicacoes = document.getElementById('btnMaisPublicacoes');
        if (btnNoticias) btnNoticias.addEventListener('click', () => window.location.href = '/noticias');
        if (btnProjetos) btnProjetos.addEventListener('click', () => window.location.href = '/projetos');
        if (btnPublicacoes) btnPublicacoes.addEventListener('click', () => window.location.href = '/publicacoes');

        // Foco automático em colaboradores se query ?colaboradores presente
        const params = new URLSearchParams(window.location.search);
        if (params.has('colaboradores')) {
            const colabSection = document.getElementById('colaboradores-section');
            if (colabSection) {
                colabSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                colabSection.classList.add('focus-colaboradores');
                setTimeout(() => colabSection.classList.remove('focus-colaboradores'), 4000);
            }
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
});
function renderNoticias(noticias, idioma) {
    const container = document.querySelector('.carroselBox');
    container.innerHTML = noticias.map((noticia, index) => `
        <div class="carrosel" id="slide${index}">
            <img src="${noticia.NoticiasImagem}" alt="${noticia.NoticiasTitulo}">

            <div class="carroselText">
                <h3>${noticia.NoticiasTitulo}</h3>
                <p>${noticia.NoticiasSubtitulo}</p>
            </div>
        </div>
    `).join('');
}

function renderProjetos(projetos, idioma) {
    const boxes = document.querySelectorAll('.cardsBox');
    const container = boxes[0]; // primeiro cardsBox = projetos
    if (!container) return;
    container.innerHTML = projetos.map(projeto => `
        <div class="card cardWide" data-id="${projeto.ProjetosId}">
            <div class="cardImg">
                <img src="${projeto.ImagemCard || projeto.ImagemCarrossel || ''}" alt="${projeto.ProjetosTitulo}">
            </div>
            <div class="cardText">
                <h4>${projeto.ProjetosTitulo}</h4>
                <p>${projeto.CardResumo || ''}</p>
            </div>
        </div>
    `).join('');
    container.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            if (id) window.location.href = `/projeto?id=${id}`;
        });
    });
}

function renderPublicacoes(publicacoes, idioma) {
    const boxes = document.querySelectorAll('.cardsBox');
    const container = boxes[1]; // segundo cardsBox = publicações
    if (!container) return;
    container.innerHTML = (publicacoes || []).map(pub => {
        const hasLink = !!pub.PublicacaoLinkExterno;
        return `
        <div class="card cardWide ${hasLink ? 'clickable' : 'no-link'}" data-link="${pub.PublicacaoLinkExterno || ''}">
            <div class="cardImg">
                <img src="${pub.PublicacaoImagem || ''}" alt="${pub.PublicacaoTitulo || ''}">
            </div>
            <div class="cardText">
                <h4>${pub.PublicacaoTitulo || ''}</h4>
                <p>${pub.PublicacaoCitacao || ''}</p>
                ${hasLink ? '<span class="externoHint">Abrir publicação</span>' : '<span class="externoHint disabled">Sem link externo</span>'}
            </div>
        </div>`;
    }).join('');
    container.querySelectorAll('.card.clickable').forEach(card => {
        card.addEventListener('click', () => {
            const link = card.getAttribute('data-link');
            if (link) {
                // garante protocolo
                const finalLink = link.startsWith('http') ? link : `https://${link}`;
                window.open(finalLink, '_blank');
            }
        });
    });
}

let equipeAutoTimer;
function renderEquipe(membros, idioma) {
    const container = document.querySelector('.equipeCarrosel');
    if (!container) return;
    const leftBtn = document.getElementById('leftArrow');
    const rightBtn = document.getElementById('rightArrow');

    // estado do carrossel
    let itemsPerView = 1;
    let index = 0; // índice atual (contando clones)
    const baseLength = (membros || []).length;
    let track;
    let cardStep = 140; // largura do card + gap (default), recalculada após render
    const GAP = 12; // deve bater com o CSS

    const getItemsPerView = () => {
        const w = container.clientWidth;
        if (w < 420) return 3;
        if (w < 640) return 4;
        if (w < 900) return 6;
        return 8;
    };

    const build = () => {
        // recria a estrutura com clones conforme itemsPerView
        container.innerHTML = '<div class="equipeTrack"></div>';
        track = container.querySelector('.equipeTrack');
        itemsPerView = getItemsPerView();

        if (baseLength === 0) return;

        // Se poucos itens, sem infinito
        if (baseLength <= itemsPerView) {
            track.innerHTML = membros.map(m => cardHtml(m)).join('');
            recalcMetrics();
            index = 0;
            applyTransform(true);
            // Esconde setas
            if (leftBtn) leftBtn.style.visibility = 'hidden';
            if (rightBtn) rightBtn.style.visibility = 'hidden';
            return;
        }

        const clonesHead = membros.slice(-itemsPerView).map(m => cardHtml(m)).join('');
        const base = membros.map(m => cardHtml(m)).join('');
        const clonesTail = membros.slice(0, itemsPerView).map(m => cardHtml(m)).join('');
        track.innerHTML = clonesHead + base + clonesTail;

        recalcMetrics();
        // posição inicial após os clones iniciais
        index = itemsPerView;
        applyTransform(true);

        // evento de wrap infinito
        track.addEventListener('transitionend', onTransitionEnd);

        // setas visíveis
        if (leftBtn) leftBtn.style.visibility = 'visible';
        if (rightBtn) rightBtn.style.visibility = 'visible';
    };

    const cardHtml = (m) => `
        <div class="cardEquipeMiniatura" data-id="${m.MembrosID}">
            <img src="${m.MembrosImagem || ''}" alt="${m.MembrosNome}">
            <div class="cardTextEquipe"><p>${m.MembrosNome}</p></div>
        </div>`;

    const recalcMetrics = () => {
        // garante que os cards não encolham antes da medição
        Array.from(track.children).forEach(c => { c.style.flex = '0 0 auto'; });
        const firstCard = track && track.children && track.children[0];
        if (firstCard) {
            const rect = firstCard.getBoundingClientRect();
            cardStep = Math.round(rect.width) + GAP; // distância entre cards (px)
        }
        // recalcula quantos cabem por viewport
        const avail = container.clientWidth - (72 * 2); // padding lateral de segurança
        itemsPerView = Math.max(1, Math.floor((avail + GAP) / cardStep));
    };

    const step = () => itemsPerView; // avança por tela (quantidade de cards)

    const applyTransform = (immediate = false) => {
        if (!track) return;
        if (immediate) track.style.transition = 'none';
        const translatePx = index * cardStep;
        track.style.transform = `translateX(-${translatePx}px)`;
        if (immediate) {
            // força reflow e restaura transição
            // eslint-disable-next-line no-unused-expressions
            track.offsetHeight;
            track.style.transition = 'transform 400ms ease';
        }
    };

    const onTransitionEnd = () => {
        const C = itemsPerView;
        const L = baseLength;
        // quando passamos dos limites, reposiciona sem animação
        if (index >= C + L) { index = C; applyTransform(true); }
        else if (index < C) { index = C + L - step(); applyTransform(true); }
    };

    const goNext = () => { index += step(); applyTransform(false); };
    const goPrev = () => { index -= step(); applyTransform(false); };

    // liga setas
    leftBtn && leftBtn.addEventListener('click', () => { stopAuto(); goPrev(); resumeSoon(); });
    rightBtn && rightBtn.addEventListener('click', () => { stopAuto(); goNext(); resumeSoon(); });

    // Auto-scroll lento
    const startAuto = () => {
        stopAuto();
        if (baseLength <= itemsPerView) return;
        equipeAutoTimer = setInterval(() => { goNext(); }, 4000);
    };
    const stopAuto = () => { if (equipeAutoTimer) clearInterval(equipeAutoTimer); };
    const resumeSoon = () => setTimeout(startAuto, 5000);

    container.addEventListener('mouseenter', stopAuto);
    container.addEventListener('mouseleave', startAuto);

    window.addEventListener('resize', () => { build(); });

    // inicializa
    build();
    startAuto();
}