// home.js

/**
 * @param {Object} item
 * @param {string} tipo
 * @returns {HTMLElement}
 */
function criarCardHTML(item, tipo) {
  const id = item.ProjetosId || item.PublicacaoID;
  const titulo = item.ProjetosTitulo || item.PublicacaoTitulo;
  const imagem =
    item.ImagemCard || item.ProjetosImagem || item.PublicacaoImagem;

  const resumo =
    item.ProjetoDescricao ||
    item.ProjetosResumo ||
    item.PublicacaoCitacao ||
    "Leia mais...";

  let urlDetalhe = "";

  if (tipo === "projeto") {
    urlDetalhe = `/pages/projeto.html?id=${id}`;
  } else if (tipo === "publicacao") {
    urlDetalhe = `/pages/publicacao.html?id=${id}`;
  }

  const cardLink = document.createElement("a");
  cardLink.href = urlDetalhe;
  cardLink.title = titulo;
  cardLink.className = "card-link";

  cardLink.innerHTML = `
            <a href="/pages/projetoCONAB.html?project=${id}" title="${titulo}" class="card-link">
                <div class="card cardWide id="PROJETOScard1">
                    <img src="${imagem}" alt="${titulo}" class="card-img" onerror="this.style.display='none'">

                    <div class="cardText">
                       <h4>${titulo || titulo}</h4>
                       <p>${resumo || "Descrição não disponível"}</p>
                    </div>

                </div>
               
            </a>
        `;

  return cardLink;
}

async function carregarFeedInicial() {
  const urlProjetos = "/projeto/ultimos";
  const urlPublicacoes = "/publicacao/ultimas";

  const [resProjetos, resPublicacoes] = await Promise.all([
    fetch(urlProjetos),
    fetch(urlPublicacoes),
  ]);

  let projetos = [];
  if (resProjetos.ok || resProjetos.status === 304) {
    try {
      const dataProjetos = await resProjetos.json();
      projetos = dataProjetos.results || [];
    } catch (e) {
      console.warn(
        "Resposta 304 sem corpo JSON. Prosseguindo com array vazio."
      );
    }
  } else {
    console.error("Erro ao buscar projetos:", resProjetos.status);
  }

  let publicacoes = [];
  if (resPublicacoes.ok || resPublicacoes.status === 304) {
    try {
      const dataPublicacoes = await resPublicacoes.json();
      publicacoes = dataPublicacoes.results || [];
    } catch (e) {
      console.warn(
        "Resposta 304 sem corpo JSON. Prosseguindo com array vazio."
      );
    }
  } else {
    console.error("Erro ao buscar publicações:", resPublicacoes.status);
  }

  renderizarCards(projetos, "container-projetos", "projeto");
  renderizarCards(publicacoes, "container-publicacoes", "publicacao");
}

function renderizarCards(dados, containerId, tipo) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  dados.forEach((item) => {
    const cardElement = criarCardHTML(item, tipo);
    container.appendChild(cardElement);
  });
}

document.addEventListener("DOMContentLoaded", carregarFeedInicial);


