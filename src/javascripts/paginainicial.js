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



// Carrossel equipe (configurado dentro de renderEquipe)


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

        // carrossel da equipe é configurado em renderEquipe

        // Botões de mais...
        const btnNoticias = document.getElementById('btnMaisNoticias');
        const btnProjetos = document.getElementById('btnMaisProjetos');
        const btnPublicacoes = document.getElementById('btnMaisPublicacoes');
        if (btnNoticias) btnNoticias.addEventListener('click', () => window.location.href = '/noticias');
        if (btnProjetos) btnProjetos.addEventListener('click', () => window.location.href = '/projetos');
        if (btnPublicacoes) btnPublicacoes.addEventListener('click', () => window.location.href = '/publicacoes');

        // Tradução dos textos dos botões conforme idioma
        if (idioma === 'EN-US') {
            if (btnNoticias) btnNoticias.textContent = '+ News';
            if (btnProjetos) btnProjetos.textContent = '+ Projects';
            if (btnPublicacoes) btnPublicacoes.textContent = '+ Publications';
        } else { // PT-BR padrão
            if (btnNoticias) btnNoticias.textContent = '+ Notícias';
            if (btnProjetos) btnProjetos.textContent = '+ Projetos';
            if (btnPublicacoes) btnPublicacoes.textContent = '+ Publicações';
        }

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
// Envio do formulário de contato da página inicial sem alterar layout
document.addEventListener('DOMContentLoaded', () => {
    const formSection = document.querySelector('section.formSection .form');
    const sendBtn = formSection ? formSection.querySelector('.buttonForm button[type="submit"]') : null;
    if (sendBtn) {
        sendBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const nomeInput = formSection.querySelector('input[name="nome"]');
                const emailInput = formSection.querySelector('input[name="email"]');
                const assuntoTextarea = formSection.querySelector('textarea[name="textarea"]');

                const nome = nomeInput ? nomeInput.value.trim() : '';
                const mail = emailInput ? emailInput.value.trim() : '';
                const assunto = assuntoTextarea ? assuntoTextarea.value.trim() : '';

                if (!nome || !mail || !assunto) {
                    alert('Preencha nome, email e assunto.');
                    return;
                }

                const body = new URLSearchParams({ nome, mail, assunto });
                const resp = await fetch('/contato/enviar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: body.toString()
                });

                if (resp.ok) {
                    alert('Mensagem enviada com sucesso!');
                    if (nomeInput) nomeInput.value = '';
                    if (emailInput) emailInput.value = '';
                    if (assuntoTextarea) assuntoTextarea.value = '';
                } else {
                    const text = await resp.text();
                    alert('Falha ao enviar: ' + text);
                }
            } catch (err) {
                console.error('Erro ao enviar contato:', err);
                alert('Erro ao enviar contato. Tente novamente.');
            }
        });
    }
});
function renderNoticias(noticias, idioma) {
    const container = document.querySelector('.carroselBox');
    // usa fragment para minimizar reflows
    const html = noticias.map((noticia, index) => `
        <div class="carrosel" id="slide${index}">
            <img class="fade-in" loading="lazy" src="${noticia.NoticiasImagem}" alt="${noticia.NoticiasTitulo}">

            <div class="carroselText">
                <h3 class="fade-in">${noticia.NoticiasTitulo}</h3>
                <p class="fade-in">${noticia.NoticiasSubtitulo}</p>
            </div>
        </div>
    `).join('');
    container.innerHTML = html;
    requestAnimationFrame(()=>{
        container.querySelectorAll('.fade-in').forEach(el=>el.classList.add('ready'));
    });
}

