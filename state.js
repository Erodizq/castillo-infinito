// state.js — Fuente de verdad de la partida

const State = {
  // Recursos del jugador
  vida: 5,
  determinacion: 3,
  ruido: 0,
  distanciaDracula: 5,
  pistas: 0,
  enPanico: false,
  salidaDisponible: false,

  // Inventario
  tesoros: [],        // cartas de tesoro activas
  reserva: [],        // habitaciones guardadas (máx 2)

  // Mapa
  habitacionesColocadas: [],  // { id, x, y, puertas, tipo, nombre }
  puertasAbiertas: [],        // { x, y, direccion }

  // Mazos (se inicializan en cards.js y se barajan)
  mazoCastillo: [],
  mazoTesoros: [],
  mazoAmenazas: [],
  mazoPistas: [],
  mazoDescubrimientos: [],
  mazoEventosDracula: [],
  pilaDescarte: [],

  // Control de turno
  turno: 1,
  faseActual: 'inicio',     // inicio | colocar | resolver | fin
  descartadoEsteTurno: false,
  reservaBloqueda: false,   // por Trampa de cadenas
  accionEsconditeUsada: false,
  relojDeSolUsos: 0,        // para el Tesoro Reloj de sol

  // Log
  log: [],

  // Flags de victoria/derrota
  partidaTerminada: false,
  resultado: null,  // 'victoria' | 'derrota'
  razonDerrota: null,

  reset() {
    this.vida = 5;
    this.determinacion = 3;
    this.ruido = 0;
    this.distanciaDracula = 5;
    this.pistas = 0;
    this.enPanico = false;
    this.salidaDisponible = false;
    this.tesoros = [];
    this.reserva = [];
    this.habitacionesColocadas = [];
    this.puertasAbiertas = [];
    this.mazoCastillo = [];
    this.mazoTesoros = [];
    this.mazoAmenazas = [];
    this.mazoPistas = [];
    this.mazoDescubrimientos = [];
    this.mazoEventosDracula = [];
    this.pilaDescarte = [];
    this.turno = 1;
    this.faseActual = 'inicio';
    this.descartadoEsteTurno = false;
    this.reservaBloqueada = false;
    this.accionEsconditeUsada = false;
    this.relojDeSolUsos = 0;
    this.log = [];
    this.partidaTerminada = false;
    this.resultado = null;
    this.razonDerrota = null;
  },

  addLog(mensaje, tipo = 'normal') {
    this.log.unshift({ mensaje, tipo, turno: this.turno });
    if (this.log.length > 50) this.log.pop();
  }
};
