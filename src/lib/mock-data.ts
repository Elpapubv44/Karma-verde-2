import type {
  Premio,
  Guia,
  EtapaCircuito,
  PuntoVerde,
  RankingRow,
  CanjeTicket,
  EntregaReciclaje,
  MetaComunitariaEscolar,
  QuizPregunta,
} from "./types";

export const seedPremios: Premio[] = [
  {
    id: "p1",
    nombre: "Kit de Plantines Nativos",
    descripcion:
      "3 plantines de flora autóctona con macetas biodegradables para el huerto escolar.",
    puntos: 250,
    imagen: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&auto=format",
    stock: 12,
    categoria: "ecologico",
  },
  {
    id: "p2",
    nombre: "Cuaderno Artesanal Reciclado",
    descripcion:
      "Cuaderno de 80 hojas lisas fabricado con fibras recuperadas y tapa de kraft prensado.",
    puntos: 400,
    imagen: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600&auto=format",
    stock: 30,
    categoria: "utiles",
  },
  {
    id: "p3",
    nombre: "Botella Térmica de Acero Inox",
    descripcion: "Termo de 500ml libre de BPA para eliminar plásticos de un solo uso en el aula.",
    puntos: 900,
    imagen: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format",
    stock: 8,
    categoria: "ecologico",
  },
  {
    id: "p4",
    nombre: "Pase a Huerta Comunitaria y Taller",
    descripcion: "Visita guiada para 2 personas con taller práctico de compostaje y lombricultura.",
    puntos: 150,
    imagen: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format",
    stock: 45,
    categoria: "experiencias",
  },
  {
    id: "p5",
    nombre: "Set de Lápices Plantables",
    descripcion: "Pack de 6 lápices con cápsula de semillas de aromáticas en el extremo.",
    puntos: 320,
    imagen: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format",
    stock: 25,
    categoria: "utiles",
  },
  {
    id: "p6",
    nombre: "Mochila de Tejido rPET Reciclado",
    descripcion: "Mochila escolar confeccionada con tejido 100% de botellas plásticas recicladas.",
    puntos: 1200,
    imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format",
    stock: 5,
    categoria: "escolar",
  },
];

export const seedGuias: Guia[] = [
  {
    id: "g1",
    titulo: "¿Cómo clasificar el Plástico PET (1)?",
    categoria: "Plásticos",
    contenido:
      "El PET (Polietileno Tereftalato) se encuentra en botellas de agua, gaseosas y jugos. Pasos obligatorios: vaciar, enjuagar, quitar etiquetas plásticas no reciclables, aplastar para reducir volumen al 70% y colocar la tapita aparte.",
    icono: "🧴",
  },
  {
    id: "g2",
    titulo: "Plásticos PEAD / HDPE (2) en el hogar",
    categoria: "Plásticos",
    contenido:
      "Envases rígidos de shampoo, lavandina, detergente y lácteos. Son plásticos de alta densidad muy cotizados por recicladores para fabricar nuevos caños y cajones.",
    icono: "🧴",
  },
  {
    id: "g3",
    titulo: "Papel y Cartón: Regla del 'Limpio y Seco'",
    categoria: "Celulosa",
    contenido:
      "Cajas, diarios, hojas de carpeta y folletos. El papel engrasado (como cajas de pizza con aceite) o mojado pudre la pulpa y debe ir al compost o basura común.",
    icono: "📦",
  },
  {
    id: "g4",
    titulo: "Metales y Latas de Aluminio",
    categoria: "Metales",
    contenido:
      "El aluminio es 100% reciclable de forma infinita. Aplastá las latas para optimizar el transporte logístico hacia la fundición.",
    icono: "🥫",
  },
];

