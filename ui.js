// ui.js — Renderizado e interfaz

const UI = {

  // Cola de modales pendientes
  _modalQueue: [],
  _modalActivo: false,

  // ── RENDER PRINCIPAL ─────────────────────────────────────────────────

  renderAll() {
    this.renderTracks();
    this.renderMapa();
    this.renderInventario();
    this.renderLog();
    this.renderAcciones();
  },

  // ── TRACKS DE RECURSOS ────────────────────────────────────────────────

  renderTracks() {
    this._setPips('pips-vida', State.vida, 5, 'pip-vida');
    this._setPips('pips-det', State.determinacion, 5, 'pip-det');
    this._setTrackNum('track-ruido', State.ruido, 15, State.ruido >= 12 ? 'danger' : State.ruido >= 7 ? 'warn' : '');
    this._setTrackNum('track-dist', State.distanciaDracula, 5, State.distanciaDracula <= 1 ? 'danger' : State.distanciaDracula <= 2 ? 'warn' : '');
    this._setCounter('counter-pistas', State.pistas, 3);
    this._setCounter('counter-turno', State.turno, null);

    const panico = document.getElementById('estado-panico');
    if (panico) panico.classList.toggle('visible', State.enPanico);

    const salidaBtn = document.getElementById('btn-salida');
    if (salidaBtn) salidaBtn.classList.toggle('activa', State.salidaDisponible);
  },

  _setPips(id, valor, max, cls) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = '';
    for (let i = 0; i < max; i++) {
      const pip = document.createElement('div');
      pip.className = `pip ${cls} ${i < valor ? 'activo' : 'inactivo'}`;
      el.appendChild(pip);
    }
  },

  _setTrackNum(id, valor, max, cls) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = valor;
    el.className = `track-num ${cls}`;
  },

  _setCounter(id, valor, max) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = max ? `${valor}/${max}` : valor;
  },

  // ── MAPA ──────────────────────────────────────────────────────────────

  renderMapa() {
    const canvas = document.getElementById('mapa-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const CELL = 72;
    const bounds = MapEngine.getBounds();
    const offsetX = W / 2 - ((bounds.maxX + bounds.minX) / 2) * CELL;
    const offsetY = H / 2 - ((bounds.maxY + bounds.minY) / 2) * CELL;

    // Dibujar conexiones (puertas entre habitaciones)
    ctx.strokeStyle = '#5a3a1a';
    ctx.lineWidth = 2;
    for (const hab of State.habitacionesColocadas) {
      for (const dir of (hab.puertas_dirs || [])) {
        const [dx, dy] = [[0,-1],[1,0],[0,1],[-1,0]][['norte','este','sur','oeste'].indexOf(dir)];
        const vecino = MapEngine.getCelda(hab.x + dx, hab.y + dy);
        if (vecino) {
          const x1 = offsetX + hab.x * CELL + CELL / 2;
          const y1 = offsetY + hab.y * CELL + CELL / 2;
          const x2 = offsetX + vecino.x * CELL + CELL / 2;
          const y2 = offsetY + vecino.y * CELL + CELL / 2;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }
    }

    // Dibujar habitaciones
    for (const hab of State.habitacionesColocadas) {
      const cx = offsetX + hab.x * CELL;
      const cy = offsetY + hab.y * CELL;
      this._dibujarHabitacion(ctx, hab, cx, cy, CELL);
    }

    // Dibujar puertas abiertas (indicadores)
    const abiertas = MapEngine.todasPuertasAbiertas();
    for (const p of abiertas) {
      const cx = offsetX + p.x * CELL + CELL / 2;
      const cy = offsetY + p.y * CELL + CELL / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(184, 134, 11, 0.5)';
      ctx.fill();
      ctx.strokeStyle = '#b8860b';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  },

  _dibujarHabitacion(ctx, hab, cx, cy, CELL) {
    const pad = 4;
    const colores = {
      inicio:          { bg: '#2a1a0a', borde: '#b8860b', texto: '#f0e6d3' },
      tesoro:          { bg: '#1a2a0a', borde: '#4a7a1a', texto: '#c8e0a0' },
      amenaza:         { bg: '#2a0a0a', borde: '#8b0000', texto: '#f0c0a0' },
      pista:           { bg: '#0a1a2a', borde: '#1a5a8b', texto: '#a0c8f0' },
      descubrimiento:  { bg: '#1a0a2a', borde: '#5a1a8b', texto: '#d0a0f0' },
      vacia:           { bg: '#1a1a1a', borde: '#4a4a4a', texto: '#aaaaaa' },
      mixta:           { bg: '#2a1a0a', borde: '#8b6a00', texto: '#f0d080' },
    };
    const col = colores[hab.tipo] || colores.vacia;

    // Fondo
    ctx.fillStyle = col.bg;
    ctx.strokeStyle = hab.bloqueada ? '#ff0000' : col.borde;
    ctx.lineWidth = hab.id === 'hall' ? 3 : 2;
    ctx.beginPath();
    ctx.roundRect(cx + pad, cy + pad, CELL - pad * 2, CELL - pad * 2, 4);
    ctx.fill();
    ctx.stroke();

    // Nombre (truncado)
    ctx.fillStyle = col.texto;
    ctx.font = `bold ${hab.id === 'hall' ? 9 : 7.5}px Georgia`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const nombre = hab.nombre.length > 12 ? hab.nombre.slice(0, 11) + '…' : hab.nombre;
    ctx.fillText(nombre, cx + CELL / 2, cy + CELL / 2 - 6);

    // Número de puertas
    ctx.font = '8px Georgia';
    ctx.fillStyle = col.borde;
    ctx.fillText(`${hab.puertas}🚪`, cx + CELL / 2, cy + CELL / 2 + 8);

    // Indicador bloqueada
    if (hab.bloqueada) {
      ctx.fillStyle = '#ff4444';
      ctx.font = '10px sans-serif';
      ctx.fillText('🔒', cx + CELL - 14, cy + 14);
    }
  },

  // ── INVENTARIO ────────────────────────────────────────────────────────

  renderInventario() {
    // Tesoros
    const tesorosEl = document.getElementById('lista-tesoros');
    if (tesorosEl) {
      tesorosEl.innerHTML = '';
      if (State.tesoros.length === 0) {
        tesorosEl.innerHTML = '<div class="empty-slot">Sin tesoros</div>';
      } else {
        State.tesoros.forEach(t => {
          const div = document.createElement('div');
          div.className = 'carta-tesoro';
          div.innerHTML = `<span class="carta-nombre">${t.nombre}</span><span class="carta-desc">${t.descripcion}</span>`;
          div.addEventListener('click', () => this._onClickTesoro(t));
          tesorosEl.appendChild(div);
        });
      }
    }

    // Reserva
    const reservaEl = document.getElementById('lista-reserva');
    if (reservaEl) {
      reservaEl.innerHTML = '';
      if (State.reserva.length === 0) {
        reservaEl.innerHTML = '<div class="empty-slot">Reserva vacía</div>';
      } else {
        State.reserva.forEach((h, i) => {
          const div = document.createElement('div');
          div.className = 'carta-reserva';
          div.innerHTML = `<span class="carta-nombre">${h.nombre}</span><span class="carta-puertas">${h.puertas}🚪</span>`;
          div.addEventListener('click', () => {
            const carta = Engine.usarDeReserva(i);
            if (carta) {
              Game.cartaActual = carta;
              Game.segundaCarta = true;
              this.mostrarCartaRobada(carta);
            }
          });
          reservaEl.appendChild(div);
        });
      }
    }
  },

  // ── ACCIONES ──────────────────────────────────────────────────────────

  renderAcciones() {
    const zona = document.getElementById('zona-acciones');
    if (!zona) return;
    zona.innerHTML = '';

    if (State.partidaTerminada) return;

    const fase = State.faseActual;

    if (fase === 'explorar') {
      this._boton(zona, '🚪 Explorar habitación', 'btn-primary', () => Game.explorar());
      if (State.reserva.length > 0 && !State.reservaBloqueada) {
        this._boton(zona, `📦 Usar reserva (${State.reserva.length})`, 'btn-secondary', () => Game.usarReserva());
      }
      if (State.salidaDisponible) {
        this._boton(zona, '🚗 USAR SALIDA — ¡ESCAPAR!', 'btn-victoria', () => Effects.usarSalida());
      }
      if (!State.accionEsconditeUsada) {
        this._boton(zona, '🙈 Escondite (−2 Det, +2 Ruido, +1 Dist)', 'btn-especial', () => Effects.accionEscondite());
      }
    }

    if (fase === 'colocar') {
      this._boton(zona, '✅ Colocar habitación', 'btn-primary', () => Game.confirmarColocar());
      if (!State.reservaBloqueada && State.reserva.length < 2) {
        this._boton(zona, '📥 Guardar en reserva', 'btn-secondary', () => Game.guardarEnReserva());
      }
      if (!State.descartadoEsteTurno) {
        this._boton(zona, '🗑️ Descartar (+2 Ruido)', 'btn-danger', () => Game.descartar());
      }
    }

    UI.renderAll();
  },

  _boton(padre, texto, cls, onClick) {
    const btn = document.createElement('button');
    btn.className = `btn ${cls}`;
    btn.textContent = texto;
    btn.addEventListener('click', onClick);
    padre.appendChild(btn);
  },

  // ── CARTA ROBADA ──────────────────────────────────────────────────────

  mostrarCartaRobada(carta) {
    const panel = document.getElementById('panel-carta');
    if (!panel) return;
    const iconos = { tesoro: '💰', amenaza: '⚔️', pista: '🔑', descubrimiento: '🔍', vacia: '🫥', mixta: '⚡', inicio: '🏰' };
    panel.innerHTML = `
      <div class="carta-robada tipo-${carta.tipo}">
        <div class="carta-icono">${iconos[carta.tipo] || '?'}</div>
        <div class="carta-titulo">${carta.nombre}</div>
        <div class="carta-puertas">${carta.puertas} puerta${carta.puertas > 1 ? 's' : ''}</div>
        <div class="carta-desc-panel">${carta.descripcion}</div>
      </div>
    `;
    panel.classList.add('visible');
    State.faseActual = 'colocar';
    this.renderAcciones();
  },

  ocultarCartaRobada() {
    const panel = document.getElementById('panel-carta');
    if (panel) panel.classList.remove('visible');
  },

  // ── LOG ───────────────────────────────────────────────────────────────

  renderLog() {
    const logEl = document.getElementById('log-contenido');
    if (!logEl) return;
    logEl.innerHTML = '';
    State.log.slice(0, 30).forEach(entrada => {
      const div = document.createElement('div');
      div.className = `log-entrada log-${entrada.tipo}`;
      div.textContent = entrada.mensaje;
      logEl.appendChild(div);
    });
  },

  // ── FIN DE PARTIDA ────────────────────────────────────────────────────

  mostrarFin() {
    const overlay = document.getElementById('overlay-fin');
    if (!overlay) return;
    const titulo = document.getElementById('fin-titulo');
    const subtitulo = document.getElementById('fin-subtitulo');
    if (State.resultado === 'victoria') {
      titulo.textContent = '¡Has escapado!';
      titulo.className = 'fin-titulo victoria';
      subtitulo.textContent = 'Conectaste la Puerta de Carruajes y huiste del castillo.';
    } else {
      titulo.textContent = 'El castillo te venció';
      titulo.className = 'fin-titulo derrota';
      subtitulo.textContent = State.razonDerrota || 'La oscuridad te engulló.';
    }
    overlay.classList.add('visible');
  },

  // ── MODALES ───────────────────────────────────────────────────────────

  pedirEleccion(titulo, opciones, callback) {
    this._mostrarModal({
      titulo,
      tipo: 'eleccion',
      opciones,
      callback
    });
  },

  pedirConfirmacion(mensaje, callback) {
    this._mostrarModal({
      titulo: mensaje,
      tipo: 'confirmar',
      opciones: ['Sí', 'No'],
      callback: (idx) => callback(idx === 0)
    });
  },

  pedirDescartarTesoro(tesoroNuevo) {
    if (State.tesoros.length <= 5) return;
    const opciones = State.tesoros.map(t => t.nombre);
    this._mostrarModal({
      titulo: 'Inventario lleno. ¿Qué Tesoro descartas?',
      tipo: 'eleccion',
      opciones,
      callback: (idx) => {
        Effects.descartarTesoro(State.tesoros[idx].uid);
        if (tesoroNuevo) {
          State.tesoros.push(tesoroNuevo);
        }
        UI.renderAll();
      }
    });
  },

  pedirSeleccionTesoro(titulo, callback) {
    if (State.tesoros.length === 0) return;
    const opciones = State.tesoros.map(t => t.nombre);
    this._mostrarModal({
      titulo,
      tipo: 'eleccion',
      opciones,
      callback: (idx) => callback(State.tesoros[idx].uid)
    });
  },

  _mostrarModal(config) {
    const overlay = document.getElementById('modal-overlay');
    const titulo  = document.getElementById('modal-titulo');
    const btns    = document.getElementById('modal-botones');
    if (!overlay) return;

    titulo.textContent = config.titulo;
    btns.innerHTML = '';

    config.opciones.forEach((op, i) => {
      const btn = document.createElement('button');
      btn.className = `btn btn-modal ${i === 0 ? 'btn-primary' : 'btn-secondary'}`;
      btn.textContent = op;
      btn.addEventListener('click', () => {
        overlay.classList.remove('visible');
        if (config.callback) config.callback(i);
        UI.renderAll();
      });
      btns.appendChild(btn);
    });

    overlay.classList.add('visible');
  },

  _onClickTesoro(tesoro) {
    if (tesoro.pasivo) {
      this.pedirEleccion(`${tesoro.nombre}`, [`${tesoro.descripcion}`, 'Cerrar'], () => {});
    } else {
      this.pedirConfirmacion(`¿Usar ${tesoro.nombre}?\n${tesoro.descripcion}`, (si) => {
        if (si) Effects.usarTesoro(tesoro.uid);
        UI.renderAll();
      });
    }
  }
};

// ── GAME CONTROLLER ───────────────────────────────────────────────────────
// Gestiona la carta actual en vuelo

const Game = {
  cartaActual: null,
  segundaCarta: false,  // true = carta robada tras descartar (no puede volver a descartarse)

  explorar() {
    this.cartaActual = Engine.robarHabitacion();
    if (!this.cartaActual) return;
    this.segundaCarta = false;
    UI.mostrarCartaRobada(this.cartaActual);
  },

  usarReserva() {
    if (State.reserva.length === 0) return;
    // Si hay más de una carta en reserva, preguntar cuál
    if (State.reserva.length === 1) {
      this.cartaActual = Engine.usarDeReserva(0);
    } else {
      UI.pedirEleccion('¿Qué habitación usas de la reserva?',
        State.reserva.map(h => `${h.nombre} (${h.puertas}🚪)`),
        (idx) => {
          this.cartaActual = Engine.usarDeReserva(idx);
          this.segundaCarta = true;
          if (this.cartaActual) UI.mostrarCartaRobada(this.cartaActual);
        }
      );
      return;
    }
    this.segundaCarta = true;
    if (this.cartaActual) UI.mostrarCartaRobada(this.cartaActual);
  },

  confirmarColocar() {
    if (!this.cartaActual) return;
    const ok = Engine.colocarHabitacion(this.cartaActual);
    if (!ok) {
      State.addLog('No hay espacio válido para colocar la habitación.', 'peligro');
      return;
    }
    const carta = this.cartaActual;
    this.cartaActual = null;
    this.segundaCarta = false;
    UI.ocultarCartaRobada();
    Engine.finalizarTurno(carta);
  },

  guardarEnReserva() {
    if (!this.cartaActual) return;
    const ok = Engine.guardarEnReserva(this.cartaActual);
    if (!ok) return;
    this.cartaActual = null;
    this.segundaCarta = false;
    UI.ocultarCartaRobada();
    // Tras guardar en reserva, el turno sigue sin resolver habitación
    // → El jugador debe explorar de nuevo o terminar turno
    State.faseActual = 'explorar';
    Engine.finalizarTurno(null);
  },

  descartar() {
    if (!this.cartaActual) return;
    if (this.segundaCarta) {
      State.addLog('Esta carta no puede descartarse (es la segunda robada).', 'peligro');
      return;
    }
    const nueva = Engine.descartarHabitacion(this.cartaActual);
    if (!nueva) return;
    this.cartaActual = nueva;
    this.segundaCarta = true;
    UI.mostrarCartaRobada(nueva);
  }
};
