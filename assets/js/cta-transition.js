(function() {
    'use strict';

    // 1. Dynamic Stars Injection
    const ctaStarsContainer = document.querySelector('.cta-stars-container');
    if (ctaStarsContainer) {
        const count = 30;
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            const size = Math.random() * 2 + 0.5;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            ctaStarsContainer.appendChild(star);
        }
    }

    // 2. Stars na seção de transição dia → noite
    const transitionStars = document.getElementById('transition-stars');
    if (transitionStars) {
        for (var ts = 0; ts < 35; ts++) {
            var s = document.createElement('div');
            s.className = 'star';
            s.style.left = (Math.random() * 100) + '%';
            // Concentra mais estrelas na metade inferior (a mais escura)
            s.style.top = (40 + Math.random() * 60) + '%';
            var sz = Math.random() * 1.8 + 0.4;
            s.style.width = sz + 'px';
            s.style.height = sz + 'px';
            s.style.animationDelay = (Math.random() * 4) + 's';
            s.style.opacity = Math.random() * 0.6 + 0.2;
            transitionStars.appendChild(s);
        }
    }

    // 3. GSAP ScrollTrigger Transition Setup
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasGSAP = window.gsap && window.ScrollTrigger;

    if (prefersReducedMotion || !hasGSAP) {
        return; // Degrades gracefully using standard CSS styles
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctaSection = document.getElementById('cta-section');
    const ctaContainer = document.getElementById('agendamento');
    if (!ctaSection || !ctaContainer) return;

    // GSAP MatchMedia for clean responsive animation
    const mm = gsap.matchMedia();

    // Desktop: Sticky curtain reveal + parallax de profundidade no scroll
    // Parallax: camadas de fundo viajam ~3× mais que o conteúdo,
    // criando ilusão de profundidade na entrada (inspirado no Sirocco reserve).
    mm.add('(min-width: 768px)', () => {
        // Estados iniciais — deslocamentos compactos para animação suave
        gsap.set(ctaSection, { backgroundColor: "rgba(28, 25, 23, 0)" });
        gsap.set(".cta-glow-light", { opacity: 0, scale: 0.75, y: 55 });
        gsap.set(".cta-stars-container", { opacity: 0, y: 32 });
        gsap.set("#cta-title", { opacity: 0, y: 22, filter: "blur(5px)", scale: 0.98 });
        gsap.set("#cta-desc", { opacity: 0, y: 16, filter: "blur(3px)" });
        gsap.set("#cta-buttons-container", { opacity: 0, y: 10 });

        const ctaTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: ctaContainer,
                start: "top bottom",
                end: "bottom bottom",
                scrub: 2,       // inércia maior = movimento mais fluído
                markers: false
            }
        });

        ctaTimeline
            .to(ctaSection, { backgroundColor: "rgba(28, 25, 23, 1)", ease: "none" })
            .to(".cta-glow-light", { opacity: 1, scale: 1, y: -20, ease: "power1.inOut" }, "<")
            .to(".cta-stars-container", { opacity: 0.55, y: -10, ease: "power1.inOut" }, "<")
            .to("#cta-title", { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, ease: "power2.inOut" }, "-=0.5")
            .to("#cta-desc", { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.inOut" }, "-=0.35")
            .to("#cta-buttons-container", { opacity: 1, y: 0, ease: "power2.inOut" }, "-=0.35");

        return () => {
            gsap.killTweensOf([ctaSection, ".cta-glow-light", ".cta-stars-container", "#cta-title", "#cta-desc", "#cta-buttons-container"]);
            gsap.set([ctaSection, ".cta-glow-light", ".cta-stars-container", "#cta-title", "#cta-desc", "#cta-buttons-container"], { clearProps: "all" });
        };
    });

    // Mobile: Reveal suave sem sticky
    mm.add('(max-width: 767px)', () => {
        gsap.set("#cta-title", { opacity: 0, y: 20 });
        gsap.set("#cta-desc", { opacity: 0, y: 15 });
        gsap.set("#cta-buttons-container", { opacity: 0, y: 10 });

        const mobileTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: ctaSection,
                start: "top bottom",
                end: "center center",
                scrub: true,
                markers: false
            }
        });

        mobileTimeline
            .to("#cta-title", { opacity: 1, y: 0, ease: "power1.out" })
            .to("#cta-desc", { opacity: 1, y: 0, ease: "power1.out" }, "-=0.3")
            .to("#cta-buttons-container", { opacity: 1, y: 0, ease: "power1.out" }, "-=0.3");

        return () => {
            gsap.killTweensOf(["#cta-title", "#cta-desc", "#cta-buttons-container"]);
            gsap.set(["#cta-title", "#cta-desc", "#cta-buttons-container"], { clearProps: "all" });
        };
    });
})();
