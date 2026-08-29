// main.js — Arranque e inicialización

document.addEventListener('DOMContentLoaded', () => {
  // Botón nueva partida
  document.getElementById('btn-nueva-partida')?.addEventListener('click', () => {
    document.getElementById('overlay-fin')?.classList.remove('visible');
    Engine.nuevaPartida();
  });

  // Botón reiniciar desde overlay de fin
  document.getElementById('btn-reiniciar')?.addEventListener('click', () => {
    document.getElementById('overlay-fin')?.classList.remove('visible');
    Engine.nuevaPartida();
  });

  // Canvas de mapa — click para seleccionar puerta
  const canvas = document.getElementById('mapa-canvas');
  if (canvas) {
    canvas.addEventListener('click', (e) => {
      if (!Game.cartaActual || State.faseActual !== 'colocar') return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      MapEngine._ultimoClick = { x, y };
    });

    // Resize canvas
    function resizeCanvas() {
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      UI.renderMapa();
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
  }

  // Arrancar partida automáticamente
  Engine.nuevaPartida();
});
