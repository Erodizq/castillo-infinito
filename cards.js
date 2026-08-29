// cards.js — Definición de todos los mazos

// ── MAZO DE CASTILLO ─────────────────────────────────────────────────────
const HABITACIONES = [
  // 1 puerta (5 cartas)
  { id: 'c01', nombre: 'Cripta Sellada',         puertas: 1, tipo: 'tesoro',        efecto: 'roba2guarda1',  descripcion: 'Roba 2 Tesoros, conserva 1. Gana 1 Ruido.' },
  { id: 'c02', nombre: 'Archivo Prohibido',      puertas: 1, tipo: 'pista',         efecto: 'pista+ruido',   descripcion: 'Obtienes 1 Pista. Gana 1 Ruido.' },
  { id: 'c03', nombre: 'Torre del Reloj',        puertas: 1, tipo: 'descubrimiento',efecto: 'reloj',         descripcion: 'Reduce 2 Ruido o gana 2 Determinación.' },
  { id: 'c04', nombre: 'Mausoleo Familiar',      puertas: 1, tipo: 'tesoro',        efecto: 'tesoro+vida',   descripcion: 'Roba 1 Tesoro y recupera 1 Vida.' },
  { id: 'c05', nombre: 'Cámara del Ataúd Vacío', puertas: 1, tipo: 'amenaza',       efecto: 'amenaza+tesoro',descripcion: 'Roba 1 Amenaza. Si sobrevives, roba 1 Tesoro.' },

  // 2 puertas (10 cartas)
  { id: 'c06', nombre: 'Galería de Retratos',    puertas: 2, tipo: 'amenaza',       efecto: 'amenaza',       descripcion: 'Roba 1 Amenaza.' },
  { id: 'c07', nombre: 'Cocina de los Sirvientes',puertas:2, tipo: 'tesoro',        efecto: 'tesoro',        descripcion: 'Roba 1 Tesoro.' },
  { id: 'c08', nombre: 'Capilla Profanada',      puertas: 2, tipo: 'pista',         efecto: 'pista',         descripcion: 'Roba 1 Pista.' },
  { id: 'c09', nombre: 'Dormitorio Vacío',       puertas: 2, tipo: 'vacia',         efecto: 'det+1',         descripcion: 'Recupera 1 Determinación.' },
  { id: 'c10', nombre: 'Sala de Costura',        puertas: 2, tipo: 'tesoro',        efecto: 'tesoro',        descripcion: 'Roba 1 Tesoro.' },
  { id: 'c11', nombre: 'Cuarto de Juegos',       puertas: 2, tipo: 'descubrimiento',efecto: 'descubrimiento',descripcion: 'Roba 1 Descubrimiento.' },
  { id: 'c12', nombre: 'Baño de Mármol',         puertas: 2, tipo: 'amenaza',       efecto: 'amenaza',       descripcion: 'Roba 1 Amenaza.' },
  { id: 'c13', nombre: 'Despensa Olvidada',      puertas: 2, tipo: 'tesoro',        efecto: 'tesoro',        descripcion: 'Roba 1 Tesoro.' },
  { id: 'c14', nombre: 'Sala de Música',         puertas: 2, tipo: 'descubrimiento',efecto: 'descubrimiento',descripcion: 'Roba 1 Descubrimiento.' },
  { id: 'c15', nombre: 'Prisión Subterránea',    puertas: 2, tipo: 'pista',         efecto: 'pista+ruido',   descripcion: 'Roba 1 Pista. Aumenta 1 Ruido.' },

  // 3 puertas (10 cartas)
  { id: 'c16', nombre: 'Biblioteca Polvorienta', puertas: 3, tipo: 'tesoro',        efecto: 'tesoro',        descripcion: 'Roba 1 Tesoro.' },
  { id: 'c17', nombre: 'Invernadero Marchito',   puertas: 3, tipo: 'descubrimiento',efecto: 'descubrimiento',descripcion: 'Roba 1 Descubrimiento.' },
  { id: 'c18', nombre: 'Corredor de las Gárgolas',puertas:3, tipo: 'amenaza',       efecto: 'amenaza',       descripcion: 'Roba 1 Amenaza.' },
  { id: 'c19', nombre: 'Comedor Principal',      puertas: 3, tipo: 'tesoro',        efecto: 'tesoro',        descripcion: 'Roba 1 Tesoro.' },
  { id: 'c20', nombre: 'Salón de los Espejos',   puertas: 3, tipo: 'descubrimiento',efecto: 'descubrimiento',descripcion: 'Roba 1 Descubrimiento.' },
  { id: 'c21', nombre: 'Armería Abandonada',     puertas: 3, tipo: 'tesoro',        efecto: 'tesoro',        descripcion: 'Roba 1 Tesoro.' },
  { id: 'c22', nombre: 'Cuarto de los Criados',  puertas: 3, tipo: 'vacia',         efecto: 'ruido-1',       descripcion: 'Reduce 1 Ruido.' },
  { id: 'c23', nombre: 'Sala de Trofeos',        puertas: 3, tipo: 'amenaza',       efecto: 'amenaza',       descripcion: 'Roba 1 Amenaza.' },
  { id: 'c24', nombre: 'Observatorio',           puertas: 3, tipo: 'pista',         efecto: 'pista',         descripcion: 'Roba 1 Pista.' },
  { id: 'c25', nombre: 'Laboratorio Alquímico',  puertas: 3, tipo: 'tesoro',        efecto: 'tesoro',        descripcion: 'Roba 1 Tesoro.' },

  // 4 puertas (5 cartas)
  { id: 'c26', nombre: 'Salón de Baile',         puertas: 4, tipo: 'amenaza',       efecto: 'amenaza+ruido-1',descripcion: 'Roba 1 Amenaza. Después puedes reducir 1 Ruido.' },
  { id: 'c27', nombre: 'Escalera Principal',     puertas: 4, tipo: 'descubrimiento',efecto: 'descubrimiento',descripcion: 'Roba 1 Descubrimiento.' },
  { id: 'c28', nombre: 'Vestíbulo Occidental',   puertas: 4, tipo: 'tesoro',        efecto: 'tesoro+ruido',  descripcion: 'Gana 1 Ruido y roba 1 Tesoro.' },
  { id: 'c29', nombre: 'Galería Central',        puertas: 4, tipo: 'amenaza',       efecto: 'amenaza',       descripcion: 'Roba 1 Amenaza.' },
  { id: 'c30', nombre: 'Atrio de las Sombras',   puertas: 4, tipo: 'mixta',         efecto: 'elige_pista_o_desc',descripcion: 'Elige: roba 1 Pista y gana 2 Ruido, o roba 1 Descubrimiento.' },
];

