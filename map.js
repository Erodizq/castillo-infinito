// map.js — Lógica del mapa y colocación

const DIRS = ['norte', 'este', 'sur', 'oeste'];
const OPUESTO = { norte: 'sur', sur: 'norte', este: 'oeste', oeste: 'este' };
const DELTA = { norte: [0, -1], sur: [0, 1], este: [1, 0], oeste: [-1, 0] };

const MapEngine = {

  // Devuelve la celda de una habitación por coordenadas
  getCelda(x, y) {
    return State.habitacionesColocadas.find(h => h.x === x && h.y === y) || null;
  },

  // Puertas abiertas de una habitación (las que dan a celda vacía)
  puertasLibres(hab) {
    const libres = [];
    for (const dir of hab.puertas_dirs) {
      const [dx, dy] = DELTA[dir];
      if (!this.getCelda(hab.x + dx, hab.y + dy)) {
        libres.push({ x: hab.x + dx, y: hab.y + dy, dir, desde: { x: hab.x, y: hab.y } });
      }
    }
    return libres;
  },

  // Todas las puertas abiertas del mapa
  todasPuertasAbiertas() {
    const abiertas = [];
    for (const hab of State.habitacionesColocadas) {
      abiertas.push(...this.puertasLibres(hab));
    }
    return abiertas;
  },

  // Asigna direcciones de puertas aleatorias según el número
  asignarDirecciones(numPuertas) {
    const dirs = barajar([...DIRS]);
    return dirs.slice(0, numPuertas);
  },

  // Coloca una habitación en (x, y) con las direcciones dadas
  colocarHabitacion(carta, x, y, puertas_dirs) {
    const nueva = {
      ...carta,
      x, y,
      puertas_dirs,
      bloqueada: false,
    };
    State.habitacionesColocadas.push(nueva);
    State.addLog(`Explorado: ${carta.nombre} (${carta.puertas} puertas)`, 'info');
    return nueva;
  },

  // Inicializa el Hall en el centro (0,0)
  inicializarHall() {
    const hall = {
      ...HALL,
      x: 0, y: 0,
      puertas_dirs: ['norte', 'sur', 'este', 'oeste'],
      bloqueada: false,
    };
    State.habitacionesColocadas = [hall];
  },

  // ¿Quedan puertas abiertas?
  hayPuertasAbiertas() {
    return this.todasPuertasAbiertas().length > 0;
  },

  // Bloquea la puerta más reciente usada
  bloquearPuertaReciente() {
    // En la implementación alpha bloqueamos marcando la última habitación colocada
    const ultimas = State.habitacionesColocadas;
    if (ultimas.length <= 1) return;
    const ultima = ultimas[ultimas.length - 1];
    ultima.bloqueada = true;
    State.addLog(`Puerta bloqueada en: ${ultima.nombre}`, 'peligro');
  },

  // Para el renderizado: obtiene el bounding box del mapa
  getBounds() {
    if (State.habitacionesColocadas.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    const xs = State.habitacionesColocadas.map(h => h.x);
    const ys = State.habitacionesColocadas.map(h => h.y);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    };
  }
};
