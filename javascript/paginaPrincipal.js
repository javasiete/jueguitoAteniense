const sonidoTurnoJugador = new Audio("./sonidos/turnoJugador.wav");
sonidoTurnoJugador.volume = 0.6;

const sonidoClick = new Audio("./sonidos/click.wav");
const sonidoClickPersonaje = new Audio("./sonidos/clickPersonaje.wav");

// Audios para los Ataques:
function reproducirAudio(ruta) {
    if (!ruta) return;

    const audio = new Audio(ruta);
    audio.volume = 1;
    audio.play().catch(() => {});
}

//---------------------------------------------------------------
function recalcularPosicionesEntidades() {
    document.querySelectorAll(".imgEntidadBatalla").forEach(img => {
        const sprite = img.closest(".spriteEntidad");
        if (!sprite) return;

        const celda = sprite.dataset.celdaId
            ? document.querySelector(`[data-celda-id="${sprite.dataset.celdaId}"]`)
            : sprite.closest(".celdaGuerra");

        if (!celda) return;

        const rect = celda.getBoundingClientRect();
        const tablero = document.getElementById("tableroArmado").getBoundingClientRect();

        const x = rect.left + rect.width / 2 - tablero.left;
        const y = rect.bottom - tablero.top;

        sprite.style.setProperty("--base-x", `${x}px`);
        sprite.style.setProperty("--base-y", `${y}px`);
    });
}

let timeoutResize = null;

window.addEventListener("resize", () => {
    clearTimeout(timeoutResize);

    timeoutResize = setTimeout(() => {
        recalcularPosicionesEntidades();
    }, 200);
});

// ==========================================================
// ATAQUES QUE EXISTEN EN TOTAL
// ==========================================================

const ataquesSeiya = [
    {
        ataqueNum: 1,
        nombre: "Golpe Rápido",
        tipo: "Fisico",
        tipoDaño: "Fisico",
        pmNecesaria: 0,
        cosmosNecesario: 0,
        precision: 95,
        rangoMin: 1,
        rangoMax: 1,
        detalle: "Un golpe rápido y directo.",
        target: "Rival",
        duracionAudio: 1200,
        efecto: {
            tipo: "Daño",
            escala: "fuerza",
            multiplicador: 1.0
        }
    },

    {
        ataqueNum: 2,
        nombre: "Puño Rodante de Pegaso",
        tipo: "Fisico",
        tipoDaño: "Fisico",
        pmNecesaria: 3,
        cosmosNecesario: 0,
        precision: 85,
        rangoMin: 1,
        rangoMax: 1,
        detalle: "Un golpe giratorio capaz de aturdir al enemigo.",
        target: "Rival",
        audio: "/audios/seiya/puño_rodante.wav",
        duracionAudio: 3000,
        efecto: {
            tipo: "Daño",
            escala: "fuerza",
            multiplicador: 1.3,
            estado: {
                tipo: 4, // Aturdido
                probabilidad: 90,
                duracion: 1
            }
        }
    },

    {
        ataqueNum: 3,
        nombre: "Puño Meteórico",
        tipo: "Cosmos",
        tipoDaño: "Magico",
        pmNecesaria: 0,
        cosmosNecesario: 20,
        precision: 88,
        rangoMin: 1,
        rangoMax: 2,
        detalle: "Un golpe impulsado por el cosmos que viaja a distancia.",
        target: "Rival",
        audio: "/audios/seiya/puño_meteorico.wav",
        duracionAudio: 1800,
        efecto: {
            tipo: "Daño",
            escala: "mixto",
            multiplicador: 1.7
        }
    },

    {
        ataqueNum: 4,
        nombre: "Cometa de Pegaso",
        tipo: "Cosmos",
        tipoDaño: "Magico",
        pmNecesaria: 0,
        cosmosNecesario: 40, 
        precision: 80,
        rangoMin: 1,
        rangoMax: 1,
        detalle: "Un golpe devastador concentrado en un solo punto.",
        target: "Rival",
        audio: "/audios/seiya/cometa_pegaso.wav",
        duracionAudio: 2500,
        efecto: {
            tipo: "Daño",
            escala: "fuerza",
            multiplicador: 2.2,
            ignoraDefensa: 0.2
        }
    },

    {
        ataqueNum: 5,
        nombre: "Meteoro de Pegaso",
        tipo: "Cosmos",
        tipoDaño: "Magico",
        pmNecesaria: 0,
        cosmosNecesario: 60,
        precision: 75,
        rangoMin: 1,
        rangoMax: 3,
        detalle: "Una lluvia imparable de golpes impulsados por el cosmos.",
        target: "Rival",
        audio: "/audios/seiya/meteoro_pegaso.wav",
        duracionAudio: 1800,
        efecto: {
            tipo: "Daño",
            escala: "mixto",
            multiplicador: 2.5
        }
    }
];

const ataquesShiryu = [

    // 1️⃣ ATAQUE BÁSICO (cerca)
    {
        ataqueNum: 1,
        nombre: "Golpe del Dragón",
        tipo: "Fisico",
        tipoDaño: "Fisico",
        pmNecesaria: 0,
        cosmosNecesario: 0,
        precision: 92,
        rangoMin: 1,
        rangoMax: 1,
        detalle: "Un golpe firme y controlado, ejecutado con la fuerza del Dragón.",
        target: "Rival",
        duracionAudio: 1200,
        efecto: {
            tipo: "Daño",
            escala: "fuerza",
            multiplicador: 1.1
        }
    },

    // 2️⃣ PATADA (cerca, un poco mejor)
    {
        ataqueNum: 2,
        nombre: "Patada Giratoria del Dragón",
        tipo: "Fisico",
        tipoDaño: "Fisico",
        pmNecesaria: 2,
        cosmosNecesario: 0,
        precision: 88,
        rangoMin: 1,
        rangoMax: 1,
        detalle: "Una patada circular que golpea con el peso y la técnica de Shiryu.",
        target: "Rival",
        duracionAudio: 1200,
        efecto: {
            tipo: "Daño",
            escala: "fuerza",
            multiplicador: 1.4
        }
    },

    // 3️⃣ ATAQUE DE MEDIA DISTANCIA
    {
        ataqueNum: 3,
        nombre: "Vuelo del Dragón",
        tipo: "Cosmos",
        tipoDaño: "Magico",
        pmNecesaria: 0,
        cosmosNecesario: 20,
        precision: 85,
        rangoMin: 1,
        rangoMax: 2,
        detalle: "Shiryu impulsa su cosmos y avanza como un dragón en pleno vuelo.",
        target: "Rival",
        audio: "/audios/shiryu/vuelo_del_dragon.wav",
        duracionAudio: 2700,
        efecto: {
            tipo: "Daño",
            escala: "mixto",
            multiplicador: 1.9
        }
    },

    // 4️⃣ ATAQUE FUERTE CON RIESGO
    {
        ataqueNum: 4,
        nombre: "Ascenso del Dragón",
        tipo: "Cosmos",
        tipoDaño: "Magico",
        pmNecesaria: 0,
        cosmosNecesario: 40,
        precision: 78,
        rangoMin: 1,
        rangoMax: 1,
        detalle: "Un ataque ascendente devastador que deja a Shiryu expuesto.",
        target: "Rival",
        audio: "/audios/shiryu/ascenso_del_dragon.wav",
        duracionAudio: 3000,
        efecto: {
            tipo: "Daño",
            escala: "fuerza",
            multiplicador: 3.0,
            autoDebuff: {
                stat: "defensa",
                valor: -2,
                duracion: 1
            }
        }
    },

    // 5️⃣ ATAQUE DEFINITIVO
    {
        ataqueNum: 5,
        nombre: "Ascenso del Dragón Supremo",
        tipo: "Especial",
        tipoDaño: "Puro",
        pmNecesaria: 5,
        cosmosNecesario: 65,
        precision: 70,
        rangoMin: 1,
        rangoMax: 1,
        detalle: "Shiryu libera todo su cosmos en un ascenso final, poniendo su vida en riesgo.",
        target: "Rival",
        audio: "/audios/shiryu/ascenso_del_dragon_supremo.wav",
        duracionAudio: 3000,
        efecto: {
            tipo: "Daño",
            escala: "mixto",
            multiplicador: 4.0,
            autoDebuff: {
                stat: "defensa",
                valor: -3,
                duracion: 2
            }
        }
    }
];


const ataquesHyoga = [

    {
        ataqueNum: 1,
        nombre: "Puño del Dragón",
        tipo: "Fisico",
        tipoDaño: "Fisico",
        pmNecesaria: 0,
        cosmosNecesario: 0,
        precision: 90,
        rangoMin: 1,
        rangoMax: 1,
        detalle: "Un golpe firme cargado con la fuerza del Dragón.",
        target: "Rival",
        efecto: {
            tipo: "Daño",
            escala: "fuerza",
            multiplicador: 1.2
        }
    }
];

const ataquesShun = [

    {
        ataqueNum: 1,
        nombre: "Puño del Dragón",
        tipo: "Fisico",
        tipoDaño: "Fisico",
        pmNecesaria: 0,
        cosmosNecesario: 0,
        precision: 90,
        rangoMin: 1,
        rangoMax: 1,
        detalle: "Un golpe firme cargado con la fuerza del Dragón.",
        target: "Rival",
        efecto: {
            tipo: "Daño",
            escala: "fuerza",
            multiplicador: 1.2
        }
    }
];

const ataquesIkki = [

    {
        ataqueNum: 1,
        nombre: "Puño del Dragón",
        tipo: "Fisico",
        tipoDaño: "Fisico",
        pmNecesaria: 0,
        cosmosNecesario: 0,
        precision: 90,
        rangoMin: 1,
        rangoMax: 1,
        detalle: "Un golpe firme cargado con la fuerza del Dragón.",
        target: "Rival",
        efecto: {
            tipo: "Daño",
            escala: "fuerza",
            multiplicador: 1.2
        }
    }
];

const ataquesShaina = [

    {
        ataqueNum: 1,
        nombre: "Puño del Dragón",
        tipo: "Fisico",
        tipoDaño: "Fisico",
        pmNecesaria: 0,
        cosmosNecesario: 0,
        precision: 90,
        rangoMin: 1,
        rangoMax: 1,
        detalle: "Un golpe firme cargado con la fuerza del Dragón.",
        target: "Rival",
        efecto: {
            tipo: "Daño",
            escala: "fuerza",
            multiplicador: 1.2
        }
    }
];

const ataquesAtenea = [

    {
        ataqueNum: 1,
        nombre: "Luz de Atenea",
        tipo: "Cosmos",
        tipoDaño: "Magico",
        pmNecesaria: 0,
        cosmosNecesario: 15,
        precision: 95,
        rangoMin: 1,
        rangoMax: 2,
        detalle: "Un rayo de luz divina que daña el espíritu del enemigo.",
        target: "Rival",
        efecto: {
            tipo: "Daño",
            escala: "cosmos",
            multiplicador: 1.6
        }
    },

    {
        ataqueNum: 2,
        nombre: "Bendición de la Diosa",
        tipo: "Especial",
        pmNecesaria: 8,
        cosmosNecesario: 30,
        precision: 100,
        rangoMin: 0,
        rangoMax: 2,
        detalle: "La protección de Atenea fortalece la defensa mágica de sus aliados.",
        target: "TodosAliados",
        efecto: {
            tipo: "Buff",
            stat: "defensaMagica",
            valor: 3,
            duracion: 2
        }
    },

    {
        ataqueNum: 3,
        nombre: "Juicio Divino",
        tipo: "Especial",
        tipoDaño: "Puro",
        pmNecesaria: 10,
        cosmosNecesario: 60,
        precision: 80,
        rangoMin: 1,
        rangoMax: 2,
        detalle: "Atenea juzga al enemigo ignorando toda defensa.",
        target: "Rival",
        efecto: {
            tipo: "Daño",
            escala: "cosmos",
            multiplicador: 2.8
        }
    },

    {
        ataqueNum: 4,
        nombre: "Milagro de Atenea",
        tipo: "Cosmos",
        tipoDaño: "Magico",
        pmNecesaria: 6,
        cosmosNecesario: 25,
        precision: 100,
        rangoMin: 0,
        rangoMax: 2,
        detalle: "Una luz divina restaura la vida de un aliado.",
        target: "Aliado",
        efecto: {
            tipo: "Curacion",
            escala: "cosmos",
            multiplicador: 2.0
        }
    },

    {
        ataqueNum: 5,
        nombre: "Escudo de Nike",
        tipo: "Especial",
        pmNecesaria: 12,
        cosmosNecesario: 50,
        precision: 100,
        rangoMin: 0,
        rangoMax: 0,
        detalle: "Un escudo divino que anula el próximo daño recibido.",
        target: "Propio",
        efecto: {
            tipo: "Estado",
            estado: "Invulnerable",
            duracion: 1
        }
    }

];