// ── MAZO DE PISTAS (10 cartas) ────────────────────────────────────────────
const PISTAS = [
  { id: 'p01', nombre: 'Marca de Carruaje',       copias: 3, efecto: 'pista_simple',     descripcion: 'Pista básica. Sin efecto adicional.' },
  { id: 'p02', nombre: 'Herradura Oxidada',        copias: 2, efecto: 'pista+ruido-1',    descripcion: 'Reduce 1 Ruido al encontrarla.' },
  { id: 'p03', nombre: 'Bitácora del Cochero',     copias: 2, efecto: 'pista+desc',       descripcion: 'Roba 1 Descubrimiento además.' },
  { id: 'p04', nombre: 'Clave Grabada en Piedra',  copias: 1, efecto: 'pista+det2',       descripcion: 'Gana 2 Determinación además.' },
  { id: 'p05', nombre: 'Fragmento del Sello',      copias: 1, efecto: 'pista+ruido+1',    descripcion: 'Gana 1 Ruido al encontrarla.' },
  { id: 'p06', nombre: 'Huella en el Polvo',       copias: 1, efecto: 'pista_doble',      descripcion: 'Descarta 1 Tesoro para que cuente como 2 Pistas.' },
];

// ── MAZO DE AMENAZAS (15 cartas) ─────────────────────────────────────────
const AMENAZAS = [
  { id: 'a01', nombre: 'Vampiro menor',            copias: 3, efecto: 'vida-1',            descripcion: 'Pierde 1 Vida. (Daga de plata lo derrota sin efecto.)' },
  { id: 'a02', nombre: 'Rata de cripta',           copias: 2, efecto: 'det-1',             descripcion: 'Pierde 1 Determinación.' },
  { id: 'a03', nombre: 'Ilusión del pasillo',      copias: 2, efecto: 'ruido+2',           descripcion: 'Gana 2 Ruido.' },
  { id: 'a04', nombre: 'Trampa de cadenas',        copias: 2, efecto: 'vida-1+bloqueareseva',descripcion: 'Pierde 1 Vida. No puedes usar la reserva el próximo turno. (Antorcha la cancela.)' },
  { id: 'a05', nombre: 'Sirviente leal',           copias: 2, efecto: 'ruido+2+det-1',     descripcion: 'Gana 2 Ruido y pierde 1 Determinación. En Pánico: pierde 1 Vida en lugar de Determinación.' },
  { id: 'a06', nombre: 'Presencia en las paredes', copias: 1, efecto: 'ruido+3+dist-1',    descripcion: 'Gana 3 Ruido y reduce 1 Distancia de Drácula.' },
  { id: 'a07', nombre: 'Sombra perseguidora',      copias: 1, efecto: 'vida-2+dist-1',     descripcion: 'Pierde 2 Vida y reduce 1 Distancia de Drácula.' },
  { id: 'a08', nombre: 'Cerrojo maldito',          copias: 1, efecto: 'bloquea_puerta',    descripcion: 'Bloquea una puerta abierta. Cuesta 1 Determinación abrirla. En Pánico: gana además 1 Ruido.' },
  { id: 'a09', nombre: 'Trampa de aguja',          copias: 1, efecto: 'vida-1+sintesorovida-1',descripcion: 'Pierde 1 Vida. Sin Tesoros: pierde 1 Vida adicional.' },
];