function renderProjetos(projetos, idioma) {
    const boxes = document.querySelectorAll('.cardsBox');
    const container = boxes[0]; // primeiro cardsBox = projetos
    if (!container) return;

    const lista = (projetos || [])
        .filter(p => p.Ativo !== false)
        .sort((a,b) => (a.OrdemdeExibicao||0) - (b.OrdemdeExibicao||0))
        .slice(0,4);

    if (lista.length > 0 && lista.length < 4) {
        container.classList.add('centered');
    } else {
        container.classList.remove('centered');
    }
    container.innerHTML = lista.map(projeto => `
        <div class="card cardWide" data-id="${projeto.ProjetosId}">
            <div class="cardImg">
                <img class="fade-in" loading="lazy" src="${projeto.ImagemCard || projeto.ImagemCarrossel || ''}" alt="${projeto.ProjetosTitulo}">
            </div>
            <div class="cardText">
                <h4 class="fade-in">${projeto.ProjetosTitulo}</h4>
                <p class="fade-in">${projeto.CardResumo || ''}</p>
            </div>
        </div>
    `).join('');
    requestAnimationFrame(()=>{
        container.querySelectorAll('.fade-in').forEach(el=>el.classList.add('ready'));
    });
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
    
    const lista = (publicacoes || [])
        .filter(p => p.PublicacaoVisibilidade !== false)
        .slice(0,4);

    if (lista.length > 0 && lista.length < 4) {
        container.classList.add('centered');
    } else {
        container.classList.remove('centered');
    }

    container.innerHTML = lista.map(pub => {
        const hasLink = !!pub.PublicacaoLinkExterno;
        return `
        <div class="card cardWide ${hasLink ? 'clickable' : 'no-link'}" data-link="${pub.PublicacaoLinkExterno || ''}">
            <div class="cardImg">
                <img class="fade-in" loading="lazy" src="${pub.PublicacaoImagem || ''}" alt="${pub.PublicacaoTitulo || ''}">
            </div>
            <div class="cardText">
                <h4 class="fade-in">${pub.PublicacaoTitulo || ''}</h4>
                <p class="fade-in">${pub.PublicacaoCitacao || ''}</p>
                ${hasLink ? '<span class="externoHint">Abrir publicação</span>' : '<span class="externoHint disabled">Sem link externo</span>'}
            </div>
        </div>`;
    }).join('');
    requestAnimationFrame(()=>{
        container.querySelectorAll('.fade-in').forEach(el=>el.classList.add('ready'));
    });
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

function renderEquipe(membros, idioma) {
    const container = document.querySelector('.equipeCarrosel');
    if (!container) return;
    const leftBtn = document.getElementById('leftArrow');
    const rightBtn = document.getElementById('rightArrow');

    const lista = Array.isArray(membros) ? membros : [];
    if (!lista.length) {
        container.innerHTML = '';
        if (leftBtn) leftBtn.style.display = 'none';
        if (rightBtn) rightBtn.style.display = 'none';
        return;
    }

    container.innerHTML = '<div class="equipeTrack"></div>';
    const track = container.querySelector('.equipeTrack');
    track.innerHTML = lista.map(m => `
        <div class="cardEquipeMiniatura" data-id="${m.MembrosID}">
            <img loading="lazy" src="${m.MembrosImagem || ''}" alt="${m.MembrosNome}">
            <div class="cardTextEquipe"><p>${m.MembrosNome}</p></div>
        </div>`).join('');

    // tamanho do passo = largura de um card + gap (12px)
    const firstCard = track.children[0];
    let step = 180;
    if (firstCard) {
        const rect = firstCard.getBoundingClientRect();
        step = rect.width + 12;
    }

    const scrollNext = () => {
        const maxScroll = track.scrollWidth - container.clientWidth;
        let target = container.scrollLeft + step;
        if (target > maxScroll + 10) target = 0; // loop
        container.scrollTo({ left: target, behavior: 'smooth' });
    };

    const scrollPrev = () => {
        const maxScroll = track.scrollWidth - container.clientWidth;
        let target = container.scrollLeft - step;
        if (target < -10) target = maxScroll; // loop inverso
        container.scrollTo({ left: target, behavior: 'smooth' });
    };

    if (leftBtn) {
        leftBtn.style.display = lista.length > 1 ? 'block' : 'none';
        leftBtn.onclick = scrollPrev;
    }
    if (rightBtn) {
        rightBtn.style.display = lista.length > 1 ? 'block' : 'none';
        rightBtn.onclick = scrollNext;
    }
}