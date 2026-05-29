// FLASH LIGHT MOUSE TRACKING
function updateFlashlight(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
}

// 3D TILT EFFECT LOGIC
function updateTilt(e, card) {
    const rect = card.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const x = e.clientX - rect.left - (w / 2);
    const y = e.clientY - rect.top - (h / 2);

    // Calcula rotações (máximo de 12 graus)
    const rotX = -(y / (h / 2)) * 12;
    const rotY = (x / (w / 2)) * 12;

    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
}

// RESET TILT
function resetTilt(card) {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
}

// INTERSECTION OBSERVER PARA EFEITOS DE SURGIMENTO (REVEALS)
const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            entry.target.classList.add('reveal-active');

            // Dispara surgimento nos filhos se existirem
            const subreveals = entry.target.querySelectorAll('.reveal');
            subreveals.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('active');
                }, index * 120);
            });
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal, .text-reveal-wrapper, section').forEach(el => {
    revealObserver.observe(el);
});

// PARALLAX RETINA NO SCROLL DA HERO E DOS DIRETORES
const parallaxWrappers = document.querySelectorAll('.doctor-parallax-wrapper');

function updateParallax() {
    const scroll = window.scrollY;
    const viewHeight = window.innerHeight;

    const heroContent = document.querySelector('h1');
    if (heroContent) {
        if (window.innerWidth > 1024) {
            heroContent.style.transform = `translateY(${scroll * 0.08}px)`;
        } else {
            heroContent.style.transform = 'none';
        }
    }

    // Parallax dos Diretores
    if (window.innerWidth > 1024) {
        parallaxWrappers.forEach(wrapper => {
            const rect = wrapper.getBoundingClientRect();
            if (rect.top < viewHeight && rect.bottom > 0) {
                const elementCenter = rect.top + rect.height / 2;
                const screenCenter = viewHeight / 2;
                const diff = elementCenter - screenCenter;
                const translateY = diff * -0.07;
                wrapper.style.transform = `translateY(${translateY}px)`;
            }
        });
    } else {
        parallaxWrappers.forEach(wrapper => {
            wrapper.style.transform = 'none';
        });
    }
}

window.addEventListener('scroll', updateParallax);
window.addEventListener('resize', updateParallax);

// Executa imediatamente para evitar pulos na carga
setTimeout(updateParallax, 50);

// INJEÇÃO DINÂMICA DE ESTRELAS BRILHANTES (Sirocco night style)
const starsContainer = document.getElementById('stars-container');
if (starsContainer) {
    const count = 40;
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        starsContainer.appendChild(star);
    }
}