const ataquesGuerrero1 = [

    {
        ataqueNum: 1,
        nombre: "Golpe Tosco",
        tipo: "Fisico",
        tipoDaño: "Fisico",
        pmNecesaria: 0,
        cosmosNecesario: 0,
        precision: 90,
        rangoMin: 1,
        rangoMax: 1,
        detalle: "Un golpe fuerte pero poco refinado.",
        target: "Rival",
        duracionAudio: 1200,
        efecto: {
            tipo: "Daño",
            escala: "fuerza",
            multiplicador: 1.2
        }
    },

    {
        ataqueNum: 2,
        nombre: "Embestida",
        tipo: "Fisico",
        tipoDaño: "Fisico",
        pmNecesaria: 0,
        cosmosNecesario: 10,
        precision: 80,
        rangoMin: 1,
        rangoMax: 1,
        detalle: "Se lanza contra el rival usando todo su peso.",
        target: "Rival",
        duracionAudio: 1200,
        efecto: {
            tipo: "Daño",
            escala: "fuerza",
            multiplicador: 1.5
        }
    },

    {
        ataqueNum: 3,
        nombre: "Golpe Brutal",
        tipo: "Fisico",
        tipoDaño: "Fisico",
        pmNecesaria: 0,
        cosmosNecesario: 25,
        precision: 70,
        rangoMin: 1,
        rangoMax: 1,
        detalle: "Un golpe poderoso que deja al rival vulnerable.",
        target: "Rival",
        duracionAudio: 1200,
        efecto: {
            tipo: "Daño",
            escala: "fuerza",
            multiplicador: 1.8,
            efectoSecundario: {
                tipo: "Debuff",
                stat: "defensa",
                valor: -1,
                duracion: 1
            }
        }
    }

];


//------------------------------------------------------------------------------------------------------------------------------------
// ======================================================================
// CREAR PERSONAJE / CABALLERO
// ======================================================================

function crearPersonaje(datos) {

    return {
        // ==========================
        // IDENTIDAD
        // ==========================
        id: datos.id,
        nombre: datos.nombre,

        // jugador | enemigo
        tipo: datos.tipo ?? "jugador",

        // bronce | plata | oro | espectro | enemigo
        rango: datos.rango ?? null,

        // masculino | femenino | desconocido
        genero: datos.genero ?? "desconocido",

        // Pegaso, Dragón, Ofiuco, etc.
        caballero: datos.caballero ?? null,

        // ==========================
        // IMÁGENES
        // ==========================
        imgIcono: datos.imgIcono ?? null,
        imgBatalla: datos.imgBatalla ?? null,
        imgBatallaDefendiendose: datos.imgBatallaDefendiendose ?? null,
        imgBatallaDerrotado: datos.imgBatallaDerrotado ?? null,
        imgFormacion: datos.imgFormacion ?? null,

        // ==========================
        // NIVEL
        // ==========================
        nivel: datos.nivel ?? 1,

        // ==========================
        // VIDA / ENERGÍA
        // ==========================
        pv: datos.pv ?? 0,
        pvMax: datos.pvMax ?? datos.pv ?? 0,
        pm: datos.pm ?? 0,
        pmMax: datos.pmMax ?? datos.pm ?? 0,

        // ==========================
        // STATS
        // ==========================
        fuerza: datos.fuerza ?? 0,
        poderMagico: datos.poderMagico ?? 0,
        defensa: datos.defensa ?? 0,
        defensaMagica: datos.defensaMagica ?? 0,
        velocidad: datos.velocidad ?? 0,

        // ==========================
        // COSMOS
        // ==========================
        cosmosActual: datos.cosmosActual ?? 0,
        cosmosMax: datos.cosmosMax ?? 100,
        septimoSentido: datos.septimoSentido ?? false,

        bonosCosmos: datos.bonosCosmos ?? {},

        // ==========================
        // AUDIO 🔊 (ESTO FALTABA)
        // ==========================
        audio: datos.audio ?? {},

        // ==========================
        // ATAQUES
        // ==========================
        ataquesDisponibles: datos.ataquesDisponibles ?? [],

        // ==========================
        // ESTADO (1 = saludable)
        // ==========================
        estado: datos.estado ?? 1,

        // ==========================
        // ESTADOS ALTERADOS (COMBATE)
        // ==========================
        estadosAlterados: [],

        // ==========================
        // COMBATE
        // ==========================
        activo: false
    };
}


const caballerosBronce = [

    crearPersonaje({
        id: 101,
        nombre: "Seiya",
        tipo: "jugador",
        rango: "bronce",
        genero: "masculino",
        caballero: "Pegaso",
    
        imgIcono: "./imgs/iconos/seiya.png",
        imgBatalla: "./imgs/batalla/seiya.png",
        imgBatallaDefendiendose: "./imgs/batalla/seiya_defendiendose.png",
        imgBatallaDerrotado: "../imgs/batalla/seiya_derrotado.png",
        imgFormacion: "./imgs/formacion/seiya.png",
    
        pv: 35,
        pm: 15,
    
        fuerza: 4,
        poderMagico: 2,
        defensa: 2,
        defensaMagica: 1,
        velocidad: 4,
    
        bonosCosmos: {
            fuerza: 2,
            velocidad: 2,
            defensa: 1
        },

        audio: {
        ataqueGenerico: "/audios/seiya/ataque_generico.wav",
        herido: "../audios/seiya/herido.wav",
        concentrandose: ".../audios/seiya/concentrandose.wav",
        defendiendose: "./audios/seiya/defendiendose.wav",
        },
    
        ataquesDisponibles: ataquesSeiya,
        estado: 1
    }),

    crearPersonaje({
        id: 102,
        nombre: "Shiryu",
        tipo: "jugador",
        rango: "bronce",
        genero: "masculino",
        caballero: "Dragón",
    
        imgIcono: "./imgs/iconos/shiryu.png",
        imgBatalla: "./imgs/batalla/shiryu.png",
        imgBatallaDefendiendose: "./imgs/batalla/shiryu_defendiendose.png",
        imgBatallaDerrotado: "./imgs/batalla/shiryu_derrotado.png",
        imgFormacion: "./imgs/formacion/shiryu.png",
    
        pv: 40,
        pm: 10,
    
        fuerza: 5,
        poderMagico: 0,
        defensa: 4,
        defensaMagica: 2,
        velocidad: 1,
    
        bonosCosmos: {
            defensa: 3,
            defensaMagica: 2,
            fuerza: 1
        },

        audio: {
        ataqueGenerico: "./audios/shiryu/ataque_generico.wav",
        herido: "./audios/shiryu/herido.wav",
        concentrandose: "./audios/seiya/concentrandose.wav",
        defendiendose: "./audios/seiya/defendiendose.wav"
        },
    
        ataquesDisponibles: ataquesShiryu,
        estado: 1
    }),

    crearPersonaje({
        id: 103,
        nombre: "Hyoga",
        tipo: "jugador",
        rango: "bronce",
        genero: "masculino",
        caballero: "Cisne",
    
        imgIcono: "./imgs/iconos/hyoga.png",
        imgBatalla: "./imgs/batalla/hyoga.png",
        imgBatallaDefendiendose: "./imgs/batalla/hyoga_defendiendose.png",
        imgBatallaDerrotado: "./imgs/batalla/hyoga_derrotado.png",
        imgFormacion: "./imgs/formacion/hyoga.png",
    
        pv: 30,
        pm: 25,
    
        fuerza: 2,
        poderMagico: 5,
        defensa: 2,
        defensaMagica: 3,
        velocidad: 2,
    
        bonosCosmos: {
            poderMagico: 3,
            defensaMagica: 2
        },

        audio: {
        ataqueGenerico: "./audios/hyoga/ataque_generico.wav",
        herido: "./audios/hyoga/herido.wav",
        concentrandose: "./audios/seiya/concentrandose.wav",
        defendiendose: "./audios/seiya/defendiendose.wav"
        },
    
        ataquesDisponibles: ataquesHyoga,
        estado: 1
    }),

    crearPersonaje({
        id: 104,
        nombre: "Shun",
        tipo: "jugador",
        rango: "bronce",
        genero: "masculino",
        caballero: "Andrómeda",
    
        imgIcono: "./imgs/iconos/shun.png",
        imgBatalla: "./imgs/batalla/shun.png",
        imgBatallaDefendiendose: "./imgs/batalla/shun_defendiendose.png",
        imgBatallaDerrotado: "./imgs/batalla/shun_derrotado.png",
        imgFormacion: "./imgs/formacion/shun.png",
    
        pv: 34,
        pm: 30,
    
        fuerza: 2,
        poderMagico: 4,
        defensa: 2,
        defensaMagica: 3,
        velocidad: 3,
    
        bonosCosmos: {
            poderMagico: 2,
            defensa: 2,
            defensaMagica: 2
        },

        audio: {
        ataqueGenerico: "./audios/shun/ataque_generico.wav",
        herido: "./audios/shun/herido.wav",
        concentrandose: "./audios/seiya/concentrandose.wav",
        defendiendose: "./audios/seiya/defendiendose.wav"
        },
    
        ataquesDisponibles: ataquesShun,
        estado: 1
    }),

    crearPersonaje({
        id: 105,
        nombre: "Ikki",
        tipo: "jugador",
        rango: "bronce",
        genero: "masculino",
        caballero: "Fénix",
    
        imgIcono: "./imgs/iconos/ikki.png",
        imgBatalla: "./imgs/batalla/ikki.png",
        imgBatallaDefendiendose: "./imgs/batalla/ikki_defendiendose.png",
        imgBatallaDerrotado: "./imgs/batalla/ikki_derrotado.png",
        imgFormacion: "./imgs/formacion/ikki.png",
    
        pv: 38,
        pm: 20,
    
        fuerza: 6,
        poderMagico: 2,
        defensa: 2,
        defensaMagica: 2,
        velocidad: 3,
    
        bonosCosmos: {
            fuerza: 3,
            poderMagico: 2,
            velocidad: 1
        },

        audio: {
        ataqueGenerico: "./audios/ikki/ataque_generico.wav",
        herido: "./audios/ikki/herido.wav",
        concentrandose: "./audios/seiya/concentrandose.wav",
        defendiendose: "./audios/seiya/defendiendose.wav"
        },
    
        ataquesDisponibles: ataquesIkki,
        estado: 1
    })
];

const caballerosPlata = [

    crearPersonaje({
        id: 201,
        nombre: "Shaina",
        caballero: "Ofiuco",
        rango: "Plata",
        tipo: "jugador",
        genero: "femenino",

        imgIcono: "./imgs/iconos/shaina.png",
        imgBatalla: "./imgs/batalla/shaina.png",
        imgBatallaDefendiendose: "./imgs/batalla/shaina_defendiendose.png",
        imgBatallaDerrotado: "./imgs/batalla/shaina_derrotado.png",
        imgFormacion: "./imgs/formacion/shaina.png",

        pv: 55,
        pvMax: 55,
        pm: 25,
        pmMax: 25,

        fuerza: 7,
        poderMagico: 2,
        defensa: 4,
        defensaMagica: 3,
        velocidad: 5,

        cosmosActual: 0,
        cosmosMax: 120,
        septimoSentido: false,

        bonosCosmos: {
            fuerza: 3,
            velocidad: 2,
            defensa: 2
        },

        audio: {
        ataqueGenerico: "./audios/shaina/ataque_generico.wav",
        herido: "./audios/shaina/herido.wav",
        concentrandose: "./audios/seiya/concentrandose.wav",
        defendiendose: "./audios/seiya/defendiendose.wav"
        },

        ataquesDisponibles: ataquesShaina,
        estado: 1
    })
];

