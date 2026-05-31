/* =============================================================
   SEÇÃO MÉTODO — Timeline interativa dirigida por scroll
   -------------------------------------------------------------
   Responsabilidade desta camada: SOMENTE mapear o scroll para um
   progresso (0 → 1) e um estado por passo (idle | active | done).
   Toda a aparência/transição vive no CSS (assets/css/style.css),
   reagindo a `--progress` e ao atributo `data-state`.

   Pinning: feito pelo GSAP ScrollTrigger (pin do .metodo-stage). É
   robusto dentro de containers centralizados e independe de `overflow`
   de elementos ancestrais (ao contrário de position: sticky).

   Escalável: funciona com qualquer número de passos (lê do DOM).
   ============================================================= */
(function () {
    'use strict';

    const section = document.getElementById('metodo');
    if (!section) return;

    const timeline = section.querySelector('[data-metodo]');
    const track = section.querySelector('.metodo-track');
    const steps = Array.prototype.slice.call(section.querySelectorAll('.metodo-step'));
    if (!timeline || !track || !steps.length) return;

    const total = steps.length;

    // Mapeia um progresso 0→1 para o preenchimento da linha e o estado de cada passo.
    function render(progress) {
        const p = Math.max(0, Math.min(1, progress));
        timeline.style.setProperty('--progress', p.toFixed(4));

        // Índice do passo "alcançado" pela linha de progresso.
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
