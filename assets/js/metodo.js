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

    // Ativa o modo interativo (CSS habilita estados + stage em tela cheia).
    section.classList.add('is-ready');
    render(0);

    const stage = section.querySelector('.metodo-stage');
    // Distância de scroll proporcional ao nº de passos (~70vh por passo).
    const distance = total * 70;

    ScrollTrigger.create({
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
})();