const enemigos = [

    crearPersonaje({
        id: 901,
        nombre: "Guerrero 1",
        tipo: "enemigo",
        rango: "enemigo",
        rolIA: "MINION",
        genero: "desconocido",
        caballero: null,

        imgBatalla: "./imgs/batalla/enemigo1.png",
        imgBatallaDerrotado: "./imgs/batalla/enemigo1_derrotado.png",

        pv: 30,
        pm: 10,

        fuerza: 3,
        poderMagico: 1,
        defensa: 2,
        defensaMagica: 1,
        velocidad: 2,

        audio: {
        ataqueGenerico: "/audios/guerrero_1/ataque_generico.wav",
        herido: "/audios/guerrero_1/herido.wav",
        concentrandose: "/audios/seiya/concentrandose.wav",
        defendiendose: "/audios/seiya/defendiendose.wav"
        },

        ataquesDisponibles: ataquesGuerrero1,
        estado: 1
    }),

    crearPersonaje({
        id: 902,
        nombre: "Guerrero 2",
        tipo: "enemigo",
        rango: "enemigo",
        rolIA: "MINION",
        genero: "desconocido",
        caballero: null,

        imgBatalla: "./imgs/batalla/enemigo2.png",
        imgBatallaDerrotado: "./imgs/batalla/enemigo2_derrotado.png",

        pv: 45,
        pm: 12,

        fuerza: 5,
        poderMagico: 1,
        defensa: 4,
        defensaMagica: 2,
        velocidad: 1,

        audio: {
        ataqueGenerico: "/audios/guerrero_2/ataque_generico.wav",
        herido: "/audios/guerrero_2/herido.wav",
        concentrandose: "/audios/seiya/concentrandose.wav",
        defendiendose: "/audios/seiya/defendiendose.wav"
        },

        ataquesAprendidosNum: [1, 2],
        estado: 1
    })

];

function obtenerAtaquesDelPersonaje(personaje) {

    if (personaje.caballero === "Pegaso") return ataquesSeiya;
    if (personaje.caballero === "Dragón") return ataquesShiryu;

    if (personaje.nombre === "Atenea") return ataquesAtenea;

    if (personaje.tipo === "enemigo") return ataquesGuerrero1;

    return [];
}


// -------------------------------------------------------------------------------------------------------------------------------------
// ======================================================================
// ESTADOS DEL JUGADOR
// ======================================================================
const estados = [
    { id: 1, nombre: "Vivo" },
    { id: 2, nombre: "Muerto" },
    { id: 3, nombre: "Envenenar" },
    { id: 4, nombre: "Aturdir" },
    { id: 5, nombre: "Congelar" },
    { id: 6, nombre: "Quemar" },
    { id: 7, nombre: "Dormir" }
];

// Buscar un estado por id
function obtenerEstadoPorId(id) {
    return estados.find(e => e.id === id)?.nombre ?? "desconocido";
}

const ESTADOS_INCAPACITANTES = [4, 5, 7]; 
// aturdido, congelado, dormido

// -------------------------------------------------------------------------------------------------------------------------------------
// ==========================================================
// BOTONES ENTRE PAGINAS
// ==========================================================

const paginaPrincipal = document.getElementById("paginaPrincipal");
const paginaSeleccionarGuerreros = document.getElementById("paginaSeleccionarGuerreros");
const paginaFormacion = document.getElementById("paginaFormacion");
const paginaTablero = document.getElementById("paginaTablero");
const paginaTestear = document.getElementById("paginaTestear");

const btnSeleccionarGuerreros = document.getElementById("seleccionarGuerreros");
const btnConfirmarSeleccion = document.getElementById("btnConfirmarSeleccion");

const btnPaginaFormacion = document.getElementById("btnPaginaFormacion");
const btnSalirFormacion = document.getElementById("btnSalirFormacion");



const btnIrALaBatalla = document.getElementById("btnIrALaBatalla");
const btnSalirBatalla = document.getElementById("btnSalirBatalla");

const btnPaginaTestear = document.getElementById("btnPaginaTestear");
const btnSalirTestear = document.getElementById("btnSalirTestear");

// Me lleva a Seleccionar los Caballeros:
btnSeleccionarGuerreros.addEventListener("click", () => {
    paginaPrincipal.style.display = "none";
    paginaSeleccionarGuerreros.style.display = "flex";
    sonidoClick.play().catch(() => {});
});
btnConfirmarSeleccion.addEventListener("click", () => {
    paginaSeleccionarGuerreros.style.display = "none";
    paginaPrincipal.style.display = "flex";
    sonidoClick.play().catch(() => {});
});

// Me lleva a Formacion:
btnPaginaFormacion.addEventListener("click", () => {
    paginaPrincipal.style.display = "none";
    paginaFormacion.style.display = "flex";
    sonidoClick.play().catch(() => {});

    crearTableroFormacion();
});
btnSalirFormacion.addEventListener("click", () => {
    paginaFormacion.style.display = "none";
    paginaPrincipal.style.display = "flex";
    sonidoClick.play().catch(() => {});
});

// Pagina de Pre-Carga:
function mostrarPantallaCarga() {
    document.getElementById("pantallaCarga").style.display = "flex";
}
function ocultarPantallaCarga() {
    document.getElementById("pantallaCarga").style.display = "none";
}

// CARGA_TABLERO:
btnIrALaBatalla.addEventListener("click", () => {

    paginaPrincipal.style.display = "none";
    sonidoClick.play().catch(() => {});
    mostrarPantallaCarga();

    const rutasImagenes = obtenerRutasImagenesBatalla();
    const rutasAudios = obtenerRutasAudiosBatalla();

    // 1️⃣ Precargar imágenes
    precargarImagenes(rutasImagenes, () => {

        // 2️⃣ Precargar audios
        precargarAudios(rutasAudios, () => {

            // 3️⃣ Entrar a batalla solo cuando TODO está listo
            ocultarPantallaCarga();
            paginaTablero.style.display = "flex";

            crearTablero();

            recalcularFormacionDesdeSlots();
            crearFormacionCopiaParaBatalla();

            guardarInfoBackUp(); // BACKUP BASE

            actualizarUIBatalla();

            construirColaTurnos();
            iniciarTurno();
        });
    });
});

btnSalirBatalla.addEventListener("click", () => {

    cargarInfoBackUp(); // RESTAURA STATS

    paginaTablero.style.display = "none";
    paginaPrincipal.style.display = "flex";

    formacionCopiaEnBatalla = [];
});


// Me lleva a la Pagina de Testeos:
btnPaginaTestear.addEventListener("click", () => {
    paginaPrincipal.style.display = "none";
    paginaTestear.style.display = "flex";
    sonidoClick.play().catch(() => {});
});
btnSalirTestear.addEventListener("click", () => {
    paginaTestear.style.display = "none";
    paginaPrincipal.style.display = "flex";
    sonidoClick.play().catch(() => {});
});

// -------------------------------------------------------------------------------------------------------------------------------------
// ==========================================================
// BACK_PROFUNDO:
// ==========================================================

// IDs de personajes disponibles/adquiridos:
let personajesDisponibles = [101, 102, 103, 104, 105];

// Funcion para añadir un nuevo caballero al Array "personajesDisponibles":
function añadirCaballeroDisponible(idCaballero) {
    // Validar que el id sea un número
    if (typeof idCaballero !== "number") return false;

    // Evitar duplicados
    if (personajesDisponibles.includes(idCaballero)) return false;

    personajesDisponibles.push(idCaballero);

    // Buscar el personaje para mostrar su nombre
    const personaje = caballerosBronce.find(c => c.id === idCaballero);

    if (personaje) {
        console.log(`El jugador obtuvo a ${personaje.nombre}.`);
    } else {
        console.log(`El jugador obtuvo a un nuevo caballero (ID ${idCaballero}).`);
    }

    return true;
}
// Ejemplo de como añadir a un Caballero al listado de disponibles y jugables:
// añadirCaballeroDisponible(106); // Se coloca el Nº ID del caballero.

// ==========================================================
// ENEMIGOS_NIVELES
// ==========================================================

const nivelesHistoria = {
    1: {
        nombre: "Casa Inicial",
        enemigos: [
            {
                id: 901,
                fila: 2,
                columna: 5
            }
        ]
    },

    2: {
        nombre: "Sendero Oscuro",
        enemigos: [
            {
                id: 901,
                fila: 2,
                columna: 5
            },
            {
                id: 901,
                fila: 3,
                columna: 6
            }
        ]
    }

    // después agregás más sin tocar lógica
};

//------------------------------------------------------------------------------------------------------------------------------------
// ==========================================================
// PAGINA_SELECCIONAR_GUERREROS
// ==========================================================

// Slots Disponibles:
let cantidadSlotsActivos = 1;

// Para que el 1er Slot este Seiya:
const primerSlot = document.querySelector(".slotGuerrero[data-slot='1'] input");
if (primerSlot) {
    primerSlot.dataset.id = 101;  // ID de Seiya
    primerSlot.value = "Seiya";   // Nombre visible en el input
}

function actualizarSlotsGuerreros() {
    const slots = document.querySelectorAll(".slotGuerrero");

    slots.forEach((slot, index) => {
        const input = slot.querySelector("input");
        const boton = slot.querySelector("button");

        // index empieza en 0, slots activos empiezan en 1
        if (index < cantidadSlotsActivos) {
            slot.classList.remove("bloqueado");
            input.disabled = false;
            boton.disabled = false;
        } else {
            slot.classList.add("bloqueado");
            input.disabled = true;
            boton.disabled = true;

            input.value = "";
            delete input.dataset.id;
        }
    });

    actualizarTextoBotones();
}

// Llamar una vez al cargar
actualizarSlotsGuerreros();

// Funcion para HABILITAR el 2do, 3ro, 4to y 5to Slot:
function setCantidadGuerreros(cantidad) {
    cantidadSlotsActivos = Math.min(cantidad, 5);
    actualizarSlotsGuerreros();
    sincronizarTodo();
}

// Funcion para añadir el correspondiente Slot que uno desea que se habilite:
//setCantidadGuerreros(2); // habilita el 2do slot
//setCantidadGuerreros(3); // habilita el 3er slot
//setCantidadGuerreros(4); // habilita el 4to slot
//setCantidadGuerreros(5); // habilita el 5to slot

//------------------------------------------------------------------------------------------------------------------------------------
// ==========================================================
// POPUP_SELECCIONAR_CABALLERO_CON_EL_QUE_JUGAR
// ==========================================================

function obtenerCaballeroDelSlotActual() {
    if (!slotActual) return null;

    const input = slotActual.querySelector("input");
    return input.dataset.id ? Number(input.dataset.id) : null;
}

let slotActual = null;
let guerreroSeleccionado = null;

const overlayPopup = document.getElementById("overlayPopup");
const contenedorGuerreros = document.getElementById("guerrerosDesbloqueados");
const btnConfirmarGuerrero = document.getElementById("btnConfirmarGuerrero");

document.querySelectorAll(".slotGuerrero button").forEach(btn => {
    btn.addEventListener("click", () => {
        const slot = btn.closest(".slotGuerrero");
        slotActual = slot;
        abrirPopupGuerreros();
        sonidoClickPersonaje.play().catch(() => {});
    });
});

