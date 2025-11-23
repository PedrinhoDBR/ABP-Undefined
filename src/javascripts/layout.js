function addLogoutEvent() {
    const btn = document.getElementById("logoutBtn");
    if (!btn) {
        console.warn("Logout button not found yet.");
        return;
    }

    btn.addEventListener("click", function(e) {
        e.preventDefault();
        console.log("Logout button clicked");

        fetch("/user/logout", { method: "POST" })
            .then(() => window.location.href = "/");
    });
}

async function loadHeader() {
    const espacoDoMeuHeader = document.querySelector("#header-socket");
    try {
        const header = await fetch("/Layout/header.html");
        const headerText = await header.text();
        espacoDoMeuHeader.innerHTML = headerText;

        const idiomaResponse = await fetch('/get-idioma');
        const { idioma } = await idiomaResponse.json();
        translatePage(idioma);
        const languageOptions = document.querySelectorAll('.idioma .submenu a');

        if (languageOptions) {
            languageOptions.forEach(option => {
                option.addEventListener('click', async function (e) {
                    e.preventDefault();
                    const selectedValue = this.getAttribute('data-value');
                    try {
                        await fetch('/alterar-idioma', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ idioma: selectedValue })
                        });
                        location.reload(); // Atualiza a página atual
                    } catch (error) {
                        console.error('Erro ao alterar idioma:', error);
                    }
                });
            });
        }

        // Atualiza os textos do header com base no idioma
        if (idioma === 'EN-US') {
            const sobreButton = document.querySelector('.sobre .menu-button');
            const submenuSobre = document.querySelector('.submenu a[href="/sobre"]');
            const submenuEquipe = document.querySelector('.submenu a[href="/equipe"]');
            const submenuColaboradores = document.querySelector('.submenu a[href="/?colaboradores"]');
            const submenuFacaparte = document.querySelector('.submenu a[href="/facaparte"]');
            const atuacaoButton = document.querySelector('.atuacao .menu-button');
            const submenuAtuacaoPesquisa = document.querySelector('.submenuAtuacao a:first-child');
            const submenuAtuacaoProjetos = document.querySelector('.submenuAtuacao a:last-child');
            const publicacoesButton = document.querySelector('a[href="/publicacoes"]');
            const noticiasButton = document.querySelector('a[href="/noticias"]');
            const contatoButton = document.querySelector('a[href="/contato"]');
            const idiomaButton = document.querySelector('.idioma .menu-button');
            const adminButton = document.querySelector('.menu-button.admin-login');

            if (sobreButton) sobreButton.innerHTML  = 'About <div class="arrow-down"></div>';
            if (submenuSobre) submenuSobre.innerHTML  = 'About AgriRs';
            if (submenuEquipe) submenuEquipe.innerHTML  = 'Team';
            if (submenuColaboradores) submenuColaboradores.innerHTML  = 'Collaborators';
            if (submenuFacaparte) submenuFacaparte.innerHTML  = 'Opportunities';
            if (atuacaoButton) atuacaoButton.innerHTML  = 'Activities <div class="arrow-down"></div>';
            if (submenuAtuacaoPesquisa) submenuAtuacaoPesquisa.innerHTML  = 'Research Areas';
            if (submenuAtuacaoProjetos) submenuAtuacaoProjetos.innerHTML  = 'Projects';
            if (publicacoesButton) publicacoesButton.innerHTML  = 'Publications';
            if (noticiasButton) noticiasButton.innerHTML  = 'News';
            if (contatoButton) contatoButton.innerHTML  = 'Contact';
            if (idiomaButton) idiomaButton.innerHTML  = 'Language <div class="arrow-down"></div>';
            if (adminButton) adminButton.innerHTML  = 'Admin';
        }
    } catch (error) {
        console.error("Erro ao carregar o header:", error);
    }
}

async function loadFooter() {
    const espacoDoMeuFooter = document.querySelector("#footer-socket");
    const footer = await fetch("/Layout/footer.html");
    const footerText = await footer.text();
    espacoDoMeuFooter.innerHTML = footerText;

    const idiomaResponse = await fetch('/get-idioma');
    const { idioma } = await idiomaResponse.json();

    // Atualiza os textos do footer com base no idioma
    if (idioma === 'EN-US') {
        const footer1Title = document.querySelector('#footer1 h4');
        const footer2Text = document.querySelector('#footer2 p');
        const footer3Text = document.querySelector('#footer3 p');

        if (footer1Title) footer1Title.textContent = 'Our Social Media:';
        if (footer2Text) footer2Text.textContent = 'Copyright 2025 - INPE';
        if (footer3Text) footer3Text.textContent =
            'Institutional Relations Service - SEREL National Institute for Space Research - INPE';
    }
}