// ── MAZO DE DESCUBRIMIENTOS (12 cartas) ───────────────────────────────────
const DESCUBRIMIENTOS = [
  { id: 'd01', nombre: 'Pasaje secreto',           copias: 2, efecto: 'pasaje',            descripcion: 'Conecta dos puertas abiertas adyacentes. Ambas dejan de estar abiertas.' },
  { id: 'd02', nombre: 'Diario de un prisionero',  copias: 2, efecto: 'ver_amenazas',      descripcion: 'Mira las 2 primeras Amenazas del mazo y reordénalas.' },
  { id: 'd03', nombre: 'Bóveda olvidada',          copias: 2, efecto: 'tesoro',            descripcion: 'Roba 1 Tesoro.' },
  { id: 'd04', nombre: 'Inscripción en la pared',  copias: 1, efecto: 'ruido-2',           descripcion: 'Reduce 2 Ruido.' },
  { id: 'd05', nombre: 'Voz en la niebla',         copias: 1, efecto: 'ver_castillo',      descripcion: 'Mira las 3 primeras cartas del mazo de Castillo y reordénalas.' },
  { id: 'd06', nombre: 'Mapa parcial',             copias: 1, efecto: 'mover_hab',         descripcion: 'Mueve una habitación ya colocada a una posición legal nueva.' },
  { id: 'd07', nombre: 'Hedor a sangre',           copias: 1, efecto: 'ruido+1',           descripcion: 'Sin beneficio. Gana 1 Ruido.' },
  { id: 'd08', nombre: 'Eco del pasado',           copias: 1, efecto: 'det+2',             descripcion: 'Recupera 2 Determinación.' },
  { id: 'd09', nombre: 'Símbolo protector',        copias: 1, efecto: 'cancelar_amenaza',  descripcion: 'Descártalo para ignorar la siguiente Amenaza. Si era Presencia/Sombra, recupera +1 Distancia.' },
];