function abrirPopupGuerreros() {
    guerreroSeleccionado = null;
    contenedorGuerreros.innerHTML = "";

    const caballerosUsados = obtenerCaballerosUsados();
    const caballeroActualId = obtenerCaballeroDelSlotActual();

    caballerosBronce
    .filter(guerrero => personajesDisponibles.includes(guerrero.id))
    .forEach(guerrero => {

        const div = document.createElement("div");
        div.classList.add("iconoGuerrero");

        const img = document.createElement("img");
        img.src = guerrero.imgIcono;
        img.alt = guerrero.nombre;

        div.appendChild(img);

        // Caso 1: es el caballero asignado a ESTE slot
        if (caballeroActualId === guerrero.id) {

            div.classList.add("seleccionado");
            guerreroSeleccionado = guerrero;

            div.addEventListener("click", () => {
                const yaSeleccionado = div.classList.contains("seleccionado");

                document.querySelectorAll(".iconoGuerrero")
                    .forEach(i => i.classList.remove("seleccionado"));

                if (!yaSeleccionado) {
                    div.classList.add("seleccionado");
                    guerreroSeleccionado = guerrero;
                } else {
                    guerreroSeleccionado = null;
                }
            });

        }
        // Caso 2: usado en otro slot
        else if (caballerosUsados.includes(guerrero.id)) {
            div.classList.add("usado");
        }
        // Caso 3: disponible
        else {
            div.addEventListener("click", () => {
                const yaSeleccionado = div.classList.contains("seleccionado");

                document.querySelectorAll(".iconoGuerrero")
                    .forEach(i => i.classList.remove("seleccionado"));

                if (!yaSeleccionado) {
                    div.classList.add("seleccionado");
                    guerreroSeleccionado = guerrero;
                } else {
                    guerreroSeleccionado = null;
                }
            });
        }

        contenedorGuerreros.appendChild(div);
    });

    overlayPopup.style.display = "flex";
}

// Listener para que el usuario al clickear fuera del popup, este se cierre:
overlayPopup.addEventListener("click", e => {
    if (e.target === overlayPopup) {
        overlayPopup.style.display = "none";
    }
});

btnConfirmarGuerrero.addEventListener("click", () => {

    if (!slotActual) {
        overlayPopup.style.display = "none";
        return;
    }

    const input = slotActual.querySelector("input");

    // Limpiar el  Slot
    if (!guerreroSeleccionado) {
        input.value = "";
        delete input.dataset.id;
        actualizarTextoBotones();
        overlayPopup.style.display = "none";
        return;
    }

    // Guardar ID del caballero
    input.dataset.id = guerreroSeleccionado.id;
    input.value = guerreroSeleccionado.nombre;


    actualizarTextoBotones();
    sincronizarTodo();
    sonidoClickPersonaje.play().catch(() => {});
    overlayPopup.style.display = "none";
});

// Funcion que muestra el nombre del caballero en el Input (El cual obtiene el id del caballero):
function obtenerNombreCaballeroPorId(id) {
    const cab = caballerosBronce.find(c => c.id === id);
    return cab ? cab.nombre : "";
}

function obtenerCaballerosUsados() {
    const usados = [];

    document.querySelectorAll(".slotGuerrero input").forEach(input => {
        if (input.dataset.id) {
            usados.push(Number(input.dataset.id));
        }
    });

    return usados;
}

// Cambia el texto del Boton "Añadir" a "Cambiar":
function actualizarTextoBotones() {
    document.querySelectorAll(".slotGuerrero").forEach(slot => {
        const input = slot.querySelector("input");
        const boton = slot.querySelector("button");

        if (input.value.trim() !== "") {
            boton.textContent = "Cambiar";
        } else {
            boton.textContent = "Añadir";
        }
    });
}

//------------------------------------------------------------------------------------------------------------------------------------
// ==========================================================
// PAGINA_FORMACION
// ==========================================================

const filas = 4;
const columnas = 3;
const tableroDiv = document.getElementById("tableroFormacion");

let caballeroSeleccionado = null;
let formacionActual = []; /*Aca guardamos la formacion que utilizaremos en las Batallas*/ 

function recalcularFormacionDesdeSlots() {
    const nuevaFormacion = [];
    const posicionesOcupadas = [];

    document.querySelectorAll(".slotGuerrero").forEach(slot => {
        const input = slot.querySelector("input");
        if (!input.dataset.id) return;

        const slotNum = Number(slot.dataset.slot);
        const cabId = Number(input.dataset.id);

        // ¿Ya existe en la formación?
        let existente = formacionActual.find(f => f.id === cabId);

        if (existente) {
            nuevaFormacion.push(existente);
            posicionesOcupadas.push({
                fila: existente.fila,
                columna: existente.columna
            });
            return;
        }

        // Posición por defecto
        let pos = posicionesPorSlot[slotNum] || { fila: 1, columna: 1 };

        // Buscar posición libre si está ocupada
        while (posicionesOcupadas.some(p => p.fila === pos.fila && p.columna === pos.columna)) {
            pos.columna++;
            if (pos.columna > columnas) {
                pos.columna = 1;
                pos.fila++;
                if (pos.fila > filas) pos.fila = 1;
            }
        }

        posicionesOcupadas.push({ fila: pos.fila, columna: pos.columna });

        nuevaFormacion.push({
            id: cabId,
            slot: slotNum,
            fila: pos.fila,
            columna: pos.columna
        });
    });

    formacionActual = nuevaFormacion;
}

const posicionesPorSlot = {
    1: { fila: 2, columna: 3 },
    2: { fila: 3, columna: 2 },
    3: { fila: 1, columna: 1 },
    4: { fila: 4, columna: 1 },
    5: { fila: 4, columna: 3 }
};

function crearTableroFormacion() {
    tableroDiv.innerHTML = "";
    tableroDiv.className = "tableroFormacion";

    for (let fila = 1; fila <= filas; fila++) {
        for (let col = 1; col <= columnas; col++) {
            const celda = document.createElement("div");
            celda.classList.add("celdaFormacion");
            celda.dataset.fila = fila;
            celda.dataset.columna = col;

            // Click en la celda
            celda.addEventListener("click", () => manejarClickCelda(fila, col));

            tableroDiv.appendChild(celda);
        }
    }

    sincronizarTodo();
    colocarCaballerosEnFormacion();
}

function colocarCaballerosEnFormacion() {
    // Limpiar celdas
    document.querySelectorAll(".celdaFormacion").forEach(c => {
        c.innerHTML = "";
        c.classList.remove("seleccionada"); // quitar selección
    });

    formacionActual.forEach(item => {
        const cab = caballerosBronce.find(c => c.id === item.id);
        if (!cab) return;

        const celda = document.querySelector(
            `.celdaFormacion[data-fila="${item.fila}"][data-columna="${item.columna}"]`
        );
        if (!celda) return;

        const img = document.createElement("img");
        img.src = cab.imgFormacion;
        img.alt = cab.nombre;
        img.classList.add("imgCaballeroFormacion");

        celda.appendChild(img);

        // Marcar celda si está seleccionada
        if (caballeroSeleccionado && caballeroSeleccionado.id === item.id) {
            celda.classList.add("seleccionada");
        }
    });
}

// SELECCION Y MOVIMIENTO
function manejarClickCelda(fila, col) {
    const itemEnCelda = formacionActual.find(f => f.fila === fila && f.columna === col);

    if (!caballeroSeleccionado) {
        // Selecciona el caballero de la celda
        if (itemEnCelda) caballeroSeleccionado = itemEnCelda;
    } else {
        // Mover o intercambiar
        if (itemEnCelda) {
            // Intercambiar posiciones
            const tempFila = caballeroSeleccionado.fila;
            const tempCol = caballeroSeleccionado.columna;

            caballeroSeleccionado.fila = itemEnCelda.fila;
            caballeroSeleccionado.columna = itemEnCelda.columna;

            itemEnCelda.fila = tempFila;
            itemEnCelda.columna = tempCol;
        } else {
            // Mover a celda vacía
            caballeroSeleccionado.fila = fila;
            caballeroSeleccionado.columna = col;
        }

        caballeroSeleccionado = null;
    }

    colocarCaballerosEnFormacion();
}

// Deseleccionar si se hace click fuera del tablero
document.addEventListener("click", e => {
    if (!tableroDiv.contains(e.target)) {
        caballeroSeleccionado = null;
        colocarCaballerosEnFormacion();
    }
});

// GUARDADO AL SALIR
btnSalirFormacion.addEventListener("click", () => {
    localStorage.setItem("formacionCaballeros", JSON.stringify(formacionActual));
    console.log("Formación guardada:", formacionActual);
    paginaFormacion.style.display = "none";
    paginaPrincipal.style.display = "flex";
});

//------------------------------------------------------------------------------------------------------------------------------------
// ==========================================================
// PAGINA_PRE_CARGA
// ==========================================================

function precargarImagenes(rutas, callback) {
    let cargadas = 0;

    if (!rutas.length) {
        callback?.();
        return;
    }

    rutas.forEach(src => {
        const img = new Image();
        img.src = src;

        img.onload = img.onerror = () => {
            cargadas++;
            if (cargadas === rutas.length && callback) {
                callback();
            }
        };
    });
}

function obtenerRutasImagenesBatalla() {
    const rutas = [];

    function agregarSprites(entidad) {
        if (!entidad) return;

        if (entidad.imgBatalla) rutas.push(entidad.imgBatalla);
        if (entidad.imgBatallaDefendiendose) rutas.push(entidad.imgBatallaDefendiendose);
        if (entidad.imgBatallaDerrotado) rutas.push(entidad.imgBatallaDerrotado);
    }

    // ==========================
    // Caballeros activos
    // ==========================
    obtenerCaballerosUsados().forEach(id => {
        const cab =
            caballerosBronce.find(c => c.id === id) ||
            caballerosPlata?.find(c => c.id === id) ||
            caballerosOro?.find(c => c.id === id);

        agregarSprites(cab);
    });

    // ==========================
    // Enemigos del nivel actual
    // ==========================
    const nivel = nivelesHistoria[nivelActual];
    if (nivel?.enemigos) {
        nivel.enemigos.forEach(data => {
            const enemigo = enemigos.find(e => e.id === data.id);
            agregarSprites(enemigo);
        });
    }

    return rutas;
}

function precargarAudios(rutas, callback) {
    let cargados = 0;

    if (!rutas.length) {
        callback?.();
        return;
    }

    rutas.forEach(src => {
        const audio = new Audio();
        audio.src = src;

        audio.oncanplaythrough = audio.onerror = () => {
            cargados++;
            if (cargados === rutas.length && callback) {
                callback();
            }
        };
    });
}

// Normalizar rutas para Github:
function normalizarRutaAudio(src) {
    if (!src) return null;

    // Si ya es absoluta, no tocar
    if (src.startsWith("/")) return src;

    // Quitar ./ o ../ y forzar raíz
    return "/" + src.replace(/^(\.\/|\.\.\/)+/, "");
}

function obtenerRutasAudiosBatalla() {
    const rutas = new Set();

    function agregarAudio(src) {
        const ruta = normalizarRutaAudio(src);
        if (ruta) rutas.add(ruta);
    }

    function procesarEntidad(entidad) {
        if (!entidad) return;

        agregarAudio(entidad.audio?.ataqueGenerico);
        agregarAudio(entidad.audio?.herido);

        entidad.ataquesDisponibles?.forEach(a => {
            agregarAudio(a.audio);
        });
    }

    // Caballeros
    obtenerCaballerosUsados().forEach(id => {
        const cab =
            caballerosBronce.find(c => c.id === id) ||
            caballerosPlata?.find(c => c.id === id) ||
            caballerosOro?.find(c => c.id === id);

        procesarEntidad(cab);
    });

    // Enemigos
    const nivel = nivelesHistoria[nivelActual];
    if (nivel?.enemigos) {
        nivel.enemigos.forEach(data => {
            const enemigo = enemigos.find(e => e.id === data.id);
            procesarEntidad(enemigo);
        });
    }

    return [...rutas];
}


//------------------------------------------------------------------------------------------------------------------------------------
// ==========================================================
// PAGINA_TABLERO_BATALLA
// ==========================================================

let formacionCopiaEnBatalla = [];

let nivelActual = 1;
let batallasGanadas = 0;

