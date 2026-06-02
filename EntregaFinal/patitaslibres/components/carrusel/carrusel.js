/* carrusel.js */

(function () {
  const track = document.getElementById('carrusel-track');
  const dotsContainer = document.getElementById('carrusel-dots');
  if (!track) return;

  const slides = Array.from(track.children);
  let current = 0;
  let autoplayTimer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carrusel__dot' + (i === 0 ? ' activo' : '');
    dot.setAttribute('aria-label', 'Ir a slide ' + (i + 1));
    dot.addEventListener('click', () => { goTo(i); resetAutoplay(); });
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    const offset = slides[0].offsetWidth * current;
    track.style.transition = 'transform 0.4s ease';
    track.style.transform = 'translateX(-' + offset + 'px)';
    dotsContainer.querySelectorAll('.carrusel__dot').forEach((d, i) =>
      d.classList.toggle('activo', i === current)
    );
  }

  document.getElementById('carrusel-prev')
    ?.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
  document.getElementById('carrusel-next')
    ?.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => goTo(current + 1), 4000);
  }

  resetAutoplay();
})();
