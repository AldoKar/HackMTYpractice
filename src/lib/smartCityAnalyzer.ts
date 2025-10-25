import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEIMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Datos simulados de conducción por zonas (en producción vendrían de tu backend)
export interface ZoneData {
  name: string;
  location: [number, number];
  hardBrakes: number;
  hardAccelerations: number;
  sharpTurns: number;
  totalTrips: number;
  avgSpeed: number;
  riskScore: number; // 0-100
}

export interface RouteRiskAnalysis {
  routeName: string;
  startPoint: string;
  endPoint: string;
  distance: number;
  estimatedTime: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  aiAnalysis: string;
  recommendations: string[];
  dangerousZones: string[];
}

export interface SmartCityReport {
  summary: string;
  topRiskyZones: ZoneData[];
  recommendations: string[];
  urbanPlanningInsights: string;
}

// Configuración del sistema para análisis de Smart Cities
const SMART_CITY_PROMPT = `
Eres un analista experto en seguridad vial y planificación urbana para Smart Cities.

Tu trabajo es analizar datos de conducción recopilados por sensores MPU6050 en vehículos de Monterrey, México, 
a través de la plataforma PaySafe. Los datos incluyen:
- Frenadas bruscas
- Aceleraciones fuertes
- Giros cerrados
- Velocidad promedio
- Número de viajes

Debes proporcionar análisis concisos y accionables para:
1. Conductores: Recomendaciones de seguridad
2. Autoridades: Insights para mejorar infraestructura vial

Responde de forma clara, profesional y orientada a soluciones.
`;

/**
 * Analiza una ruta específica y calcula el riesgo basado en datos históricos
 */
export async function analyzeRoute(
  startPoint: string,
  endPoint: string,
  zonesData: ZoneData[]
): Promise<RouteRiskAnalysis> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      systemInstruction: SMART_CITY_PROMPT,
    });

    // Calcular datos agregados de la ruta
    const totalBrakes = zonesData.reduce((sum, z) => sum + z.hardBrakes, 0);
    const totalAccelerations = zonesData.reduce((sum, z) => sum + z.hardAccelerations, 0);
    const totalTurns = zonesData.reduce((sum, z) => sum + z.sharpTurns, 0);
    const avgRiskScore = zonesData.reduce((sum, z) => sum + z.riskScore, 0) / zonesData.length;

    const prompt = `
Analiza esta ruta en Monterrey:

**Ruta:** ${startPoint} → ${endPoint}
**Distancia:** ~${Math.round(Math.random() * 10 + 5)} km

**Datos históricos de conducción:**
- Frenadas bruscas registradas: ${totalBrakes}
- Aceleraciones fuertes: ${totalAccelerations}
- Giros cerrados: ${totalTurns}
- Score de riesgo promedio: ${avgRiskScore.toFixed(1)}/100

**Zonas por las que pasa:**
${zonesData.map(z => `- ${z.name}: ${z.totalTrips} viajes, riesgo ${z.riskScore}/100`).join('\n')}

Proporciona:
1. Un análisis breve (2-3 líneas) sobre el nivel de riesgo de esta ruta
2. Tres recomendaciones específicas para conductores
3. Las 2 zonas más peligrosas de la ruta

Formato:
ANÁLISIS: [tu análisis aquí]
RECOMENDACIONES:
- [recomendación 1]
- [recomendación 2]
- [recomendación 3]
ZONAS PELIGROSAS: [zona1], [zona2]
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parsear respuesta
    const analysisMatch = response.match(/ANÁLISIS:\s*(.+?)(?=RECOMENDACIONES:|$)/s);
    const recsMatch = response.match(/RECOMENDACIONES:\s*(.+?)(?=ZONAS PELIGROSAS:|$)/s);
    const zonesMatch = response.match(/ZONAS PELIGROSAS:\s*(.+)/s);

    const recommendations = recsMatch?.[1]
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.replace(/^-\s*/, '').trim()) || [];

    const dangerousZones = zonesMatch?.[1]
      .split(',')
      .map(z => z.trim()) || [];

    return {
      routeName: `${startPoint} - ${endPoint}`,
      startPoint,
      endPoint,
      distance: Math.round(Math.random() * 10 + 5),
      estimatedTime: Math.round(Math.random() * 20 + 10),
      riskLevel: avgRiskScore > 70 ? 'high' : avgRiskScore > 40 ? 'medium' : 'low',
      riskScore: Math.round(avgRiskScore),
      aiAnalysis: analysisMatch?.[1].trim() || response,
      recommendations,
      dangerousZones,
    };
  } catch (error) {
    console.error("Error al analizar ruta:", error);
    throw error;
  }
}

/**
 * Genera un reporte para Smart Cities basado en datos agregados
 */
export async function generateSmartCityReport(
  zonesData: ZoneData[]
): Promise<SmartCityReport> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      systemInstruction: SMART_CITY_PROMPT,
    });

    // Ordenar zonas por riesgo
    const topRiskyZones = [...zonesData].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);

    const prompt = `