function actualizarNombreNivel () {
    document.getElementById("casaActual");
}

// Tablero en fila/columna 1-based (Toda fila/col empieza en 1):
function crearTablero() {
    const filas = 4;
    const columnas = 7;
    const tableroDiv = document.getElementById("tableroArmado");

    tableroDiv.innerHTML = "";
    tableroDiv.className = "tableroGuerra";

    for (let fila = 1; fila <= filas; fila++) {
        for (let col = 1; col <= columnas; col++) {
            const celda = document.createElement("div");
            celda.classList.add("celdaGuerra");
            celda.dataset.fila = fila;
            celda.dataset.columna = col;

            tableroDiv.appendChild(celda);
        }
    }
}

// Funcion para obtener la celda/casillero:
function obtenerCelda(fila, columna) {
    return document.querySelector(
        `.celdaGuerra[data-fila="${fila}"][data-columna="${columna}"]`
    );
}

// Funcion que carga a los Caballeros (desde la formacionCopiaEnBatalla):
function cargarFormacionEnTablero() {

    const capa = document.getElementById("capaEntidades");
    capa.innerHTML = "";

    // Limpiar datasets del tablero
    document.querySelectorAll(".celdaGuerra").forEach(c => {
        delete c.dataset.id;
        delete c.dataset.tipo;
    });

    formacionCopiaEnBatalla.forEach(item => {

        let entidad;
        if (item.tipo === "jugador") {
            entidad = caballerosBronce.find(c => c.id === item.id)
                  || caballerosPlata?.find(c => c.id === item.id)
                  || caballerosOro?.find(c => c.id === item.id);
        } else {
            entidad = enemigos.find(e => e.id === item.id);
        }
        if (!entidad) return;

        const img = document.createElement("img");
        img.src = entidad.estado === 2 && entidad.imgBatallaDerrotado
            ? entidad.imgBatallaDerrotado
            : entidad.imgBatalla;

        img.classList.add("imgEntidadBatalla");
        img.dataset.id = entidad.id;
        img.dataset.tipo = item.tipo;

        if (entidad.estado === 2) img.classList.add("derrotado");

        capa.appendChild(img);
        posicionarSpriteEnCapa(img, item.fila, item.columna);

        // 🔑 solo lógica en la celda
        const celda = obtenerCelda(item.fila, item.columna);
        celda.dataset.id = entidad.id;
        celda.dataset.tipo = item.tipo;
    });

    recalcularPosicionesEntidades(); //No borrar. Segun que monitor usemos, ajusta el diseño UX.
}

function posicionarSpriteEnCapa(img, fila, columna) {
    const celda = obtenerCelda(fila, columna);
    const rectCelda = celda.getBoundingClientRect();
    const rectTablero = document.getElementById("divTablero").getBoundingClientRect();

    const baseX =
        rectCelda.left - rectTablero.left + rectCelda.width / 2;

    const baseY =
        rectCelda.top - rectTablero.top + rectCelda.height;

    img.style.setProperty("--base-x", `${baseX}px`);
    img.style.setProperty("--base-y", `${baseY}px`);

    img.style.zIndex = fila;
}

// Se inicializa el tablero en: "CARGA_TABLERO"
function crearTarjetasCaballeros() {
    const contenedor = document.getElementById("contenedorTarjetas");
    contenedor.innerHTML = "";

    const idsUsados = obtenerCaballerosUsados();

    idsUsados.forEach((id, index) => {
        const pj = caballerosBronce.find(c => c.id === id);
        if (!pj) return;

        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjetaPersonaje");
        tarjeta.dataset.slot = index + 1;

        tarjeta.innerHTML = `
            <div class="tarjetaIzq">
                <div class="tarjetaNombre">${pj.nombre}</div>
                <img class="tarjetaIcono" src="${pj.imgIcono}">
            </div>

            <div class="tarjetaDer">
                <div class="tarjetaEstado">
                    ${pj.estado !== 1 ? "(CONF.)" : ""}
                </div>

                ${crearBloqueBarra("PV", pj.pv, pj.pvMax, "barraPV")}
                ${crearBloqueBarra("PM", pj.pm, pj.pmMax, "barraPM")}
                ${crearBloqueBarra("COS", pj.cosmosActual, pj.cosmosMax, "barraCOS")}
            </div>
        `;

        contenedor.appendChild(tarjeta);
    });
}

// Función para las barras
function crearBloqueBarra(texto, actual, max, claseColor) {

    if (typeof actual !== "number" || typeof max !== "number") {
        console.warn(`[BARRA ${texto}] valores no numéricos`);
        return "";
    }

    if (max <= 0) {
        console.warn(`[BARRA ${texto}] max inválido`, max);
        max = 1;
    }

    const porcentaje = Math.max(0, Math.min(100, (actual / max) * 100));

    let textoMostrado = "";

    if (texto === "PV" || texto === "PM") {
        textoMostrado = `${texto}: ${actual}/${max}`;
    } else if (texto === "COS") {
        textoMostrado = `${texto}: ${actual}`;
    } else {
        textoMostrado = texto;
    }

    return `
        <div class="bloqueBarra">
            <span class="textoBarra">${textoMostrado}</span>
            <div class="barra">
                <div class="barraRelleno ${claseColor}" style="width:${porcentaje}%"></div>
            </div>
        </div>
    `;
}

// Funcion que actualiza solamente LAS BARRAS PV,PM y COSMO:
function actualizarBarrasPersonaje(personaje) {

    const tarjeta = document
        .querySelector(`.tarjetaPersonaje img[src="${personaje.imgIcono}"]`)
        ?.closest(".tarjetaPersonaje");

    if (!tarjeta) return;

    // ---------- PV ----------
    const barraPV = tarjeta.querySelector(".barraPV");
    const textoPV = tarjeta.querySelector(".barraPV")?.closest(".bloqueBarra")?.querySelector(".textoBarra");

    if (barraPV && textoPV) {
        const porcentaje = Math.max(0, Math.min(100, (personaje.pv / personaje.pvMax) * 100));
        barraPV.style.width = porcentaje + "%";
        textoPV.textContent = `PV: ${personaje.pv}/${personaje.pvMax}`;
    }

    // ---------- PM ----------
    const barraPM = tarjeta.querySelector(".barraPM");
    const textoPM = tarjeta.querySelector(".barraPM")?.closest(".bloqueBarra")?.querySelector(".textoBarra");

    if (barraPM && textoPM) {
        const porcentaje = Math.max(0, Math.min(100, (personaje.pm / personaje.pmMax) * 100));
        barraPM.style.width = porcentaje + "%";
        textoPM.textContent = `PM: ${personaje.pm}/${personaje.pmMax}`;
    }

    // ---------- COS ----------
    const barraCOS = tarjeta.querySelector(".barraCOS");
    const textoCOS = tarjeta.querySelector(".barraCOS")?.closest(".bloqueBarra")?.querySelector(".textoBarra");

    if (barraCOS && textoCOS) {
        const porcentaje = Math.max(0, Math.min(100, (personaje.cosmosActual / personaje.cosmosMax) * 100));
        barraCOS.style.width = porcentaje + "%";
        textoCOS.textContent = `COS: ${personaje.cosmosActual}`;
    }
}

// Cada vez que cambiás cantidad de guerreros o formación:
function sincronizarTodo() {
    recalcularFormacionDesdeSlots();
    actualizarUIBatalla();
}

// Marca la tarjeta cuando sea su turno:
function marcarTarjetaActiva(slot) {
    document.querySelectorAll(".tarjetaPersonaje").forEach(t => {
        t.classList.remove("tarjetaActiva");
    });

    const activa = document.querySelector(`.tarjetaPersonaje[data-slot="${slot}"]`);
    if (activa) activa.classList.add("tarjetaActiva");
}

function actualizarUIBatalla() {
    crearTarjetasCaballeros();
    cargarFormacionEnTablero();
}

//------------------------------------------------------------------------------------------------------------
// ==========================================================
// BACK de la Batalla
// ==========================================================

//Funcion que almacena la informacion de los Caballeros y Enemigos y sus respectivas UBICACIONES que estaran en la batalla:
function crearFormacionCopiaParaBatalla() {
    formacionCopiaEnBatalla = [];

    // Caballeros
    formacionActual.forEach(item => {
        formacionCopiaEnBatalla.push({
            id: item.id,
            tipo: "jugador",
            slot: item.slot,
            fila: item.fila,
            columna: item.columna
        });
    });

    // Enemigos
    const nivel = nivelesHistoria[nivelActual];
    if (nivel?.enemigos) {
        nivel.enemigos.forEach(e => {
            formacionCopiaEnBatalla.push({
                id: e.id,
                tipo: "enemigo",
                fila: e.fila,
                columna: e.columna
            });
        });
    }
}

// Guardamos la info de los que pelearan para despues cargarlos fuera.
let backupEntidadesBatalla = {
    jugadores: [],
    enemigos: []
};

function guardarInfoBackUp() {

    backupEntidadesBatalla = {
        jugadores: [],
        enemigos: []
    };

    formacionCopiaEnBatalla.forEach(item => {

        let entidad;

        if (item.tipo === "jugador") {
            entidad =
                caballerosBronce.find(c => c.id === item.id) ||
                caballerosPlata?.find(c => c.id === item.id) ||
                caballerosOro?.find(c => c.id === item.id);
        } else {
            entidad = enemigos.find(e => e.id === item.id);
        }

        if (!entidad) return;

        const copia = {
            id: entidad.id,
            pv: entidad.pv,
            pvMax: entidad.pvMax,
            pm: entidad.pm,
            pmMax: entidad.pmMax,
            cosmosActual: entidad.cosmosActual,
            cosmosMax: entidad.cosmosMax,
            estado: entidad.estado
        };

        if (item.tipo === "jugador") {
            backupEntidadesBatalla.jugadores.push(copia);
        } else {
            backupEntidadesBatalla.enemigos.push(copia);
        }
    });
}

function cargarInfoBackUp() {

    backupEntidadesBatalla.jugadores.forEach(data => {

        const entidad =
            caballerosBronce.find(c => c.id === data.id) ||
            caballerosPlata?.find(c => c.id === data.id) ||
            caballerosOro?.find(c => c.id === data.id);

        if (!entidad) return;

        entidad.pv = data.pv;
        entidad.pm = data.pm;
        entidad.cosmosActual = data.cosmosActual;
        entidad.estado = data.estado;
    });

    backupEntidadesBatalla.enemigos.forEach(data => {

        const entidad = enemigos.find(e => e.id === data.id);
        if (!entidad) return;

        entidad.pv = data.pv;
        entidad.pm = data.pm;
        entidad.cosmosActual = data.cosmosActual;
        entidad.estado = data.estado;
    });

    // Limpieza
    backupEntidadesBatalla = {
        jugadores: [],
        enemigos: []
    };
}

//------------------------------------------------------------------------------------------------------------
// ==========================================================
// SISTEMA DE TURNOS
// ==========================================================

let colaTurnos = [];
let indiceTurno = 0;
let entidadTurnoActual = null;
let movimientoUsado = false;

// Se construye la cola de turnos segun la velocidad:
function construirColaTurnos() {
    colaTurnos = [];

    // Caballeros
    obtenerCaballerosUsados().forEach(id => {
        const cab = caballerosBronce.find(c => c.id === id);
        if (cab && cab.estado === 1) {
            colaTurnos.push(cab);
        }
    });

    // Enemigos
    const nivel = nivelesHistoria[nivelActual];
    if (nivel?.enemigos) {
        nivel.enemigos.forEach(data => {
            const enemigo = enemigos.find(e => e.id === data.id);
            if (enemigo && enemigo.estado === 1) {
                colaTurnos.push(enemigo);
            }
        });
    }

    // Ordenar por velocidad
    colaTurnos.sort((a, b) => b.velocidad - a.velocidad);

    indiceTurno = 0;
}

