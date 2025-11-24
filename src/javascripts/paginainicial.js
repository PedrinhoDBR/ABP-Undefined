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

        // Botões de mais...
        const btnNoticias = document.getElementById('btnMaisNoticias');
        const btnProjetos = document.getElementById('btnMaisProjetos');
        const btnPublicacoes = document.getElementById('btnMaisPublicacoes');
        if (btnNoticias) btnNoticias.addEventListener('click', () => window.location.href = '/noticias');
        if (btnProjetos) btnProjetos.addEventListener('click', () => window.location.href = '/projetos');
        if (btnPublicacoes) btnPublicacoes.addEventListener('click', () => window.location.href = '/publicacoes');
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

function renderEquipe(membros, idioma) {
    const container = document.querySelector('.equipeCarrosel');
    if (!container) return;
    container.innerHTML = membros.map(membro => `
        <div class="cardEquipeMiniatura" data-id="${membro.MembrosID}">
            <img src="${membro.MembrosImagem || ''}" alt="${membro.MembrosNome}">
            <div class="cardTextEquipe">
                <p>${membro.MembrosNome}</p>
            </div>
        </div>
    `).join('');
}