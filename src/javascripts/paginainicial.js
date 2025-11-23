


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
                <p>${noticia.NoticiasResumo}</p>
            </div>
        </div>
    `).join('');
}

function renderProjetos(projetos, idioma) {
    const container = document.querySelector('.cardsBox');
    container.innerHTML = projetos.map(projeto => `
        <div class="card cardWide">
            <div class="cardImg">
                <img src="${projeto.ProjetosImagem}" alt="${projeto.ProjetosTitulo}">
            </div>
            <div class="cardText">
                <h4>${projeto.ProjetosTitulo}</h4>
                <p>${projeto.ProjetosResumo}</p>
            </div>
        </div>
    `).join('');
}

function renderPublicacoes(publicacoes, idioma) {
    const container = document.querySelector('.cardsBox');
    container.innerHTML = publicacoes.map(pub => `
        <div class="card cardWide">
            <div class="cardImg">
                <img src="${pub.PublicacaoImagem}" alt="${pub.PublicacaoTitulo}">
            </div>
            <div class="cardText">
                <h4>${pub.PublicacaoTitulo}</h4>
                <p>${pub.PublicacaoResumo}</p>
            </div>
        </div>
    `).join('');
}

function renderEquipe(membros, idioma) {
    const container = document.querySelector('.equipeCarrosel');
    container.innerHTML = membros.map(membro => `
        <div class="cardEquipeMiniatura">
            <img src="${membro.MembrosImagem}" alt="${membro.MembrosNome}">
            <div class="cardTextEquipe">
                <p>${membro.MembrosNome}</p>
            </div>
        </div>
    `).join('');
}