// Iniciar Turno:
function iniciarTurno() {
    if (!colaTurnos.length) return;

    entidadTurnoActual = colaTurnos[indiceTurno];

    if (entidadTurnoActual.estado !== 1) {
        finalizarTurno();
        return;
    }

    // 🔑 ACÁ: al comenzar su turno vuelve a sprite normal
    restaurarSpriteNormal(entidadTurnoActual);

    aplicarEstadosPasivos(entidadTurnoActual);

    if (entidadTurnoActual.estado !== 1) {
        finalizarTurno();
        return;
    }

    if (!entidadPuedeActuar(entidadTurnoActual)) {
        console.log(`${entidadTurnoActual.nombre} no puede actuar este turno.`);
        finalizarTurno();  // ⚠️ Importante: avanzar el turno
        return;
    }

    if (entidadTurnoActual.tipo === "jugador") {
        iniciarTurnoJugador(entidadTurnoActual);
    } else {
        iniciarTurnoEnemigo(entidadTurnoActual);
    }
}

// Turno del jugador (Se habilitan los botones):
function iniciarTurnoJugador(jugador) {
    const slot = obtenerCaballerosUsados().indexOf(jugador.id) + 1;
    marcarTarjetaActiva(slot);

    movimientoUsado = false;

    desbloquearBotonesJugador();

    sonidoTurnoJugador.currentTime = 0;
    sonidoTurnoJugador.play().catch(() => {});
}


// Turno del enemigo (Espera 2 segundos y luego juega):
function iniciarTurnoEnemigo(enemigo) {

    limpiarTarjetaActiva();

    btnMoverse.disabled = true;
    btnHabilidades.disabled = true;

    if (enemigo.estado !== 1) { // Si ya murió, terminar turno
        finalizarTurno();
        return;
    }

    setTimeout(() => {
        ejecutarTurnoEnemigo(enemigo);
    }, 3000);
}

// Finaliza el turno y pasa al que sigue:
function finalizarTurno() {
    limpiarCasillasMovimiento();
    bloquearBotonesJugador();

    indiceTurno++;
    if (indiceTurno >= colaTurnos.length) {
        indiceTurno = 0;
    }

    iniciarTurno();
}

// Las tarjetas de turnos se despintan:
function limpiarTarjetaActiva() {
    document.querySelectorAll(".tarjetaPersonaje").forEach(t => {
        t.classList.remove("tarjetaActiva");
    });
}

//------------------------------------------------------------------------------------------------------------
// ==========================================================
// MOVERSE
// ==========================================================

let modoMovimientoActivo = false; // Flag del estado del movimiento

// Creo aca el Delay (principalmente para la CPU):
function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Mostrar casillas adyacentes:
function mostrarCasillasMovimiento() {

    limpiarCasillasMovimiento();

    const pos = obtenerPosicionEntidad(entidadTurnoActual);
    if (!pos) return;

    modoMovimientoActivo = true; // 👈 ACTIVAMOS MODO

    const dirs = [
        { f: -1, c: 0 },
        { f: 1, c: 0 },
        { f: 0, c: -1 },
        { f: 0, c: 1 }
    ];

    dirs.forEach(d => {
        const f = pos.fila + d.f;
        const c = pos.columna + d.c;

        const celda = obtenerCelda(f, c);
        if (!celda) return;
        if (celda.dataset.id) return;

        celda.classList.add("celdaMovible");
        celda.addEventListener("click", moverEntidad, { once: true });
    });
}

// Si el usuario se retracta y decide cancelar el movimiento:
function cancelarMovimiento() {
    if (!modoMovimientoActivo) return;

    modoMovimientoActivo = false;
    limpiarCasillasMovimiento();
}

// Lo que sucede si tocamos fuera de la pantalla:
document.addEventListener("click", (e) => {

    if (!modoMovimientoActivo) return;

    // Si clickeó una celda movible, NO cancelar
    if (e.target.classList.contains("celdaMovible")) return;

    // Si clickeó dentro del tablero, pero no en celda válida → cancelar
    const dentroDelTablero = e.target.closest(".tableroGuerra");
    if (dentroDelTablero) {
        cancelarMovimiento();
        return;
    }

    // Click en botones u otro lado
    cancelarMovimiento();
});

// Limpia los casilleros amarillos:
function limpiarCasillasMovimiento() {
    document.querySelectorAll(".celdaMovible").forEach(celda => {
        celda.classList.remove("celdaMovible");
        celda.replaceWith(celda.cloneNode(true));
    });
}

// Funcion MOVER:
function moverEntidad(e) {

    if (movimientoUsado) return;

    const celdaDestino = e.currentTarget;
    const pos = obtenerPosicionEntidad(entidadTurnoActual);

    // actualizar lógica
    const item = formacionCopiaEnBatalla.find(f => f.id === entidadTurnoActual.id);
    if (!item) return;

    // limpiar dataset origen
    const origen = obtenerCelda(pos.fila, pos.columna);
    delete origen.dataset.id;
    delete origen.dataset.tipo;

    // setear destino
    item.fila = Number(celdaDestino.dataset.fila);
    item.columna = Number(celdaDestino.dataset.columna);

    celdaDestino.dataset.id = entidadTurnoActual.id;
    celdaDestino.dataset.tipo = entidadTurnoActual.tipo;

    // mover sprite en capa 2
    const img = document.querySelector(
        `.imgEntidadBatalla[data-id="${entidadTurnoActual.id}"]`
    );
    posicionarSpriteEnCapa(img, item.fila, item.columna);

    movimientoUsado = true;
    modoMovimientoActivo = false;

    limpiarCasillasMovimiento();
    btnMoverse.disabled = true;
}

// Obtiene la ubicacion de los caballeros y enemigos, y los guarda en formacionCopia:
function obtenerPosicionEntidad(entidad) {
    return formacionCopiaEnBatalla.find(f => f.id === entidad.id) ?? null;
}


//---------------------------------------------------------------------------------------------------------
const btnMoverse = document.getElementById("btnMoverse");
const btnHabilidades = document.getElementById("btnHabilidades");

// Cuando apreto el BOTON_MOVERSE:
btnMoverse.addEventListener("click", (e) => {
    e.stopPropagation();

    if (!entidadTurnoActual) return;
    if (entidadTurnoActual.tipo !== "jugador") return;
    if (movimientoUsado) return;

    mostrarCasillasMovimiento();
});

// Cuando apreto el BOTON_HABILIDADES:
btnHabilidades.addEventListener("click", (e) => {
    e.stopPropagation();

    if (!entidadTurnoActual) return;
    if (entidadTurnoActual.tipo !== "jugador") return;

    cancelarMovimiento();
    mostrarPopupAtaques(entidadTurnoActual);
});

//-------------------------------------------------------------------------------------------------------
// ==========================================================
// LA IA SE MUEVE:
// ==========================================================

//Se fija si puede moverserse dependiendo de si su estado está ALTERADO:
function entidadPuedeActuar(entidad) {
    if (!entidad.estadosAlterados?.length) return true;

    const estadoBloqueante = entidad.estadosAlterados.find(
        e => ESTADOS_INCAPACITANTES.includes(e.tipo)
    );

    if (!estadoBloqueante) return true;

    console.log(
        `${entidad.nombre} está incapacitado por ${obtenerEstadoPorId(estadoBloqueante.tipo)}. Turnos restantes: ${estadoBloqueante.turnos}`
    );

    // ⚠️ NO reducir turnos aquí
    // Se reducirá al final de su turno en aplicarEstadosPasivos o función similar

    return false;
}

// Busca a los caballeros que esten vivos:
function obtenerCaballerosVivos() {
    return formacionCopiaEnBatalla
        .filter(e => e.tipo === "jugador")
        .map(e => {
            return caballerosBronce.find(c => c.id === e.id)
                ?? caballerosPlata?.find(c => c.id === e.id)
                ?? caballerosOro?.find(c => c.id === e.id);
        })
        .filter(c => c && c.estado === 1);
}

// Busca al caballero mas cercano:
function obtenerObjetivoMasCercano(enemigo) {
    const posEnemigo = obtenerPosicionEntidad(enemigo);
    if (!posEnemigo) return null;

    let objetivo = null;
    let distanciaMin = Infinity;

    obtenerCaballerosVivos().forEach(cab => {
        const posCab = obtenerPosicionEntidad(cab);
        if (!posCab) return;

        const dist = calcularDistancia(posEnemigo, posCab);
        if (dist < distanciaMin) {
            distanciaMin = dist;
            objetivo = cab;
        }
    });

    return objetivo;
}

function calcularMovimientoHacia(enemigo, objetivo) {

    const posE = obtenerPosicionEntidad(enemigo);
    const posO = obtenerPosicionEntidad(objetivo);
    if (!posE || !posO) return null;

    const opciones = [];

    if (posO.fila < posE.fila) opciones.push({ f: -1, c: 0 });
    if (posO.fila > posE.fila) opciones.push({ f: 1, c: 0 });
    if (posO.columna < posE.columna) opciones.push({ f: 0, c: -1 });
    if (posO.columna > posE.columna) opciones.push({ f: 0, c: 1 });

    for (const dir of opciones) {
        const f = posE.fila + dir.f;
        const c = posE.columna + dir.c;

        const celda = obtenerCelda(f, c);
        if (!celda) continue;
        if (celda.dataset.id) continue;

        return { fila: f, columna: c };
    }

    return null;
}

function moverEnemigo(enemigo, destino) {

    const item = formacionCopiaEnBatalla.find(f => f.id === enemigo.id);
    if (!item) return;

    const origen = obtenerCelda(item.fila, item.columna);
    delete origen.dataset.id;
    delete origen.dataset.tipo;

    item.fila = destino.fila;
    item.columna = destino.columna;

    const celdaDestino = obtenerCelda(destino.fila, destino.columna);
    celdaDestino.dataset.id = enemigo.id;
    celdaDestino.dataset.tipo = "enemigo";

    const img = document.querySelector(
        `.imgEntidadBatalla[data-id="${enemigo.id}"]`
    );
    posicionarSpriteEnCapa(img, item.fila, item.columna);
}

// El enemigo termina decidiendo ACA todo lo que hace:
async function ejecutarTurnoEnemigo(enemigo) {
    console.log(`\n=== Turno de ${enemigo.nombre} ===`);

    if (enemigo.estado !== 1) {
        console.log(`${enemigo.nombre} está muerto. Fin de turno.`);
        finalizarTurno();
        return;
    }

    if (!entidadPuedeActuar(enemigo)) {
        console.log(`${enemigo.nombre} no puede actuar este turno.`);
        // ⚠️ Reducimos los turnos de estados bloqueantes al final
        enemigo.estadosAlterados.forEach(e => {
            if (ESTADOS_INCAPACITANTES.includes(e.tipo)) {
                e.turnos--;
            }
        });
        enemigo.estadosAlterados = enemigo.estadosAlterados.filter(e => e.turnos > 0);
        finalizarTurno();
        return;
    }

    const objetivo = obtenerObjetivoMasCercano(enemigo);
    if (!objetivo) {
        console.log(`${enemigo.nombre} no tiene objetivo. Fin de turno.`);
        finalizarTurno();
        return;
    }

    console.log(`${enemigo.nombre} apunta a ${objetivo.nombre}`);

    let ataque = obtenerAtaqueUsable(enemigo, objetivo);
    if (!ataque) {
        const movimiento = calcularMovimientoHacia(enemigo, objetivo);
        if (movimiento) {
            moverEnemigo(enemigo, movimiento);
            await esperar(1500);
        }
        ataque = obtenerAtaqueUsable(enemigo, objetivo);
    }

    if (ataque) {
        await new Promise(resolve => {
            ejecutarAtaqueConDelayAudio(enemigo, objetivo, ataque, resolve);
        });

        await esperar(2000);

    } else {
        enemigoDefenderse(enemigo);
        await esperar(1500);
    }

    // ⚠️ Reducir turnos de estados incapacitantes al final
    enemigo.estadosAlterados.forEach(e => {
        if (ESTADOS_INCAPACITANTES.includes(e.tipo)) e.turnos--;
    });
    enemigo.estadosAlterados = enemigo.estadosAlterados.filter(e => e.turnos > 0);

    finalizarTurno();
}

