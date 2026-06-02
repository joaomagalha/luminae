/* Método section: maps scroll progress to step states (idle/active/done).
   Visual styles live in style.css; scroll logic here.
   Pin via GSAP ScrollTrigger — more robust than sticky inside overflow containers. */
(function () {
    'use strict';

    const section = document.getElementById('metodo');
    if (!section) return;

    const timeline = section.querySelector('[data-metodo]');
    const track = section.querySelector('.metodo-track');
    const steps = Array.prototype.slice.call(section.querySelectorAll('.metodo-step'));
    if (!timeline || !track || !steps.length) return;

    const total = steps.length;

    function render(progress) {
        const p = Math.max(0, Math.min(1, progress));
        timeline.style.setProperty('--progress', p.toFixed(4));

        const reached = Math.min(total - 1, Math.floor(p * (total - 1) + 1e-4));
        const complete = p > 0.995;

        for (let i = 0; i < total; i++) {
            steps[i].dataset.state =
                complete ? 'done' :
                i < reached ? 'done' :
                i === reached ? 'active' : 'idle';
        }
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasGSAP = window.gsap && window.ScrollTrigger;

    // Fallback estático: sem animação de scroll, o CSS (:not(.is-ready))
    // exibe a timeline completa e legível. Nada a fazer aqui.
    if (prefersReduced || !hasGSAP) return;

    gsap.registerPlugin(ScrollTrigger);

    const stage = section.querySelector('.metodo-stage');
    // Distância de scroll proporcional ao nº de passos (~70vh por passo).
    const distance = total * 70;

    // Pin só ativo em desktop (≥1024px). Em mobile/tablet o GSAP define
    // width fixo no elemento pinado, causando overflow horizontal.
    gsap.matchMedia().add('(min-width: 1024px)', function () {
        section.classList.add('is-ready');
        render(0);

        var trigger = ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: '+=' + distance + '%',
            pin: stage,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: function (self) { render(self.progress); },
            onRefresh: function (self) { render(self.progress); }
        });

        return function () {
            trigger.kill();
            section.classList.remove('is-ready');
        };
    });

    /* -------------------------------------------------------------
       Correção de âncoras vindas de OUTRA página
       (ex.: blog.html → index.html#programas).
       O pin do ScrollTrigger altera a altura do documento DEPOIS do
       carregamento, então o salto nativo do navegador para a âncora
       cai no lugar errado (topo). Aqui re-rolamos para o alvo já com
       o layout assentado, descontando a altura do header fixo.
       ------------------------------------------------------------- */
    function scrollToHashTarget() {
        var hash = window.location.hash;
        if (!hash || hash.length < 2) return;
        var target = document.querySelector(hash);
        if (!target) return;
        ScrollTrigger.refresh();
        requestAnimationFrame(function () {
            var headerH = 72; // compensa o header sticky
            var y = target.getBoundingClientRect().top + window.scrollY - headerH;
            window.scrollTo(0, Math.max(0, y));
        });
    }
    window.addEventListener('load', function () {
        // pequeno atraso para garantir que o pin-spacer já foi criado
        setTimeout(scrollToHashTarget, 80);
    });
})();
