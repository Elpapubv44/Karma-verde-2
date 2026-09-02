export type Rol = "alumno" | "creador" | "superior" | "asociado";

export interface Tarea {
  id: string;
  titulo: string;
  escuela: string;
  material: string;
  meta: number;
  progreso: number;
  estado: "pendiente" | "en_curso" | "completada";
  responsable?: string;
}

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  escuela: string;
  puntos: number;
  canjes: number;
  avatar?: string;
  curso?: string;
}

export interface Premio {
  id: string;
  nombre: string;
  descripcion: string;
  puntos: number;
  imagen: string;
  stock: number;
  categoria?: "utiles" | "experiencias" | "ecologico" | "escolar";
}

export interface CanjeTicket {
  id: string;
  usuarioId: string;
  usuarioNombre: string;
  escuela: string;
  premioId: string;
  premioNombre: string;
  puntosGastados: number;
  codigoVoucher: string;
  fechaCanje: string;
  fechaVencimiento: string;
  estado: "pendiente_retiro" | "entregado" | "cancelado";
  entregadoPor?: string;
}

export interface EntregaReciclaje {
  id: string;
  alumnoId: string;
  alumnoNombre: string;
  escuela: string;
  tipoPlastico: "PET" | "PEAD" | "PEBD" | "PP" | "Cartón" | "Aluminio";
  pesoKg: number;
  puntosOtorgados: number;
  hashToken: string;
  fecha: string;
  estado: "validada" | "pendiente_pesaje";
  validadoPor?: string;
}

export interface MetaComunitariaEscolar {
  id: string;
  escuela: string;
  titulo: string;
  recompensa: string;
  metaKg: number;
  acumuladoKg: number;
  fechaLimite: string;
  estado: "en_progreso" | "alcanzada";
}

export interface QuizPregunta {
  id: string;
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number;
  explicacion: string;
  puntosPremio: number;
  dificultad?: "facil" | "medio" | "dificil";
}

export interface Guia {
  id: string;
  titulo: string;
  categoria: string;
  contenido: string;
  icono: string;
}

export interface EtapaCircuito {
  id: string;
  orden: number;
  titulo: string;
  descripcion: string;
  imagen?: string;
  video?: string;
  galeria?: string[];
  estado: "activa" | "en_proceso" | "pendiente";
}

export interface PuntoVerde {
  id: string;
  nombre: string;
  escuela: string;
  direccion?: string;
  horario?: string;
  lat: number;
  lng: number;
  materiales: string[];
  puntosAcumulados: number;
}

export interface RankingRow {
  id: string;
  nombre: string;
  escuela: string;
  puntos: number;
  canjes: number;
  avatar?: string;
  curso?: string;
}

export interface EcoMetricas {
  kgTotales: number;
  litrosAguaAhorrados: number;
  kgCo2Evitado: number;
  kwhEnergiaAhorrada: number;
  arbolesEquivalentes: number;
}

export interface SystemFlags {
  escaner: boolean;
  canjes: boolean;
  mapa: boolean;
  registroAbierto: boolean;
}

export interface Anuncio {
  id: string;
  titulo: string;
  contenido: string;
  autor: string;
  fecha: string;
  urgente?: boolean;
}

export interface ScannedQrRecord {
  id: string;
  codigo: string;
  material: string;
  puntos: number;
  fecha: string;
  hash: string;
}