async function AdmLoadHeader() {
    const AdmEspacoDoMeuHeader = document.querySelector("#adm-header-socket");
    const AdmHeader = await fetch("/Layout/admin_header.html");
    const AdmHeaderText = await AdmHeader.text();

    AdmEspacoDoMeuHeader.innerHTML = AdmHeaderText;

    addLogoutEvent();
}

loadHeader();
loadFooter();
AdmLoadHeader();


function translatePage(idioma) {
    if (idioma === "EN-US") {
        // Tradução para a página "sobre.html"
        if (document.body.classList.contains("sobreBody")) {
            document.querySelector(".titulo").textContent = "ABOUT US";
            const boxes = document.querySelectorAll(".box .textBox h3");
            boxes[0].textContent =
                "AgriRS Lab is a laboratory linked to the Division of Earth Observation and Geoinformatics (DIOTG) of the National Institute for Space Research (INPE).";
            boxes[1].textContent =
                "We are a remote sensing laboratory focused on agriculture, studying and monitoring agricultural crops with the support of satellite images and geospatial data.";
            boxes[2].textContent =
                "We also conduct research in environmental and social areas, such as deforestation detection and land use and cover changes.";
            boxes[3].textContent =
                "We aim to connect technology, science, and socio-environmental responsibility to generate knowledge and support decision-making.";
        }

        // Tradução para a página "facaparte.html"
        if (document.body.classList.contains("facaparte")) {
            document.querySelector(".titulo").textContent = "Join AgriRS Lab";
            const sections = document.querySelectorAll("section");
            sections[0].querySelector(".texto ul").innerHTML = `
                <li>At AgriRS Lab INPE, we believe that science, technology, and collaboration can transform agriculture and the environment.</li>
                <li>We work with remote sensing and geoinformatics to monitor crops, estimate yields, and support strategic decisions that directly impact sustainability and food security.</li>
                <li>If you also believe in the power of science to generate positive impact, come build this future with us.</li>
            `;
            sections[1].querySelector(".texto h2").textContent = "Why join AgriRS Lab?";
            sections[1].querySelector(".texto ul").innerHTML = `
                <li>Work on innovative projects in agricultural and environmental monitoring.</li>
                <li>Collaborate with leading researchers in Brazil and worldwide.</li>
                <li>Participate in scientific publications and industry events.</li>
                <li>Contribute to solutions that support public policies and sustainable agricultural practices.</li>
            `;
            sections[2].querySelector("ul").innerHTML = `
                <li><h3>Scientific Initiation (IC)</h3></li>
                <li>For undergraduate students who want to start scientific research.</li>
                <li><h3>Internships</h3></li>
                <li>Practical experience in agricultural monitoring, geospatial data analysis, and project support.</li>
                <li><h3>Postgraduate Studies</h3></li>
                <li>INPE programs in Remote Sensing.</li>
                <li><h3>Collaborations</h3></li>
                <li>Researchers, institutions, and companies wishing to develop projects together with us.</li>
            `;
            sections[3].querySelector("ul").innerHTML = `
                <li><h2>How to apply</h2></li>
                <li>Choose the modality that suits you best.</li>
                <li>Prepare your documentation (resume, transcript, motivation letter, as required).</li>
                <li>Send your application to <a href="mailto:agris@inpe.br">agris@inpe.br</a> or through the contact form.</li>
                <li>Wait for our response.</li>
            `;
            document.querySelector("#proxpasso").textContent = "Ready to take the next step?";
            document.querySelector("button h3").textContent = "Apply now";
        }

        // Tradução para a página "paginadecontato.html"
        if (document.body.classList.contains("paginadecontatoBody")) {
            document.querySelector(".contatoInfo h1").textContent = "CONTACT INFORMATION";
            const form = document.querySelector(".contatoInfo form");
            form.querySelector("#nome").setAttribute("placeholder", "Enter your name");
            form.querySelector("#mail").setAttribute("placeholder", "Enter your email");
            form.querySelector("#assunto").setAttribute("placeholder", "Subject");
            form.querySelector("button").textContent = "Send";
            document.querySelector(".localizacao h1").textContent = "OUR LOCATION:";
        }
    }
}