// ── MAZO DE TESOROS (15 cartas) ───────────────────────────────────────────
const TESOROS = [
  { id: 't01', nombre: 'Daga de plata',     copias: 2, efecto: 'contra_vampiro',   descripcion: 'Al robar Vampiro menor, descarta para derrotarlo sin su efecto.', pasivo: true },
  { id: 't02', nombre: 'Agua bendita',      copias: 2, efecto: 'cancelar_amenaza_total', descripcion: 'Tras robar una Amenaza, descarta para cancelar todos sus efectos.', pasivo: false },
  { id: 't03', nombre: 'Llave maestra',     copias: 1, efecto: 'abrir_puerta',     descripcion: 'Descarta para abrir una puerta bloqueada.', pasivo: false },
  { id: 't04', nombre: 'Mapa incompleto',   copias: 1, efecto: 'ver_castillo_3',   descripcion: 'Antes de robar una habitación, mira las 3 primeras del mazo y reordénalas.', pasivo: false },
  { id: 't05', nombre: 'Hilo de Ariadna',   copias: 1, efecto: 'conectar_puertas', descripcion: 'Conecta por pasadizo dos puertas abiertas. Ambas dejan de ser abiertas.', pasivo: false },
  { id: 't06', nombre: 'Antorcha',          copias: 1, efecto: 'cancelar_trampa',  descripcion: 'Cancela una Trampa, o reduce 2 Ruido justo tras aumentar.', pasivo: false },
  { id: 't07', nombre: 'Espejo de bolsillo',copias: 1, efecto: 'cancelar_dracula', descripcion: 'Al robar un Evento de Drácula, descarta para cancelarlo.', pasivo: true },
  { id: 't08', nombre: 'Botiquín de viaje', copias: 1, efecto: 'vida+2',           descripcion: 'Recupera 2 Vida (máximo 5).', pasivo: false },
  { id: 't09', nombre: 'Ganzúas',           copias: 1, efecto: 'abrir_puerta_temp',descripcion: 'Trata una puerta bloqueada como abierta este turno. Si conectas ahí, queda abierta permanentemente.', pasivo: false },
  { id: 't10', nombre: 'Reloj de sol',      copias: 1, efecto: 'reducir_ruido_pasivo', descripcion: 'Una vez por turno reduce en 1 el Ruido que fueras a ganar. Descártalo tras 3 usos.', pasivo: true },
  { id: 't11', nombre: 'Medallón protector',copias: 1, efecto: 'absorber_daño',    descripcion: 'Descarta cuando fueras a perder Vida o Determinación para evitar hasta 2 puntos.', pasivo: false },
  { id: 't12', nombre: 'Polvo de hueso',    copias: 1, efecto: 'bonus_1puerta',    descripcion: 'Antes de resolver una habitación de 1 puerta, descarta para recibir además 1 Tesoro o recuperar 1 Determinación.', pasivo: false },
];

// ── MAZO DE EVENTOS DE DRÁCULA (6 cartas) ────────────────────────────────
const EVENTOS_DRACULA = [
  { id: 'e01', nombre: 'Presencia en el umbral', efecto: 'bloquea_puerta_reciente+dist-1', descripcion: 'Bloquea la puerta más reciente usada permanentemente. −1 Distancia.' },
  { id: 'e02', nombre: 'Paso entre sombras',     efecto: 'vida-2+dist-1',                  descripcion: 'Pierde 2 Vida. −1 Distancia.' },
  { id: 'e03', nombre: 'El castillo respira',    efecto: 'ruido+2+vida-1+dist-1',           descripcion: 'Gana 2 Ruido (3 en Pánico) y pierde 1 Vida. −1 Distancia.' },
  { id: 'e04', nombre: 'Voz del maestro',        efecto: 'descarta_tesoro_o_det-2',         descripcion: 'Descarta 1 Tesoro. Sin Tesoros: pierde 2 Determinación. En Pánico: pierde además 1 Vida.' },
  { id: 'e05', nombre: 'Cacería silenciosa',     efecto: 'amenaza_extra+dist-1',            descripcion: 'Roba 1 Amenaza extra (2 en Pánico) sin Ruido adicional. −1 Distancia.' },
  { id: 'e06', nombre: 'Aparición',              efecto: 'vida-1+ruido+2+dist-2',           descripcion: 'Pierde 1 Vida y gana 2 Ruido. Si Ruido ≥ 14 (o ≥ 10 en Pánico): pierde 2 Vida extra. −2 Distancia.' },
];

// ── HALL INICIAL ──────────────────────────────────────────────────────────
const HALL = { id: 'hall', nombre: 'Hall', puertas: 4, tipo: 'inicio', efecto: null, descripcion: 'Punto de partida. 4 puertas.' };

// ── HELPERS ───────────────────────────────────────────────────────────────
function expandirCopias(array) {
  const resultado = [];
  array.forEach(carta => {
    const copias = carta.copias || 1;
    for (let i = 0; i < copias; i++) {
      resultado.push({ ...carta, uid: carta.id + '_' + i });
    }
  });
  return resultado;
}

function barajar(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function inicializarMazos() {
  State.mazoCastillo        = barajar([...HABITACIONES]);
  State.mazoTesoros         = barajar(expandirCopias(TESOROS));
  State.mazoAmenazas        = barajar(expandirCopias(AMENAZAS));
  State.mazoPistas          = barajar(expandirCopias(PISTAS));
  State.mazoDescubrimientos = barajar(expandirCopias(DESCUBRIMIENTOS));
  State.mazoEventosDracula  = barajar([...EVENTOS_DRACULA]);
}

function robarDeMazo(mazo) {
  if (mazo.length === 0) return null;
  return mazo.shift();
}
