(function () {
    'use strict';

    const section = document.getElementById('exames');
    if (!section) return;

    const items = Array.prototype.slice.call(section.querySelectorAll('.exames-item'));
    if (!items.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasGSAP = window.gsap && window.ScrollTrigger;

    // Fallback para redução de movimento ou ausência do GSAP
    if (prefersReduced || !hasGSAP) {
        items.forEach(item => item.classList.add('exames-item-active'));
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Fixar coluna de texto à esquerda no desktop de forma robusta com GSAP
    gsap.matchMedia().add('(min-width: 1024px)', () => {
        const stickyContent = section.querySelector('.exames-sticky-content');
        if (!stickyContent) return;

        const pinTrigger = ScrollTrigger.create({
            trigger: ".exames-left-col",
            pin: ".exames-sticky-content",
            start: "top 112px",
            end: () => "bottom " + (stickyContent.offsetHeight + 112) + "px",
            pinSpacing: false,
            invalidateOnRefresh: true
        });

        return () => {
            pinTrigger.kill();
        };
    });

    // O primeiro item inicia ativo por padrão para guiar o olhar do usuário
    items[0].classList.add('exames-item-active');

    // Mapeamento de ScrollTrigger para cada item
    items.forEach((item, index) => {
        ScrollTrigger.create({
            trigger: item,
            // Ativa quando o topo do item atinge 62% da altura do viewport e sai ao passar de 38%
            start: "top 62%",
            end: "bottom 38%",
            onEnter: () => {
                setActive(index);
            },
            onEnterBack: () => {
                setActive(index);
            },
            onLeave: () => {
                // Ao descer do último, mantém ele ativo para não apagar o conteúdo final
                if (index === items.length - 1) return;
                item.classList.remove('exames-item-active');
            },
            onLeaveBack: () => {
                // Ao subir acima do primeiro, mantém ele ativo
                if (index === 0) return;
                item.classList.remove('exames-item-active');
            }
        });
    });

    function setActive(activeIndex) {
        items.forEach((item, i) => {
            if (i === activeIndex) {
                item.classList.add('exames-item-active');
            } else {
                item.classList.remove('exames-item-active');
            }
        });
    }
})();
