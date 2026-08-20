/**
 * Karmaverde — Reglas base del chatbot ("System Prompt").
 *
 * El bot está ESTRICTAMENTE limitado a reciclaje, ecología y separación de
 * residuos. Cualquier otro tema recibe la respuesta de rechazo.
 * Si más adelante se conecta a una IA real, mandá SYSTEM_PROMPT como
 * mensaje de sistema y mantené OFF_TOPIC_REPLY como fallback.
 */
export const SYSTEM_PROMPT = `Sos "EcoBot", el asistente de Karmaverde para escuelas.
REGLAS ESTRICTAS:
1. Respondé ÚNICAMENTE sobre reciclaje, ecología, cuidado del medio ambiente y separación de residuos.
2. Si la pregunta es de cualquier otro tema (matemática, clima, deportes, charla general, tareas escolares, etc.) respondé exactamente: "Lo siento, solo puedo ayudarte con temas relacionados al reciclaje y el cuidado del medio ambiente."
3. No inventes datos ni des consejos peligrosos. Usá lenguaje simple para chicos y adolescentes.
4. Respuestas cortas (máximo 4 oraciones).`;

export const OFF_TOPIC_REPLY =
  "Lo siento, solo puedo ayudarte con temas relacionados al reciclaje y el cuidado del medio ambiente.";

/** Palabras que habilitan una respuesta (editable). */
const TEMAS_PERMITIDOS = [
  "recicl",
  "reciclaje",
  "residuo",
  "basura",
  "separ",
  "compost",
  "organic",
  "orgánic",
  "plastic",
  "plástic",
  "pet",
  "papel",
  "carton",
  "cartón",
  "vidrio",
  "metal",
  "lata",
  "pila",
  "bateria",
  "batería",
  "tetra",
  "tapita",
  "botella",
  "ecolog",
  "ecológ",
  "ambiente",
  "ambiental",
  "contamina",
  "sustentab",
  "sostenib",
  "huella",
  "verde",
  "punto verde",
  "contenedor",
  "planta de clasificacion",
  "planta de clasificación",
  "reutiliz",
  "reducir",
  "co2",
  "clima",
  "arbol",
  "árbol",
  "agua",
  "energia",
  "energía",
  "karmaverde",
  "karma verde",
  "puntos",
  "qr",
];

export function esTemaPermitido(texto: string) {
  const t = texto.toLowerCase();
  return TEMAS_PERMITIDOS.some((k) => t.includes(k));
}

interface Respuesta {
  claves: string[];
  texto: string;
}

/** Base de conocimiento local (sin servidor). Editable libremente. */
const RESPUESTAS: Respuesta[] = [
  {
    claves: ["pet", "plastic", "plástic", "botella"],
    texto:
      "El PET es el plástico de las botellas. Enjuagalo, aplastalo y sacale la tapa antes de tirarlo al contenedor de reciclables.",
  },
  {
    claves: ["papel", "carton", "cartón"],
    texto:
      "El papel y el cartón van secos y limpios. Doblá las cajas para que ocupen menos. El papel engrasado o sucio NO se recicla.",
  },
  {
    claves: ["pila", "bateria", "batería"],
    texto:
      "Las pilas nunca van a la basura común: son residuo peligroso. Llevalas a un punto verde especial que las reciba.",
  },
  {
    claves: ["vidrio"],
    texto:
      "El vidrio se recicla infinitas veces. Enjuagá el frasco y no mezcles espejos ni cerámica, que tienen otra composición.",
  },
  {
    claves: ["compost", "organic", "orgánic"],
    texto:
      "Con restos de fruta, verdura, yerba y hojas secas podés hacer compost. En unos 3 meses se transforma en tierra fértil.",
  },
  {
    claves: ["punto verde", "contenedor", "donde", "dónde"],
    texto:
      "En el Mapa de la app vas a encontrar los puntos verdes participantes y qué materiales recibe cada uno.",
  },
  {
    claves: ["qr", "punto", "puntos"],
    texto:
      "Cuando entregás material en un punto verde te dan un código QR. Escaneándolo desde la app sumás puntos para canjear premios.",
  },
];

/** Genera la respuesta del bot respetando la restricción de tema. */
export function responder(pregunta: string): string {
  if (!esTemaPermitido(pregunta)) return OFF_TOPIC_REPLY;
  const t = pregunta.toLowerCase();
  const hit = RESPUESTAS.find((r) => r.claves.some((c) => t.includes(c)));
  return (
    hit?.texto ??
    "Buena pregunta sobre reciclaje. Separá siempre en secos (papel, cartón, plástico, vidrio, metal) y húmedos (orgánicos), y llevá los secos limpios al punto verde más cercano."
  );
}
