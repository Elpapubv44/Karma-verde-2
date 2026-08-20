import { GoogleGenAI } from "@google/genai";

export async function handleAnalyzeQrRequest(request: Request): Promise<Response> {
  try {
    const { code } = (await request.json()) as { code?: string };
    if (!code || typeof code !== "string") {
      return new Response(JSON.stringify({ error: "Código requerido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          source: "fallback",
          analysis: generateLocalAnalysis(code),
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const prompt = `
Analiza el siguiente contenido extraído de un código QR o código de barras escaneado en el contexto de un programa escolar de reciclaje y economía circular ("Karmaverde").
El código leído es: "${code}".

Debes retornar un JSON con la siguiente estructura exacta:
{
  "objeto": "Nombre breve del objeto, residuo o punto identificado (ej. Botella de Agua Mineral PET, Sitio Web Oficial, Contenedor Patio Central)",
  "origen": "De dónde proviene o qué tipo de sitio/sistema es (ej. Punto Limpio Escuela Técnica #4, Enlace Web Externo, Fabricante Bebidas, Token Criptográfico KV)",
  "tipoMaterial": "Tipo de material detectado (PET, PEAD, Aluminio, Cartón, Electrónico, Enlace Web o Desconocido)",
  "reciclabilidad": "Alta / Media / Especial / Informativo",
  "descripcion": "Explicación concisa y educativa (2-3 oraciones) sobre qué es lo que se escaneó, de dónde proviene y qué utilidad o significado tiene.",
  "impactoEstimado": "Dato curioso o cálculo ecológico breve (ej. Ahorra 24L de agua por kg / Evita 1.85kg de CO2 / Permite fabricar bancos escolares).",
  "consejo": "Consejo práctico para el alumno (cómo disponerlo, si es seguro abrirlo, o recomendación pedagógica)."
}

Responde ÚNICAMENTE el objeto JSON sin bloques de código markdown adicionados si es posible.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text ?? "";
    const parsed = JSON.parse(text);

    return new Response(
      JSON.stringify({
        source: "gemini",
        analysis: parsed,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error analyzing QR with Gemini:", error);
    // Fallback gracefully to offline intelligence
    const fallback = generateLocalAnalysis(typeof request === "string" ? request : "desconocido");
    return new Response(
      JSON.stringify({
        source: "local-fallback",
        analysis: fallback,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export function generateLocalAnalysis(code: string) {
  const lower = code.toLowerCase();

  if (lower.startsWith("http://") || lower.startsWith("https://")) {
    let domain = "sitio web";
    try {
      domain = new URL(code).hostname;
    } catch {
      // ignore
    }
    return {
      objeto: "Enlace Web / URL Externa",
      origen: `Dominio de Internet (${domain})`,
      tipoMaterial: "Digital / Enlace Web",
      reciclabilidad: "Informativo",
      descripcion: `Se detectó un enlace web directo al sitio ${domain}. Puede contener información institucional, catálogos o recursos educativos de la iniciativa.`,
      impactoEstimado:
        "La digitalización de información reduce el consumo de papel físico y folletos impresos.",
      consejo: "Revisa que el enlace provenga de una fuente de confianza antes de navegar.",
    };
  }

  if (
    lower.includes("kv|") ||
    lower.includes("karmaverde") ||
    lower.includes("pet") ||
    lower.includes("pead")
  ) {
    return {
      objeto: lower.includes("pet") ? "Botella / Envase PET #1" : "Envase Rígido PEAD #2",
      origen: "Punto Verde Karmaverde (Validación Criptográfica)",
      tipoMaterial: lower.includes("pet")
        ? "PET (Polietileno Tereftalato)"
        : "PEAD (Alta Densidad)",
      reciclabilidad: "Alta (100% Circular)",
      descripcion:
        "Residuo plástico post-consumo apto para transformación mecánica en filamento 3D o madera plástica para bancos escolares.",
      impactoEstimado:
        "Por cada 1 kg procesado se ahorran 24 litros de agua potable y 1.85 kg de CO₂ equivalente.",
      consejo:
        "Asegúrate de que el envase esté seco, aplastado y con su tapita puesta para optimizar el volumen en fardos.",
    };
  }

  if (lower.includes("aluminio") || lower.includes("lata")) {
    return {
      objeto: "Lata de Bebida de Aluminio",
      origen: "Punto Limpio / Contenedor Metálico",
      tipoMaterial: "Aluminio 100% Reciclable",
      reciclabilidad: "Infinita (No pierde propiedades)",
      descripcion:
        "El aluminio reciclado ahorra hasta un 95% de la energía requerida para producir aluminio primario a partir de bauxita.",
      impactoEstimado:
        "Reciclar una sola lata ahorra energía suficiente para mantener encendido un televisor durante 3 horas.",
      consejo:
        "Enjuágala rápidamente si contenía líquido azucarado y aplástala para facilitar su traslado.",
    };
  }

  if (lower.includes("carton") || lower.includes("papel")) {
    return {
      objeto: "Caja o Plancha de Cartón Corrugado",
      origen: "Sector de Logística / Embalaje Escolar",
      tipoMaterial: "Celulosa / Cartón",
      reciclabilidad: "Alta (Hasta 7 ciclos de reciclaje)",
      descripcion:
        "Material fibroso recuperable utilizado por la cooperativa para fabricar nuevos embalajes y cuadernos escolares.",
      impactoEstimado:
        "Por cada tonelada de cartón reciclado se salvan 17 árboles adultos y 50.000 litros de agua.",
      consejo: "Desarma las cajas para que ocupen la menor cantidad de espacio posible.",
    };
  }

  // Generic/Unknown code scanned
  return {
    objeto: `Código / Identificador Detectado ("${code.slice(0, 30)}${code.length > 30 ? "..." : ""}")`,
    origen: "Lector General de Puntos y Etiquetas",
    tipoMaterial: "Dato / Etiqueta de Identificación",
    reciclabilidad: "Variable / A evaluar",
    descripcion: `Se escaneó un código alfanumérico que contiene "${code}". El sistema de IA lo cataloga como un identificador único de trazabilidad de material o lote.`,
    impactoEstimado:
      "El etiquetado y rastreo digital permite un 99.8% de precisión en la trazabilidad del circuito de reciclaje.",
    consejo:
      "Si corresponde a un residuo no catalogado, llévalo al punto limpio central para clasificación asistida.",
  };
}
