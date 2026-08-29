# 🏰 El Castillo Infinito de Drácula

**Juego de cartas en solitario — Alpha 0.1**

Un dungeon-crawler de un solo jugador ambientado en el castillo de Drácula. Explora habitaciones, recoge pistas, gestiona tus recursos y escapa antes de que Drácula te alcance.

---

## 🎮 Jugar ahora

👉 **[Abrir el juego](https://erodizq.github.io/castillo-infinito)**

No requiere instalación. Funciona en móvil y escritorio.

---

## 📖 Objetivo

Encuentra **3 Pistas de la Llave de Carruaje**. Cuando las tengas, conecta la **Salida: Puerta de Carruajes** a cualquier puerta abierta del mapa y escapa.

### Pierdes si...
- Tu **Vida** llega a 0 — muerte física.
- No quedan **puertas abiertas** antes de reunir las 3 Pistas — el castillo te atrapa.
- La **Distancia de Drácula** llega a 0 — te alcanza.

---

## 🎲 Recursos del jugador

| Recurso | Inicio | Máx | Descripción |
|---|---|---|---|
| ❤️ Vida | 5 | 5 | Pierde si llega a 0 |
| 🔵 Determinación | 3 | 5 | Fuerza mental. Llegar a 0 activa el Pánico |
| 🔔 Ruido | 0 | 15 | Evento de Drácula al llegar a 5, 10 y 15 |
| 🧛 Distancia Drácula | 5 | 5 | Pierde si llega a 0 |

### Estado de Pánico
Cuando la Determinación llega a 0: +2 Ruido inmediato, cada Amenaza suma +1 Ruido adicional, los Eventos de Drácula se agravan y no puedes usar la reserva.

---

## 🃏 Mazos

| Mazo | Cartas | Descripción |
|---|---|---|
| Castillo | 30 | Habitaciones de 1–4 puertas que construyen el mapa |
| Pistas | 10 | Las 3 que necesitas para escapar, con efectos variables |
| Amenazas | 15 | Siempre negativas. Vampiros, trampas, presencias... |
| Descubrimientos | 12 | Neutrales o beneficiosos |
| Tesoros | 15 | Herramientas y ventajas (máx. 5 en inventario) |
| Eventos de Drácula | 6 | Se disparan al alcanzar 5, 10 y 15 de Ruido |

---

## 📁 Estructura del proyecto

```
castillo-infinito/
├── index.html          — HTML principal
├── css/
│   └── styles.css      — Estilos (diseño gótico oscuro)
└── js/
    ├── state.js        — Estado global de la partida
    ├── cards.js        — Todos los mazos y sus datos
    ├── map.js          — Lógica del mapa y colocación
    ├── effects.js      — Resolución de efectos de cartas
    ├── engine.js       — Motor de turno
    ├── ui.js           — Interfaz y renderizado
    └── main.js         — Punto de entrada
```

---

## 🚀 Desarrollo local

Cualquier servidor HTTP estático sirve. Con Node.js:

```bash
npx serve .
```

O con Python:

```bash
python -m http.server 8080
```

Luego abre `http://localhost:8080` en el navegador.

---

## 🗺️ Estado del desarrollo

- [x] Prototipo de reglas 0.3 — completo
- [x] Alpha web 0.1 — estructura, mazos, motor de turno, mapa en canvas
- [ ] Selección visual de puerta de colocación en el mapa
- [ ] Animaciones de cartas
- [ ] Efectos de descubrimientos interactivos (Mapa parcial, Pasaje secreto)
- [ ] Sonido ambiental
- [ ] Guardado de partida

---

## 📜 Diseño

Diseñado y desarrollado por **Eleazar** ([@Erodizq](https://github.com/Erodizq)).

Prototipo de reglas disponible como documento separado.