//-------------------------------------------------------------------------------------------------------
// ==========================================================
// GANAR COSMO POR ACCION:
// ==========================================================
function ganarCosmosPorAccion(personaje, accion) {

    let cantidad = 0;

    switch (accion) {
        case "atacar":
            cantidad = 10;
            break;

        case "atacar-fallido":
            cantidad = 5;
            break;

        case "defender":
            cantidad = 5;
            break;

        case "concentrar":
            cantidad = 15;
            break;

        default:
            return;
    }

    personaje.cosmosActual = Math.min(
        personaje.cosmosMax,
        personaje.cosmosActual + cantidad
    );
}

function subirCosmos(personaje, cantidad) {
    personaje.cosmosActual = Math.min(
        personaje.cosmosMax,
        personaje.cosmosActual + cantidad
    );
}

// Funcion que mientras mas cosmo tengas, mas fuerte pegas:
function obtenerBonusDañoPorCosmo(personaje) {
    const cosmo = personaje.cosmosActual;
    let bonus = 0;
    if (cosmo >= 25) bonus += 1;
    if (cosmo >= 50) bonus += 2;
    if (cosmo >= 75) bonus += 3;
    if (cosmo >= 100) bonus += 4;

    // Séptimo sentido potencia el bonus
    if (personaje.septimoSentido) {
        bonus = Math.floor(bonus * 1.5);
    }

    return bonus;
}

//-------------------------------------------------------------------------------------------------------
// ==========================================================
// ATACAR AL ENEMIGO:
// ==========================================================

let ataqueSeleccionado = null;
let atacanteActivo = null;
let modoSeleccionObjetivo = false;

// Revisa si tiene PM o COSMO antes de permitirle usar el ataque:
function puedeUsarAtaque(personaje, ataque) {
    if (ataque.pmNecesaria && personaje.pm < ataque.pmNecesaria) return false;
    if (ataque.cosmosNecesario && personaje.cosmosActual < ataque.cosmosNecesario) return false;
    return true;
}

// PopUp que muestra los Ataques del Caballero:
function mostrarPopupAtaques(jugador) {

    const overlay = document.getElementById("overlayPopupAtaques");
    const contenedor = document.getElementById("mostrarAtaques");

    contenedor.innerHTML = "";

    jugador.ataquesDisponibles.forEach(ataque => {

        const div = document.createElement("div");
        div.classList.add("itemAtaque");

        const usable = puedeUsarAtaque(jugador, ataque);
        if (!usable) div.classList.add("ataque-no-disponible");

        // ---------------------
        // LINEA 1: Nombre + Rango
        // ---------------------
        const linea1 = document.createElement("div");
        linea1.classList.add("linea1");

        const textoRango =
            ataque.rangoMin === ataque.rangoMax
                ? `Rango: ${ataque.rangoMin}`
                : `Rango: ${ataque.rangoMin}-${ataque.rangoMax}`;

        linea1.innerHTML = `
            <span>${ataque.nombre}</span>
            <span>[${textoRango}]</span>
        `;

        // ---------------------
        // LINEA 2: PM / COSMO / DAÑO
        // ---------------------
        const linea2 = document.createElement("div");
        linea2.classList.add("linea2");

        const enemigoDummy = {
            defensa: 0,
            defensaMagica: 0,
            pv: 0,
            estadosAlterados: [],
            estado: 1
        };

        const danoEstimado = calcularDaño(jugador, enemigoDummy, ataque);

        linea2.textContent = `PM: ${ataque.pmNecesaria} | COSM: ${ataque.cosmosNecesario} | DAÑO: ~${danoEstimado}`;

        // ---------------------
        // LINEA 3: PREC / Efectos
        // ---------------------
        const linea3 = document.createElement("div");
        linea3.classList.add("linea3");

        let textoEfecto = "";
        if (ataque.efecto?.estado) {
            const estadoInfo = estados.find(e => e.id === ataque.efecto.estado.tipo);
            if (estadoInfo) {
                textoEfecto = ` | Prob. de ${estadoInfo.nombre}`;
            }
        }

        linea3.textContent = `PREC: ${ataque.precision}${textoEfecto}`;

        // ---------------------
        // Añadimos al div
        // ---------------------
        div.appendChild(linea1);
        div.appendChild(linea2);
        div.appendChild(linea3);

        if (usable) {
            div.addEventListener("click", () => {
                overlay.style.display = "none";
                ataqueSeleccionado = ataque;
                atacanteActivo = jugador;
                modoSeleccionObjetivo = true;
                marcarEnemigosPorRango(jugador, ataque);
            });
        }

        contenedor.appendChild(div);
    });

    overlay.style.display = "flex";
}

// Para cerrar el PopUp si se hace click afuera:
document.getElementById("overlayPopupAtaques").addEventListener("click", (e) => {
    if (e.target.id === "overlayPopupAtaques") {
        e.currentTarget.style.display = "none";
    }
});

//Marca
function marcarEnemigosPorRango(atacante, ataque) {
    limpiarMarcadoCeldas();
    modoSeleccionObjetivo = true;

    const celdas = document.querySelectorAll(".celdaGuerra");

    celdas.forEach(celda => {
        const item = formacionCopiaEnBatalla.find(f => f.fila == celda.dataset.fila && f.columna == celda.dataset.columna);
        if (!item || item.tipo !== "enemigo") return;

        const enemigo = obtenerPersonajePorId(item.id);
        if (!enemigo || enemigo.estado !== 1) return;

        const distancia = calcularDistancia(atacante, enemigo);
        if (distancia >= ataque.rangoMin && distancia <= ataque.rangoMax) {
            celda.classList.add("celda-atacable");
            celda.addEventListener("click", onClickCeldaAtacable, { once: true });
        } else {
            celda.classList.add("celda-no-atacable");
        }
    });
}

function onClickCeldaAtacable(e) {

    e.stopPropagation();

    if (!modoSeleccionObjetivo || !ataqueSeleccionado || !atacanteActivo) {
        return;
    }

    const celda = e.currentTarget;
    const id = Number(celda.dataset.id);

    const enemigo = obtenerPersonajePorId(id);
    if (!enemigo || enemigo.estado !== 1) {
        cancelarSeleccionObjetivo();
        return;
    }

    ejecutarAtaqueConDelayAudio(
        atacanteActivo,
        enemigo,
        ataqueSeleccionado,
        () => {
            finalizarSeleccionAtaque();
        }
    );

}

function finalizarSeleccionAtaque() {

    limpiarMarcadoCeldas();

    modoSeleccionObjetivo = false;
    ataqueSeleccionado = null;
    atacanteActivo = null;

    finalizarTurno();
}

// Funcion que si clickeo afuera se cancela y no ataca.
document.addEventListener("click", (e) => {

    if (!modoSeleccionObjetivo) return;

    // Si clickeó una celda atacable, NO cancelar
    const celda = e.target.closest(".celdaGuerra");
    if (celda && celda.classList.contains("celda-atacable")) {
        return;
    }

    // Si clickeó dentro del popup de ataques, NO cancelar
    if (e.target.closest("#overlayPopupAtaques")) {
        return;
    }

    cancelarSeleccionObjetivo();
});

// Limpia las celdas que estan de color verde o rojo:
function limpiarMarcadoCeldas() {
    document.querySelectorAll(".celdaGuerra").forEach(celda => {
        celda.classList.remove("celda-atacable", "celda-no-atacable");
        celda.replaceWith(celda.cloneNode(true)); // 💣 elimina listeners viejos
    });
}

function cancelarSeleccionObjetivo() {
    limpiarMarcadoCeldas();
    modoSeleccionObjetivo = false;
    ataqueSeleccionado = null;
    atacanteActivo = null;
}

function obtenerPersonajePorId(id) {
    const item = formacionCopiaEnBatalla.find(e => e.id === id);
    if (!item) return null;

    if (item.tipo === "jugador") {
        return caballerosBronce.find(c => c.id === id)
            || caballerosPlata?.find(c => c.id === id)
            || caballerosOro?.find(c => c.id === id);
    } else {
        return enemigos.find(e => e.id === id);
    }
}

function calcularDistancia(entidadA, entidadB) {

    const posA = obtenerPosicionEntidad(entidadA);
    const posB = obtenerPosicionEntidad(entidadB);

    if (!posA || !posB) return Infinity;

    return Math.abs(posA.fila - posB.fila) +
           Math.abs(posA.columna - posB.columna);
}

// Calcula el daño que hace al enemigo:
function calcularDaño(atacante, defensor, ataque) {
    const efecto = ataque.efecto;
    let ataqueBase = 0;
    let defensaBase = 0;

    // Determinar ataque base según escala
    switch (efecto.escala) {
        case "fuerza":
            ataqueBase = atacante.fuerza;
            break;
        case "mixto":
            ataqueBase = atacante.fuerza + atacante.poderMagico;
            break;
        case "magico":
            ataqueBase = atacante.poderMagico;
            break;
        default:
            ataqueBase = atacante.fuerza;
    }

    const bonusCosmo = obtenerBonusDañoPorCosmo(atacante);
    ataqueBase += bonusCosmo;

    // Calcular defensa considerando buff temporal
    if (ataque.tipoDaño === "Fisico") {
        defensaBase = obtenerDefensaConBuff(defensor, "fisico");
    } else if (ataque.tipoDaño === "Magico") {
        defensaBase = obtenerDefensaConBuff(defensor, "magico");
    }

    if (efecto.ignoraDefensa) {
        defensaBase *= (1 - efecto.ignoraDefensa);
    }

    return Math.max(
        1,
        Math.floor((ataqueBase * efecto.multiplicador) - defensaBase)
    );
}

function aplicarLogicaAtaque(atacante, objetivo, ataque) {
    if (!objetivo || objetivo.estado !== 1) return;

    // Consumo de recursos
    if (ataque.pmNecesaria > 0) atacante.pm = Math.max(0, atacante.pm - ataque.pmNecesaria);
    if (ataque.cosmosNecesario > 0) atacante.cosmosActual = Math.max(0, atacante.cosmosActual - ataque.cosmosNecesario);

    // Precisión
    const tirada = Math.random() * 100;
    if (tirada > ataque.precision) {
        ganarCosmosPorAccion(atacante, "atacar-fallido");
        actualizarBarrasPersonaje(atacante); // <-- solo actualizamos barras
        return;
    }

    // Daño
    const daño = calcularDaño(atacante, objetivo, ataque);
    objetivo.pv = Math.max(0, objetivo.pv - daño);

    // Efecto visual de daño
    if (daño > 0) {
        limpiarMarcadoCeldas();
        mostrarEfectoDaño(objetivo); // <-- animación en el sprite existente
    }

    // Estados
    if (ataque.efecto?.estado) intentarAplicarEstado(objetivo, ataque.efecto.estado);

    // Sonido herido
    if (objetivo.audio?.herido) {
        new Audio(objetivo.audio.herido).play().catch(() => {});
    }

    // Muerte
    if (objetivo.pv <= 0) derrotarEntidad(objetivo);

    // Cosmos
    ganarCosmosPorAccion(atacante, "atacar");

    // Solo actualizar barras
    actualizarBarrasPersonaje(objetivo);
    actualizarBarrasPersonaje(atacante);
}



// Los ESTADOS aca se APLICAN:
function intentarAplicarEstado(objetivo, estadoDef) {
    if (objetivo.estado !== 1) return;
    const tirada = Math.random() * 100;
    if (tirada > estadoDef.probabilidad) return;

    const yaTiene = objetivo.estadosAlterados.find(e => e.tipo === estadoDef.tipo);
    if (yaTiene) return;

    objetivo.estadosAlterados.push({
        tipo: estadoDef.tipo,
        turnos: estadoDef.duracion ?? 1,
        danio: estadoDef.danio ?? 0,
        aplicadoEsteTurno: true
    });
}

