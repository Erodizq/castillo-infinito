// effects.js — Resolución de efectos de cartas

const Effects = {

  // ── MODIFICADORES BÁSICOS ────────────────────────────────────────────

  ganarRuido(cantidad, origen = '') {
    // Reloj de sol: reduce 1 por uso (máx 3 usos)
    const reloj = State.tesoros.find(t => t.id === 't10');
    if (reloj && State.relojDeSolUsos < 3) {
      cantidad = Math.max(0, cantidad - 1);
      State.relojDeSolUsos++;
      if (State.relojDeSolUsos >= 3) {
        this.descartarTesoro('t10');
        State.addLog('Reloj de sol agotado y descartado.', 'info');
      }
    }
    State.ruido = Math.min(15, State.ruido + cantidad);
    if (origen) State.addLog(`+${cantidad} Ruido (${origen}). Ruido total: ${State.ruido}`, 'ruido');
    this.comprobarEventosDracula();
  },

  perderVida(cantidad, origen = '') {
    // Medallón protector: puede absorber hasta 2 puntos
    // (se activa manualmente por el jugador en la UI)
    State.vida = Math.max(0, State.vida - cantidad);
    if (origen) State.addLog(`−${cantidad} Vida (${origen}). Vida: ${State.vida}`, 'peligro');
    this.comprobarDerrota();
  },

  ganarVida(cantidad) {
    State.vida = Math.min(5, State.vida + cantidad);
    State.addLog(`+${cantidad} Vida. Vida: ${State.vida}`, 'bien');
  },

  perderDeterminacion(cantidad, origen = '') {
    State.determinacion = Math.max(0, State.determinacion - cantidad);
    if (origen) State.addLog(`−${cantidad} Determinación (${origen}). Det: ${State.determinacion}`, 'peligro');
    if (State.determinacion === 0 && !State.enPanico) {
      this.activarPanico();
    }
  },

  ganarDeterminacion(cantidad) {
    State.determinacion = Math.min(5, State.determinacion + cantidad);
    if (State.enPanico && State.determinacion > 0) {
      State.enPanico = false;
      State.addLog('¡Sales del estado de Pánico!', 'bien');
    }
    State.addLog(`+${cantidad} Determinación. Det: ${State.determinacion}`, 'bien');
  },

  reducirRuido(cantidad) {
    State.ruido = Math.max(0, State.ruido - cantidad);
    State.addLog(`−${cantidad} Ruido. Ruido total: ${State.ruido}`, 'bien');
  },

  reducirDistancia(cantidad, origen = '') {
    const extra = State.enPanico ? 1 : 0;
    const total = cantidad + extra;
    State.distanciaDracula = Math.max(0, State.distanciaDracula - total);
    State.addLog(`Drácula se acerca: −${total} Distancia. Distancia: ${State.distanciaDracula}`, 'dracula');
    if (extra > 0) State.addLog('Pánico: Drácula se acercó 1 adicional.', 'peligro');
    this.comprobarDerrota();
  },

  ganarDistancia(cantidad) {
    State.distanciaDracula = Math.min(5, State.distanciaDracula + cantidad);
    State.addLog(`+${cantidad} Distancia de Drácula. Distancia: ${State.distanciaDracula}`, 'bien');
  },

  ganarPista(cantidad = 1) {
    State.pistas += cantidad;
    State.addLog(`¡Pista encontrada! Total: ${State.pistas}/3`, 'pista');
    if (State.pistas >= 3 && !State.salidaDisponible) {
      State.salidaDisponible = true;
      State.addLog('¡Has reunido 3 Pistas! La Salida: Puerta de Carruajes está disponible.', 'victoria');
    }
  },

  // ── PÁNICO ────────────────────────────────────────────────────────────

  activarPanico() {
    State.enPanico = true;
    State.addLog('⚠️ ¡PÁNICO! La Determinación llega a 0. Ganas 2 Ruido inmediatamente.', 'peligro');
    this.ganarRuido(2, 'Pánico');
  },

  // ── TESOROS ───────────────────────────────────────────────────────────

  robarTesoro() {
    const carta = robarDeMazo(State.mazoTesoros);
    if (!carta) { State.addLog('El mazo de Tesoros está vacío.', 'info'); return null; }
    if (State.tesoros.length >= 5) {
      UI.pedirDescartarTesoro(carta);
    } else {
      State.tesoros.push(carta);
      State.addLog(`Tesoro obtenido: ${carta.nombre}`, 'bien');
    }
    return carta;
  },

  descartarTesoro(id) {
    const idx = State.tesoros.findIndex(t => t.id === id || t.uid === id);
    if (idx !== -1) {
      const carta = State.tesoros.splice(idx, 1)[0];
      State.addLog(`Tesoro descartado: ${carta.nombre}`, 'info');
      return carta;
    }
    return null;
  },

  usarTesoro(uid) {
    const tesoro = State.tesoros.find(t => t.uid === uid);
    if (!tesoro) return;
    switch (tesoro.id) {
      case 't08': // Botiquín
        this.ganarVida(2);
        this.descartarTesoro(uid);
        break;
      case 't03': // Llave maestra
        // Abrir puerta bloqueada — se gestiona en UI seleccionando cuál
        this.descartarTesoro(uid);
        State.addLog('Llave maestra usada. Puerta desbloqueada.', 'bien');
        break;
      case 't11': // Medallón protector
        // Se activa reactivamente — handled en UI
        break;
      default:
        State.addLog(`Tesoro ${tesoro.nombre} listo para usar.`, 'info');
    }
  },

  // ── RESOLUCIÓN DE HABITACIONES ────────────────────────────────────────

  resolverHabitacion(carta) {
    State.addLog(`Resolviendo: ${carta.nombre}`, 'info');
    switch (carta.efecto) {
      // 1 puerta
      case 'roba2guarda1':
        this.robarTesoro(); this.robarTesoro();
        this.ganarRuido(1, carta.nombre);
        UI.pedirDescartarTesoro(null); // si tiene >5
        break;
      case 'pista+ruido':
        this.resolverPista();
        this.ganarRuido(1, carta.nombre);
        break;
      case 'reloj':
        UI.pedirEleccion('Torre del Reloj', ['Reducir 2 Ruido', 'Ganar 2 Determinación'], (op) => {
          if (op === 0) this.reducirRuido(2);
          else this.ganarDeterminacion(2);
        });
        break;
      case 'tesoro+vida':
        this.robarTesoro();
        this.ganarVida(1);
        break;
      case 'amenaza+tesoro':
        const sobrevivio = this.resolverAmenaza();
        if (sobrevivio) this.robarTesoro();
        break;
      // Genéricas
      case 'tesoro':       this.robarTesoro(); break;
      case 'tesoro+ruido': this.ganarRuido(1, carta.nombre); this.robarTesoro(); break;
      case 'pista':        this.resolverPista(); break;
      case 'amenaza':      this.resolverAmenaza(); break;
      case 'descubrimiento': this.resolverDescubrimiento(); break;
      case 'det+1':        this.ganarDeterminacion(1); break;
      case 'ruido-1':      this.reducirRuido(1); break;
      case 'amenaza+ruido-1':
        this.resolverAmenaza();
        UI.pedirEleccion('Salón de Baile', ['Reducir 1 Ruido', 'No hacer nada'], (op) => {
          if (op === 0) this.reducirRuido(1);
        });
        break;
      case 'elige_pista_o_desc':
        UI.pedirEleccion('Atrio de las Sombras', ['Roba 1 Pista y gana 2 Ruido', 'Roba 1 Descubrimiento'], (op) => {
          if (op === 0) { this.resolverPista(); this.ganarRuido(2, 'Atrio de las Sombras'); }
          else this.resolverDescubrimiento();
        });
        break;
    }
  },

  // ── PISTAS ────────────────────────────────────────────────────────────

  resolverPista() {
    const carta = robarDeMazo(State.mazoPistas);
    if (!carta) { State.addLog('El mazo de Pistas está vacío.', 'info'); return; }
    State.addLog(`Pista robada: ${carta.nombre} — ${carta.descripcion}`, 'pista');
    switch (carta.efecto) {
      case 'pista_simple':   this.ganarPista(); break;
      case 'pista+ruido-1':  this.ganarPista(); this.reducirRuido(1); break;
      case 'pista+desc':     this.ganarPista(); this.resolverDescubrimiento(); break;
      case 'pista+det2':     this.ganarPista(); this.ganarDeterminacion(2); break;
      case 'pista+ruido+1':  this.ganarPista(); this.ganarRuido(1, carta.nombre); break;
      case 'pista_doble':
        UI.pedirEleccion('Huella en el Polvo',
          State.tesoros.length > 0 ? ['Descartar 1 Tesoro para contar como 2 Pistas', 'Contar solo como 1 Pista'] : ['Contar como 1 Pista (sin Tesoros que descartar)'],
          (op) => {
            if (op === 0 && State.tesoros.length > 0) {
              UI.pedirSeleccionTesoro('Descarta 1 Tesoro para doble Pista', (uid) => {
                this.descartarTesoro(uid);
                this.ganarPista(2);
              });
            } else {
              this.ganarPista(1);
            }
          }
        );
        break;
    }
  },

  // ── AMENAZAS ──────────────────────────────────────────────────────────

  resolverAmenaza(cartaForzada = null) {
    const carta = cartaForzada || robarDeMazo(State.mazoAmenazas);
    if (!carta) { State.addLog('El mazo de Amenazas está vacío.', 'info'); return true; }
    State.addLog(`⚔️ Amenaza: ${carta.nombre} — ${carta.descripcion}`, 'peligro');

    // Comprobar Agua bendita (cancelación total)
    const agua = State.tesoros.find(t => t.id === 't02');
    if (agua) {
      UI.pedirConfirmacion(`¿Usar Agua bendita para cancelar ${carta.nombre}?`, (si) => {
        if (si) {
          this.descartarTesoro(agua.uid);
          State.addLog('Agua bendita usada. Amenaza cancelada.', 'bien');
        } else {
          this._aplicarAmenaza(carta);
        }
        UI.renderAll();
      });
      return true; // async, se resuelve en callback
    }

    // Símbolo protector (descubrimiento guardado como flag)
    if (State.simboloProtectorActivo) {
      State.simboloProtectorActivo = false;
      const recuperaDist = ['a06', 'a07'].includes(carta.id);
      if (recuperaDist) this.ganarDistancia(1);
      State.addLog(`Símbolo protector: ${carta.nombre} ignorada.${recuperaDist ? ' +1 Distancia.' : ''}`, 'bien');
      return true;
    }

    return this._aplicarAmenaza(carta);
  },

  _aplicarAmenaza(carta) {
    // Daga de plata vs Vampiro menor
    if (carta.id === 'a01') {
      const daga = State.tesoros.find(t => t.id === 't01');
      if (daga) {
        UI.pedirConfirmacion('¿Usar Daga de plata contra el Vampiro menor?', (si) => {
          if (si) {
            this.descartarTesoro(daga.uid);
            State.addLog('Daga de plata: Vampiro menor derrotado sin daño.', 'bien');
          } else {
            this.perderVida(1, 'Vampiro menor');
          }
          UI.renderAll();
        });
        return true;
      }
    }

    // Antorcha vs Trampas
    if (['a04'].includes(carta.id)) {
      const antorcha = State.tesoros.find(t => t.id === 't06');
      if (antorcha) {
        UI.pedirConfirmacion('¿Usar Antorcha para cancelar la Trampa de cadenas?', (si) => {
          if (si) {
            this.descartarTesoro(antorcha.uid);
            State.addLog('Antorcha: Trampa cancelada.', 'bien');
          } else {
            this._efectoAmenaza(carta);
          }
          UI.renderAll();
        });
        return true;
      }
    }

    return this._efectoAmenaza(carta);
  },

  _efectoAmenaza(carta) {
    const enPanico = State.enPanico;
    switch (carta.efecto) {
      case 'vida-1':
        this.perderVida(1, carta.nombre); break;
      case 'det-1':
        this.perderDeterminacion(1, carta.nombre); break;
      case 'ruido+2':
        this.ganarRuido(2, carta.nombre); break;
      case 'vida-1+bloqueareseva':
        this.perderVida(1, carta.nombre);
        State.reservaBloqueada = true;
        State.addLog('No podrás usar la reserva el próximo turno.', 'peligro');
        break;
      case 'ruido+2+det-1':
        this.ganarRuido(2, carta.nombre);
        if (enPanico) this.perderVida(1, 'Sirviente leal (Pánico)');
        else this.perderDeterminacion(1, carta.nombre);
        break;
      case 'ruido+3+dist-1':
        this.ganarRuido(3, carta.nombre);
        this.reducirDistancia(1, carta.nombre);
        break;
      case 'vida-2+dist-1':
        this.perderVida(2, carta.nombre);
        this.reducirDistancia(1, carta.nombre);
        break;
      case 'bloquea_puerta':
        MapEngine.bloquearPuertaReciente();
        if (enPanico) this.ganarRuido(1, 'Cerrojo maldito (Pánico)');
        break;
      case 'vida-1+sintesorovida-1':
        this.perderVida(1, carta.nombre);
        if (State.tesoros.length === 0) this.perderVida(1, 'Trampa de aguja (sin Tesoros)');
        break;
    }
    // Pánico: cada amenaza suma +1 Ruido adicional
    if (enPanico) {
      this.ganarRuido(1, 'Pánico (bonificador por Amenaza)');
    }
    return !State.partidaTerminada;
  },

  // ── DESCUBRIMIENTOS ───────────────────────────────────────────────────

  resolverDescubrimiento() {
    const carta = robarDeMazo(State.mazoDescubrimientos);
    if (!carta) { State.addLog('El mazo de Descubrimientos está vacío.', 'info'); return; }
    State.addLog(`🔍 Descubrimiento: ${carta.nombre} — ${carta.descripcion}`, 'descubrimiento');
    switch (carta.efecto) {
      case 'pasaje':       State.addLog('Pasaje secreto: conecta dos puertas en el mapa.', 'info'); break;
      case 'ver_amenazas': State.addLog('Diario del prisionero: puedes reordenar las 2 primeras Amenazas.', 'info'); this._reordenarMazo(State.mazoAmenazas, 2); break;
      case 'tesoro':       this.robarTesoro(); break;
      case 'ruido-2':      this.reducirRuido(2); break;
      case 'ver_castillo': State.addLog('Voz en la niebla: puedes reordenar las 3 primeras habitaciones.', 'info'); this._reordenarMazo(State.mazoCastillo, 3); break;
      case 'mover_hab':    State.addLog('Mapa parcial: selecciona una habitación para moverla.', 'info'); break;
      case 'ruido+1':      this.ganarRuido(1, carta.nombre); break;
      case 'det+2':        this.ganarDeterminacion(2); break;
      case 'cancelar_amenaza':
        State.simboloProtectorActivo = true;
        State.addLog('Símbolo protector activo: cancelará la próxima Amenaza.', 'bien');
        break;
    }
  },

  _reordenarMazo(mazo, n) {
    // En la alpha simplemente se barajan esas cartas (el jugador no puede ver el mazo)
    const top = mazo.splice(0, n);
    const barajadas = barajar(top);
    mazo.unshift(...barajadas);
    State.addLog(`Reordenadas ${n} cartas del mazo.`, 'info');
  },

  // ── EVENTOS DE DRÁCULA ────────────────────────────────────────────────

  resolverEventoDracula() {
    const carta = robarDeMazo(State.mazoEventosDracula);
    if (!carta) {
      // Si se acaban, volver a barajar
      State.mazoEventosDracula = barajar([...EVENTOS_DRACULA]);
      return this.resolverEventoDracula();
    }

    // Espejo de bolsillo
    const espejo = State.tesoros.find(t => t.id === 't07');
    if (espejo) {
      UI.pedirConfirmacion(`¿Usar Espejo de bolsillo para cancelar "${carta.nombre}"?`, (si) => {
        if (si) {
          this.descartarTesoro(espejo.uid);
          State.addLog('Espejo de bolsillo: Evento de Drácula cancelado.', 'bien');
        } else {
          this._aplicarEventoDracula(carta);
        }
        UI.renderAll();
      });
      return;
    }

    this._aplicarEventoDracula(carta);
  },

  _aplicarEventoDracula(carta) {
    State.addLog(`🧛 EVENTO DE DRÁCULA: ${carta.nombre}`, 'dracula');
    const enPanico = State.enPanico;
    switch (carta.efecto) {
      case 'bloquea_puerta_reciente+dist-1':
        MapEngine.bloquearPuertaReciente();
        this.reducirDistancia(1, carta.nombre);
        break;
      case 'vida-2+dist-1':
        this.perderVida(2, carta.nombre);
        this.reducirDistancia(1, carta.nombre);
        break;
      case 'ruido+2+vida-1+dist-1':
        this.ganarRuido(enPanico ? 3 : 2, carta.nombre);
        this.perderVida(1, carta.nombre);
        this.reducirDistancia(1, carta.nombre);
        break;
      case 'descarta_tesoro_o_det-2':
        if (State.tesoros.length > 0) {
          UI.pedirSeleccionTesoro('Voz del maestro: descarta 1 Tesoro', (uid) => {
            this.descartarTesoro(uid);
            if (enPanico) this.perderVida(1, 'Voz del maestro (Pánico)');
            UI.renderAll();
          });
        } else {
          this.perderDeterminacion(2, carta.nombre);
          if (enPanico) this.perderVida(1, 'Voz del maestro (Pánico)');
        }
        break;
      case 'amenaza_extra+dist-1':
        const numAmenazas = enPanico ? 2 : 1;
        for (let i = 0; i < numAmenazas; i++) this.resolverAmenaza();
        this.reducirDistancia(1, carta.nombre);
        break;
      case 'vida-1+ruido+2+dist-2':
        this.perderVida(1, carta.nombre);
        this.ganarRuido(2, carta.nombre);
        this.reducirDistancia(2, carta.nombre);
        const umbral = enPanico ? 10 : 14;
        if (State.ruido >= umbral) {
          this.perderVida(2, 'Aparición (umbral de Ruido)');
        }
        break;
    }
  },

  // ── COMPROBACIONES ────────────────────────────────────────────────────

  comprobarEventosDracula() {
    const umbrales = [5, 10, 15];
    for (const u of umbrales) {
      if (State.ruido >= u && !State[`eventoDisparado_${u}`]) {
        State[`eventoDisparado_${u}`] = true;
        State.addLog(`Ruido alcanza ${u}. ¡Evento de Drácula!`, 'dracula');
        this.resolverEventoDracula();
      }
    }
  },

  comprobarDerrota() {
    if (State.partidaTerminada) return;
    if (State.vida <= 0) {
      State.partidaTerminada = true;
      State.resultado = 'derrota';
      State.razonDerrota = 'Tu Vida llegó a 0.';
      UI.mostrarFin();
    } else if (State.distanciaDracula <= 0) {
      State.partidaTerminada = true;
      State.resultado = 'derrota';
      State.razonDerrota = 'Drácula te alcanzó.';
      UI.mostrarFin();
    }
  },

  comprobarPuertasAgotadas() {
    if (!MapEngine.hayPuertasAbiertas() && !State.salidaDisponible) {
      State.partidaTerminada = true;
      State.resultado = 'derrota';
      State.razonDerrota = 'No quedan puertas abiertas. El castillo te atrapó.';
      UI.mostrarFin();
    }
  },

  // ── ACCIÓN ESPECIAL: ESCONDITE ────────────────────────────────────────

  accionEscondite() {
    if (State.accionEsconditeUsada) {
      State.addLog('Ya usaste la acción de Escondite esta partida.', 'info');
      return;
    }
    if (State.determinacion < 2) {
      State.addLog('No tienes suficiente Determinación para el Escondite (necesitas 2).', 'peligro');
      return;
    }
    State.determinacion -= 2;
    this.ganarRuido(2, 'Escondite');
    this.ganarDistancia(1);
    State.accionEsconditeUsada = true;
    State.addLog('Acción de Escondite usada. −2 Determinación, +2 Ruido, +1 Distancia de Drácula.', 'info');
  },

  // ── SALIDA ────────────────────────────────────────────────────────────

  usarSalida() {
    if (!State.salidaDisponible) {
      State.addLog('No tienes las 3 Pistas todavía.', 'peligro');
      return;
    }
    if (!MapEngine.hayPuertasAbiertas()) {
      State.addLog('No hay puertas abiertas para conectar la Salida.', 'peligro');
      return;
    }
    State.partidaTerminada = true;
    State.resultado = 'victoria';
    UI.mostrarFin();
  }
};