Genera un reporte de seguridad vial para las autoridades de Monterrey basado en estos datos:

**Top 5 Zonas de Mayor Riesgo:**
${topRiskyZones.map((z, i) => `
${i + 1}. ${z.name}
   - Frenadas bruscas: ${z.hardBrakes}
   - Aceleraciones: ${z.hardAccelerations}
   - Giros cerrados: ${z.sharpTurns}
   - Viajes totales: ${z.totalTrips}
   - Score de riesgo: ${z.riskScore}/100
`).join('\n')}

Proporciona:
1. Un resumen ejecutivo (3-4 líneas) sobre el estado de la seguridad vial
2. Cuatro recomendaciones para autoridades (infraestructura, señalización, etc.)
3. Insights para planificación urbana (2-3 líneas)

Formato:
RESUMEN: [resumen ejecutivo]
RECOMENDACIONES PARA AUTORIDADES:
- [recomendación 1]
- [recomendación 2]
- [recomendación 3]
- [recomendación 4]
PLANIFICACIÓN URBANA: [insights]
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parsear respuesta
    const summaryMatch = response.match(/RESUMEN:\s*(.+?)(?=RECOMENDACIONES PARA AUTORIDADES:|$)/s);
    const recsMatch = response.match(/RECOMENDACIONES PARA AUTORIDADES:\s*(.+?)(?=PLANIFICACIÓN URBANA:|$)/s);
    const urbanMatch = response.match(/PLANIFICACIÓN URBANA:\s*(.+)/s);

    const recommendations = recsMatch?.[1]
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.replace(/^-\s*/, '').trim()) || [];

    return {
      summary: summaryMatch?.[1].trim() || '',
      topRiskyZones,
      recommendations,
      urbanPlanningInsights: urbanMatch?.[1].trim() || '',
    };
  } catch (error) {
    console.error("Error al generar reporte Smart City:", error);
    throw error;
  }
}

// Datos de ejemplo para Monterrey (en producción vendrían de tu backend)
export const monterreyZones: ZoneData[] = [
  {
    name: "Av. Constitución (Centro)",
    location: [25.6693, -100.3099],
    hardBrakes: 145,
    hardAccelerations: 89,
    sharpTurns: 67,
    totalTrips: 523,
    avgSpeed: 45,
    riskScore: 78,
  },
  {
    name: "Blvd. Fundidora",
    location: [25.6785, -100.2890],
    hardBrakes: 98,
    hardAccelerations: 112,
    sharpTurns: 43,
    totalTrips: 412,
    avgSpeed: 52,
    riskScore: 71,
  },
  {
    name: "Calzada del Valle",
    location: [25.6523, -100.3456],
    hardBrakes: 67,
    hardAccelerations: 54,
    sharpTurns: 32,
    totalTrips: 389,
    avgSpeed: 38,
    riskScore: 45,
  },
  {
    name: "Av. Morones Prieto",
    location: [25.6912, -100.3234],
    hardBrakes: 134,
    hardAccelerations: 156,
    sharpTurns: 78,
    totalTrips: 678,
    avgSpeed: 58,
    riskScore: 85,
  },
  {
    name: "Blvd. Díaz Ordaz",
    location: [25.6445, -100.2789],
    hardBrakes: 56,
    hardAccelerations: 43,
    sharpTurns: 28,
    totalTrips: 298,
    avgSpeed: 42,
    riskScore: 38,
  },
  {
    name: "Av. San Pedro",
    location: [25.6578, -100.4012],
    hardBrakes: 78,
    hardAccelerations: 92,
    sharpTurns: 45,
    totalTrips: 456,
    avgSpeed: 48,
    riskScore: 62,
  },
  {
    name: "Av. Lázaro Cárdenas",
    location: [25.7234, -100.3567],
    hardBrakes: 167,
    hardAccelerations: 189,
    sharpTurns: 98,
    totalTrips: 789,
    avgSpeed: 62,
    riskScore: 92,
  },
];