export const seedQuizPreguntas: QuizPregunta[] = [
  {
    id: "q1",
    pregunta: "¿Qué se debe hacer antes de depositar una botella PET en el contenedor escolar?",
    opciones: [
      "Dejarla con líquido y tapa bien cerrada",
      "Vaciarla, enjuagarla, aplastarla y separar la tapa",
      "Cortarla en pedazos pequeños con tijera",
      "Pintarla de color verde",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El plástico debe estar libre de líquidos orgánicos y compactado para maximizar el rendimiento del fardo y evitar olores.",
    puntosPremio: 50,
  },
  {
    id: "q2",
    pregunta:
      "¿Por qué una caja de pizza con restos de queso y grasa NO se puede reciclar con el cartón común?",
    opciones: [
      "Porque el cartón se vuelve muy pesado",
      "Porque las grasas y aceites contaminan las fibras de celulosa e impiden su reprocesamiento",
      "Porque los recicladores prefieren cajas blancas",
      "Porque atrae imanes en la planta",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El aceite se adhiere a las fibras e impide que se mezclen con el agua en el pulper de reciclaje.",
    puntosPremio: 50,
  },
  {
    id: "q3",
    pregunta: "¿Cuántas veces se puede reciclar el aluminio de una lata de bebida?",
    opciones: ["Solo 2 veces", "Hasta 5 veces", "Infinitas veces sin perder calidad", "1 sola vez"],
    respuestaCorrecta: 2,
    explicacion:
      "El aluminio conserva el 100% de sus propiedades metalúrgicas tras cada ciclo de fundición.",
    puntosPremio: 50,
  },
];

export const seedMetasComunitarias: MetaComunitariaEscolar[] = [
  {
    id: "mc1",
    escuela: "E.E.S.T. N° 3 Roberto Arlt",
    titulo: "Desbloqueo de 3 Bancos de Madera Plástica para el Patio",
    recompensa: "3 Bancos ecológicos fabricados con 300 kg de plástico reciclado",
    metaKg: 300,
    acumuladoKg: 215,
    fechaLimite: "2026-09-30",
    estado: "en_progreso",
  },
  {
    id: "mc2",
    escuela: "Colegio Belgrano Day",
    titulo: "Instalación de Punto Solar de Carga Escolar",
    recompensa: "Estación de carga solar para celulares con techumbre reciclada",
    metaKg: 400,
    acumuladoKg: 380,
    fechaLimite: "2026-09-15",
    estado: "en_progreso",
  },
  {
    id: "mc3",
    escuela: "Instituto San Martín",
    titulo: "Renovación de Pintura Ecológica para Biblioteca",
    recompensa: "10 latas de pintura ecológica al agua para aulas",
    metaKg: 250,
    acumuladoKg: 250,
    fechaLimite: "2026-08-31",
    estado: "alcanzada",
  },
];

export const seedCanjeTickets: CanjeTicket[] = [
  {
    id: "tk-101",
    usuarioId: "u1",
    usuarioNombre: "Sofía Morales",
    escuela: "E.E.S.T. N° 3 Roberto Arlt",
    premioId: "p2",
    premioNombre: "Cuaderno Artesanal Reciclado",
    puntosGastados: 400,
    codigoVoucher: "KV-TKT-9842A",
    fechaCanje: "2026-08-18",
    fechaVencimiento: "2026-09-18",
    estado: "pendiente_retiro",
  },
  {
    id: "tk-102",
    usuarioId: "u1",
    usuarioNombre: "Sofía Morales",
    escuela: "E.E.S.T. N° 3 Roberto Arlt",
    premioId: "p1",
    premioNombre: "Kit de Plantines Nativos",
    puntosGastados: 250,
    codigoVoucher: "KV-TKT-5512B",
    fechaCanje: "2026-08-10",
    fechaVencimiento: "2026-09-10",
    estado: "entregado",
    entregadoPor: "Prof. Carlos Vera",
  },
];

export const seedEntregas: EntregaReciclaje[] = [
  {
    id: "ent-1",
    alumnoId: "u1",
    alumnoNombre: "Sofía Morales",
    escuela: "E.E.S.T. N° 3 Roberto Arlt",
    tipoPlastico: "PET",
    pesoKg: 3.5,
    puntosOtorgados: 175,
    hashToken: "0x8fa37b8d4c9e",
    fecha: "2026-08-19 14:20",
    estado: "validada",
    validadoPor: "Punto Verde Escolar Automatizado",
  },
  {
    id: "ent-2",
    alumnoId: "u1",
    alumnoNombre: "Sofía Morales",
    escuela: "E.E.S.T. N° 3 Roberto Arlt",
    tipoPlastico: "Cartón",
    pesoKg: 5.0,
    puntosOtorgados: 150,
    hashToken: "0x3e19fa44bc71",
    fecha: "2026-08-18 10:15",
    estado: "validada",
    validadoPor: "Punto Verde Escolar Automatizado",
  },
  {
    id: "ent-3",
    alumnoId: "u2",
    alumnoNombre: "Mateo Fernández",
    escuela: "E.E.S.T. N° 3 Roberto Arlt",
    tipoPlastico: "PEAD",
    pesoKg: 4.2,
    puntosOtorgados: 210,
    hashToken: "0x99cb10af4112",
    fecha: "2026-08-19 11:30",
    estado: "validada",
    validadoPor: "Punto Verde Escolar Automatizado",
  },
];

export const seedCircuito: EtapaCircuito[] = [
  {
    orden: 1,
    id: "c1",
    titulo: "Separación y Depósito Escolar",
    descripcion:
      "El estudiante clasifica sus plásticos limpios y secos en el punto verde escolar con validación de QR criptográfico.",
    estado: "activa",
  },
  {
    orden: 2,
    id: "c2",
    titulo: "Pesaje, Certificación y Remito",
    descripcion:
      "El referente ambiental y la cooperativa asociada pesan el lote en balanza calibrada y emiten el remito digital de trazabilidad.",
    estado: "activa",
  },
  {
    orden: 3,
    id: "c3",
    titulo: "Compactado, Molienda y Lavado",
    descripcion:
      "En planta, el plástico se enfarda, se tritura en escamas (flakes) y pasa por tinas de densimetría para separar polímeros.",
    estado: "en_proceso",
  },
  {
    orden: 4,
    id: "c4",
    titulo: "Peletizado y Transformación",
    descripcion:
      "Las escamas fundidas se convierten en pellets de plástico reciclado (rPET/rPEAD) listos para nueva inyección.",
    estado: "pendiente",
  },
  {
    orden: 5,
    id: "c5",
    titulo: "Nuevo Producto y Retorno Escolar",
    descripcion:
      "El material vuelve como bancos escolares de madera plástica, mochilas y útiles para los estudiantes.",
    estado: "pendiente",
  },
];

export const seedPuntosVerdes: PuntoVerde[] = [
  {
    id: "pv1",
    nombre: "Contenedor Inteligente E.E.S.T. N° 3",
    escuela: "E.E.S.T. N° 3 Roberto Arlt",
    lat: -34.6037,
    lng: -58.3816,
    materiales: ["PET", "PEAD", "Cartón", "Aluminio"],
    puntosAcumulados: 1420,
  },
  {
    id: "pv2",
    nombre: "Estación Ecológica Belgrano Day",
    escuela: "Colegio Belgrano Day",
    lat: -34.5615,
    lng: -58.4563,
    materiales: ["PET", "PEAD", "Cartón"],
    puntosAcumulados: 980,
  },
  {
    id: "pv3",
    nombre: "Punto Verde San Martín",
    escuela: "Instituto San Martín",
    lat: -34.5772,
    lng: -58.5369,
    materiales: ["PET", "Aluminio", "PEBD"],
    puntosAcumulados: 650,
  },
];

export const seedUsers = [
  {
    id: "u1",
    nombre: "Sofía Morales",
    email: "sofia@escuela.edu.ar",
    password: "Password123!",
    rol: "alumno" as const,
    escuela: "E.E.S.T. N° 3 Roberto Arlt",
    curso: "5° Año Informática",
    puntos: 850,
    canjes: 3,
  },
  {
    id: "u2",
    nombre: "Mateo Fernández",
    email: "mateo@escuela.edu.ar",
    password: "Password123!",
    rol: "alumno" as const,
    escuela: "E.E.S.T. N° 3 Roberto Arlt",
    curso: "4° Año Electromecánica",
    puntos: 720,
    canjes: 2,
  },
  {
    id: "u3",
    nombre: "Lucía Gómez",
    email: "lucia@escuela.edu.ar",
    password: "Password123!",
    rol: "alumno" as const,
    escuela: "Colegio Belgrano Day",
    curso: "3° Año A",
    puntos: 590,
    canjes: 1,
  },
  {
    id: "u4",
    nombre: "Joaquín Ruiz",
    email: "joaquin@escuela.edu.ar",
    password: "Password123!",
    rol: "alumno" as const,
    escuela: "Instituto San Martín",
    curso: "6° Año Ciencias",
    puntos: 440,
    canjes: 1,
  },
  {
    id: "u5",
    nombre: "Valentina Paz",
    email: "valentina@escuela.edu.ar",
    password: "Password123!",
    rol: "alumno" as const,
    escuela: "Escuela Técnica N° 1",
    curso: "2° Año B",
    puntos: 310,
    canjes: 0,
  },
  {
    id: "u-creador",
    nombre: "Prof. Carlos Vera",
    email: "creador@karmaverde.org",
    password: "Password123!",
    rol: "creador" as const,
    escuela: "E.E.S.T. N° 3 Roberto Arlt",
    puntos: 0,
    canjes: 0,
  },
  {
    id: "u-superior",
    nombre: "Directora Elena Rossi",
    email: "superior@karmaverde.org",
    password: "Password123!",
    rol: "superior" as const,
    escuela: "Distrito Escolar 14",
    puntos: 0,
    canjes: 0,
  },
  {
    id: "u-asociado",
    nombre: "Cooperativa Verde Sur",
    email: "logistica@verdesur.org",
    password: "Password123!",
    rol: "asociado" as const,
    escuela: "Planta de Tratamiento Sur",
    puntos: 0,
    canjes: 0,
  },
];

export const seedTareas = [
  {
    id: "t1",
    titulo: "Retiro de Lote Fardos PET #402",
    escuela: "E.E.S.T. N° 3 Roberto Arlt",
    material: "PET y Cartón",
    meta: 100,
    progreso: 85,
    estado: "completada" as const,
    responsable: "Cooperativa Verde Sur",
  },
  {
    id: "t2",
    titulo: "Recolección Lote HDPE y Tapas",
    escuela: "Colegio Belgrano Day",
    material: "Plásticos PEAD y Aluminio",
    meta: 80,
    progreso: 45,
    estado: "en_curso" as const,
    responsable: "Cooperativa Verde Sur",
  },
  {
    id: "t3",
    titulo: "Pesaje y Auditoría Trimestral",
    escuela: "Instituto San Martín",
    material: "Papel de oficina y cartón",
    meta: 120,
    progreso: 30,
    estado: "pendiente" as const,
    responsable: "Cooperativa Verde Sur",
  },
];

export const seedRanking: RankingRow[] = seedUsers
  .filter((u) => u.rol === "alumno")
  .map(({ password: _pw, email: _e, ...r }) => r as RankingRow);
