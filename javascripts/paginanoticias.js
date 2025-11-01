
        // SELEÇÃO DOS ELEMENTOS PRINCIPAIS
        const slider = document.getElementById('slider');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const indicators = document.getElementById('indicators');
        const indicatorDots = document.querySelectorAll('.indicator');
        const carouselContainer = document.querySelector('.carrosel-noticias');

        // VARIÁVEIS DE CONTROLE
        let currentSlide = 0;
        const totalSlides = document.querySelectorAll('.slide').length;
        let autoSlideInterval;
        let isPaused = false;

        // FUNÇÃO PARA ATUALIZAR A POSIÇÃO DO SLIDER
        function updateSlider() {
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Atualiza os indicadores (bolinhas)
            indicatorDots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // FUNÇÃO PARA IR PARA O PRÓXIMO SLIDE
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }

        // FUNÇÃO PARA IR PARA O SLIDE ANTERIOR
        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        }

        // FUNÇÃO PARA IR PARA UM SLIDE ESPECÍFICO
        function goToSlide(index) {
            currentSlide = index;
            updateSlider();
        }

        // FUNÇÃO PARA INICIAR O SLIDE AUTOMÁTICO
        function startAutoSlide() {
            // Limpa qualquer intervalo existente antes de criar um novo
            stopAutoSlide();
            
            // Só inicia se não estiver pausado
            if (!isPaused) {
                autoSlideInterval = setInterval(nextSlide, 4000);
            }
        }

        // FUNÇÃO PARA PARAR O SLIDE AUTOMÁTICO
        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        }

        // FUNÇÃO PARA PAUSAR O SLIDE AUTOMÁTICO
        function pauseAutoSlide() {
            isPaused = true;
            stopAutoSlide();
        }

        // FUNÇÃO PARA RETOMAR O SLIDE AUTOMÁTICO
        function resumeAutoSlide() {
            isPaused = false;
            startAutoSlide();
        }

        // EVENT LISTENERS PARA AS SETAS
        nextBtn.addEventListener('click', () => {
            nextSlide();
            // Reinicia o temporizador após interação do usuário
            pauseAutoSlide();
            setTimeout(resumeAutoSlide, 6000); // Retoma após 6 segundos
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            // Reinicia o temporizador após interação do usuário
            pauseAutoSlide();
            setTimeout(resumeAutoSlide, 6000); // Retoma após 6 segundos
        });

        // EVENT LISTENERS PARA OS INDICADORES
        indicatorDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const slideIndex = parseInt(dot.getAttribute('data-index'));
                goToSlide(slideIndex);
                // Reinicia o temporizador após interação do usuário
                pauseAutoSlide();
                setTimeout(resumeAutoSlide, 6000); // Retoma após 6 segundos
            });
        });

        // CONTROLE DE PAUSA COM MOUSE - CORRIGIDO
        carouselContainer.addEventListener('mouseenter', () => {
            pauseAutoSlide();
        });

        carouselContainer.addEventListener('mouseleave', () => {
            resumeAutoSlide();
        });

        // PREVENIR COMPORTAMENTO PADRÃO DE ARRASTAR IMAGENS
        const carouselImages = document.querySelectorAll('.imagem-carrosel img');
        carouselImages.forEach(img => {
            img.addEventListener('dragstart', (e) => {
                e.preventDefault();
            });
        });

        // INICIALIZAÇÃO
        updateSlider(); // Garante que o slider comece na posição correta
        startAutoSlide();
    