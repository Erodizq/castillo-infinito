// engine.js — Motor de turno y flujo del juego

const Engine = {

  // ── INICIO DE PARTIDA ─────────────────────────────────────────────────

  nuevaPartida() {
    State.reset();
    inicializarMazos();
    MapEngine.inicializarHall();

    // Resetear flags de umbrales de Ruido
    State.eventoDisparado_5  = false;
    State.eventoDisparado_10 = false;
    State.eventoDisparado_15 = false;

    State.simboloProtectorActivo = false;

    State.addLog('🏰 Partida iniciada. Estás en el Hall. El castillo aguarda...', 'inicio');
    State.faseActual = 'explorar';
    UI.renderAll();
  },

  // ── FLUJO DE TURNO ────────────────────────────────────────────────────

  iniciarTurno() {
    if (State.partidaTerminada) return;
    State.descartadoEsteTurno = false;
    State.faseActual = 'explorar';
    State.addLog(`── Turno ${State.turno} ──`, 'turno');
    UI.renderAll();
  },

  // Paso 1-3: El jugador elige qué hacer con la habitación robada
  robarHabitacion() {
    if (State.mazoCastillo.length === 0) {
      State.addLog('El mazo de Castillo está vacío.', 'info');
      return null;
    }
    const carta = robarDeMazo(State.mazoCastillo);
    State.addLog(`Habitación robada: ${carta.nombre} (${carta.puertas} puerta${carta.puertas > 1 ? 's' : ''})`, 'info');
    return carta;
  },

  // Colocar habitación en el mapa
  colocarHabitacion(carta) {
    if (!MapEngine.hayPuertasAbiertas()) {
      Effects.comprobarPuertasAgotadas();
      return false;
    }
    const dirs = MapEngine.asignarDirecciones(carta.puertas);
    const puertas = MapEngine.todasPuertasAbiertas();
    if (puertas.length === 0) return false;

    // Auto-colocar en la primera puerta disponible (alpha: el jugador elige en UI)
    const puerta = puertas[0];
    MapEngine.colocarHabitacion(carta, puerta.x, puerta.y, dirs);
    return true;
  },

  // Guardar en reserva
  guardarEnReserva(carta) {
    if (State.reservaBloqueada) {
      State.addLog('La reserva está bloqueada este turno (Trampa de cadenas).', 'peligro');
      return false;
    }
    if (State.reserva.length >= 2) {
      State.addLog('La reserva está llena (máximo 2 habitaciones).', 'info');
      return false;
    }
    State.reserva.push(carta);
    State.addLog(`Guardado en reserva: ${carta.nombre}`, 'info');
    return true;
  },

  // Descartar habitación (+2 Ruido, roba otra)
  descartarHabitacion(carta) {
    if (State.descartadoEsteTurno) {
      State.addLog('Ya descartaste una habitación este turno.', 'peligro');
      return null;
    }
    State.descartadoEsteTurno = true;
    State.pilaDescarte.push(carta);
    Effects.ganarRuido(2, 'descarte de habitación');
    State.addLog(`Descartado: ${carta.nombre}. +2 Ruido. Robando otra habitación...`, 'ruido');
    const nueva = this.robarHabitacion();
    return nueva; // Esta segunda carta debe colocarse o guardarse, no puede descartarse
  },

  // Usar habitación de la reserva
  usarDeReserva(idx) {
    if (State.reservaBloqueada) {
      State.addLog('La reserva está bloqueada este turno.', 'peligro');
      return null;
    }
    if (idx < 0 || idx >= State.reserva.length) return null;
    const carta = State.reserva.splice(idx, 1)[0];
    State.addLog(`Usada de la reserva: ${carta.nombre}`, 'info');
    return carta;
  },

  // Paso 4-6: Resolver contenido + Ruido + posible Evento
  finalizarTurno(cartaColocada) {
    if (State.partidaTerminada) return;

    // Resolver contenido de la habitación
    if (cartaColocada && cartaColocada.efecto) {
      Effects.resolverHabitacion(cartaColocada);
    }

    if (State.partidaTerminada) return;

    // +1 Ruido por turno
    Effects.ganarRuido(1, 'fin de turno');

    if (State.partidaTerminada) return;

    // Comprobar si quedan puertas
    Effects.comprobarPuertasAgotadas();

    if (State.partidaTerminada) return;

    // Limpiar bloqueo de reserva si era de turno anterior
    if (State._limpiarReservaSiguienteTurno) {
      State.reservaBloqueada = false;
      State._limpiarReservaSiguienteTurno = false;
    }
    if (State.reservaBloqueada) {
      State._limpiarReservaSiguienteTurno = true;
    }

    State.turno++;
    this.iniciarTurno();
  }
};