function aplicarEstadosPasivos(entidad) {
    if (!entidad.estadosAlterados?.length) return;

    entidad.estadosAlterados = entidad.estadosAlterados.filter(e => {

        // Daños por turno
        if (e.tipo === 3 || e.tipo === 6) {
            entidad.pv -= e.danio;
        }

        // Buff defensa
        if (e.tipo === "buffDefensa") {

            if (e.aplicadoEsteTurno) {
                e.turnos--;
            }

            // Cuando se termina el buff, restaurar sprite
            if (e.turnos <= 0) {
                restaurarSpriteNormal(entidad);
                return false;
            }
        } else {
            if (!e.aplicadoEsteTurno) e.turnos--;
        }

        e.aplicadoEsteTurno = false;
        return e.turnos > 0;
    });

    if (entidad.pv <= 0) derrotarEntidad(entidad);
}


// Cuando el jugador/enemigo se defiende se le aplica el Buff de defensa:
function aplicarBuffDefensaTemporal(entidad, porcentajeDefensa, porcentajeDefensaMagica) {
    if (!entidad.estadosAlterados) entidad.estadosAlterados = [];

    // Evitar duplicados
    const yaTiene = entidad.estadosAlterados.find(e => e.tipo === "buffDefensa");
    if (yaTiene) {
        yaTiene.turnos = 1; // refrescar duración
        yaTiene.defensa = porcentajeDefensa;
        yaTiene.defensaMagica = porcentajeDefensaMagica;
        return;
    }

    entidad.estadosAlterados.push({
        tipo: "buffDefensa",
        turnos: 1, // dura hasta su próximo turno
        defensa: porcentajeDefensa,
        defensaMagica: porcentajeDefensaMagica,
        aplicadoEsteTurno: false
    });
}

// Funcion que esta dentro de Funcion calcularDaño:
function obtenerDefensaConBuff(entidad, tipo) {
    let base = tipo === "fisico" ? entidad.defensa : entidad.defensaMagica;
    if (!entidad.estadosAlterados) return base;

    const buff = entidad.estadosAlterados.find(e => e.tipo === "buffDefensa");
    if (buff) {
        if (tipo === "fisico") base = Math.floor(base * (1 + buff.defensa / 100));
        else base = Math.floor(base * (1 + buff.defensaMagica / 100));
    }

    return base;
}

// Cuando vencemos al enemigo:
function derrotarEntidad(entidad) {

    if (entidad.estado === 2) return; // evitar doble ejecución

    entidad.estado = 2;
    entidad.pv = 0;
    entidad.estadosAlterados = [];

    console.log(`${entidad.nombre} fue derrotado`);

    // Cambiar imagen en batalla (si existe)
    const img = document.querySelector(
        `.imgEntidadBatalla[data-id="${entidad.id}"]`
    );

    if (img && entidad.imgBatallaDerrotado) {
        img.src = entidad.imgBatallaDerrotado;
        img.classList.add("derrotado");
    }

    // (Opcional pero recomendado)
    construirColaTurnos();
}

function ejecutarAudioAtaque(atacante, ataque) {

    let audioSrc = null;

    if (ataque.audio) {
        audioSrc = ataque.audio;
    } else if (atacante.audio?.ataqueGenerico) {
        audioSrc = atacante.audio.ataqueGenerico;
    } else {
        audioSrc = "/audios/genericos/ataque.wav";
    }

    const audio = new Audio(audioSrc);
    audio.play();

    return audio.duration || 0;
}

function ejecutarAtaqueConAudioSeguro(atacante, objetivo, ataque) {
    // Ejecuta la lógica sin cambiar turno
    aplicarLogicaAtaque(atacante, objetivo, ataque);

    // Reproduce audio
    try {
        const audioSrc = ataque.audio || atacante.audio?.ataqueGenerico || "/audios/genericos/ataque.wav";
        const audio = new Audio(audioSrc);
        audio.play().catch(err => console.warn(`No se pudo reproducir audio: ${audioSrc}`, err));
    } catch (err) {
        console.warn("Error creando objeto Audio:", err);
    }
}

function ejecutarAtaqueConDelayAudio(atacante, objetivo, ataque, onFinish) {

    // 1. Reproducir audio
    let audioSrc =
        ataque.audio ||
        atacante.audio?.ataqueGenerico ||
        "/audios/genericos/ataque.wav";

    const audio = new Audio(audioSrc);
    audio.play().catch(() => {});

    // 2. Duración configurable
    const delay = ataque.duracionAudio ?? 800;

    // 3. Esperar y aplicar lógica
    setTimeout(() => {

        aplicarLogicaAtaque(atacante, objetivo, ataque);

        if (typeof onFinish === "function") {
            onFinish();
        }

    }, delay);
}

// Efectos_Daño > Cuando golpeamos al rival:
function mostrarEfectoDaño(objetivo) {
    const img = document.querySelector(
        `.imgEntidadBatalla[data-id="${objetivo.id}"]`
    );
    if (!img) return;

    // Reinicia la animación si ya estaba
    img.classList.remove("efectoDañoSprite");
    void img.offsetWidth; // fuerza reflow para reiniciar animación

    img.classList.add("efectoDañoSprite");
}

// Mostrar que el personaje se esta defendiendo:
function cambiarSpriteEntidad(entidad, tipo) {
    const img = document.querySelector(
        `.imgEntidadBatalla[data-id="${entidad.id}"]`
    );
    if (!img) return;

    if (tipo === "defensa" && entidad.imgBatallaDefendiendose) {
        img.src = entidad.imgBatallaDefendiendose;
        return;
    }

    // sprite normal
    if (entidad.imgBatalla) {
        img.src = entidad.imgBatalla;
    }
}

function restaurarSpriteNormal(entidad) {
    const img = document.querySelector(
        `.imgEntidadBatalla[data-id="${entidad.id}"]`
    );
    if (!img) return;

    // Si está derrotado, no restaurar
    if (entidad.estado === 2 && entidad.imgBatallaDerrotado) {
        img.src = entidad.imgBatallaDerrotado;
        return;
    }

    img.src = entidad.imgBatalla;
}


//-------------------------------------------------------------------------------------------------------
// ==========================================================
// LA IA ATACA:
// ==========================================================

// Se fija que ataques puede usar segun su constitucion:
function obtenerAtaqueUsable(enemigo, objetivo) {

    const ataques = enemigo.ataquesDisponibles ?? obtenerAtaquesDelPersonaje(enemigo);
    if (!ataques.length) return null;

    const distancia = calcularDistancia(enemigo, objetivo);

    // Filtrar ataques posibles
    const posibles = ataques.filter(a =>
        distancia >= a.rangoMin &&
        distancia <= a.rangoMax &&
        enemigo.pm >= a.pmNecesaria &&
        enemigo.cosmosActual >= a.cosmosNecesario
    );

    if (!posibles.length) return null;

    // 🧠 IA simple: elige el de mayor multiplicador
    posibles.sort((a, b) => b.efecto.multiplicador - a.efecto.multiplicador);

    return posibles[0];
}

// Cuando la IA Se defiende:
function enemigoDefenderse(enemigo) {
    console.log(`${enemigo.nombre} se está defendiendo`);

    aplicarBuffDefensaTemporal(enemigo, 15, 15);
    cambiarSpriteEntidad(enemigo, "defensa");

    ganarCosmosPorAccion(enemigo, "defender");
    actualizarUIBatalla();
}


//-----------------------------------------------------------------------------------------------------------
// ==========================================================
// EL JUGADOR SE DEFIENDE O CONCENTRA:
// ==========================================================

const btnOtras = document.getElementById("btnOtras");
const overlayOtras = document.getElementById("overlayPopupOtras");
const mostrarOtras = document.getElementById("mostrarOtras");

btnOtras.addEventListener("click", (e) => {
    e.stopPropagation();

    // Limpia casilleros si quiere atacar o si quiere moverse y toca el btn Otras:
    limpiarMarcadoCeldas();
    limpiarCasillasMovimiento();

    if (!entidadTurnoActual) return;
    if (entidadTurnoActual.tipo !== "jugador") return;

    mostrarOtras.innerHTML = "";

    // ----------------- CONCENTRARSE -----------------
    crearOpcionOtras(
        "Concentrarse",
        ["Otorga COSMO +15"],
        () => {
            console.log(`El ${entidadTurnoActual.nombre} se está concentrando`);

            // Cierra el popup inmediatamente
            cerrarPopupOtras();

            // Reproducir audio de concentrarse
            if (entidadTurnoActual.audio?.concentrandose) {
                new Audio(entidadTurnoActual.audio.concentrandose).play().catch(() => {});
            }

            // Aplicar lógica después del delay
            setTimeout(() => {
                ganarCosmosPorAccion(entidadTurnoActual, "concentrar");
                actualizarBarrasPersonaje(entidadTurnoActual);
                finalizarTurno();
            }, 1500);
        }
    );

    // ----------------- DEFENDERSE -----------------
    crearOpcionOtras(
        "Defenderse",
        ["Otorga DEF +15%", "Otorga COSMO +5"],
        () => {
            cerrarPopupOtras();

            if (entidadTurnoActual.audio?.defendiendose) {
                new Audio(entidadTurnoActual.audio.defendiendose).play().catch(() => {});
            }

            // Aplica buff temporal de defensa
            aplicarBuffDefensaTemporal(entidadTurnoActual, 15, 15);
            cambiarSpriteEntidad(entidadTurnoActual, "defensa");

            // Gana cosmos
            ganarCosmosPorAccion(entidadTurnoActual, "defender");
            actualizarBarrasPersonaje(entidadTurnoActual);

            finalizarTurno();
        }
    );

    overlayOtras.style.display = "flex";
});


// Frases Clickeables:
function crearOpcionOtras(titulo, descripciones, accion) {

    const div = document.createElement("div");
    div.classList.add("itemOtras");

    // Línea principal (negrita)
    const linea1 = document.createElement("div");
    linea1.classList.add("linea1");
    linea1.textContent = titulo;
    div.appendChild(linea1);

    // Líneas descriptivas (cursiva)
    descripciones.forEach(texto => {
        const linea = document.createElement("div");
        linea.classList.add("linea2");
        linea.textContent = texto;
        div.appendChild(linea);
    });

    div.addEventListener("click", (e) => {
        e.stopPropagation();
        accion();
    });

    mostrarOtras.appendChild(div);
}

// Cierra el PopupOtras por clickear afuera:
overlayOtras.addEventListener("click", (e) => {
    if (e.target === overlayOtras) {
        cerrarPopupOtras();
    }
});

function cerrarPopupOtras() {
    overlayOtras.style.display = "none";
    mostrarOtras.innerHTML = "";
}



//----------------------------------------------------------------------------------------------------------------------------------
// ==========================================================
// Funciones de bloquear y desbloquear los botones del tablero de abajo:
// ==========================================================

function bloquearBotonesJugador() {
    btnHabilidades.disabled = true;
    btnMoverse.disabled = true;
    btnOtras.disabled = true;
    btnSalirBatalla.disabled = true;
}

function desbloquearBotonesJugador() {
    if (!entidadTurnoActual || entidadTurnoActual.tipo !== "jugador") return;

    btnHabilidades.disabled = false;
    btnMoverse.disabled = false;
    btnOtras.disabled = false;
    btnSalirBatalla.disabled = false;
}


























//----------------------------------------------------------------------------------------------------------------------------------
// ==========================================================
// PAGINA_TESTEAR
// ==========================================================

// Botones de habilitar slots
const btnSlot2 = document.getElementById("slot_2");
const btnSlot3 = document.getElementById("slot_3");
const btnSlot4 = document.getElementById("slot_4");
const btnSlot5 = document.getElementById("slot_5");

// Habilitar slot 2
btnSlot2.addEventListener("click", () => {
    setCantidadGuerreros(2);
});

// Habilitar slot 3
btnSlot3.addEventListener("click", () => {
    setCantidadGuerreros(3);
});

// Habilitar slot 4
btnSlot4.addEventListener("click", () => {
    setCantidadGuerreros(4);
});

// Habilitar slot 5
btnSlot5.addEventListener("click", () => {
    setCantidadGuerreros(5);
});









