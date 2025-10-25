# Smart City Analytics - Pay$afe

## 🌆 ¿Qué es Smart City Analytics?

Pay$afe ahora contribuye al desarrollo de **Smart Cities** en Monterrey, recopilando y analizando datos de conducción para mejorar la seguridad vial y apoyar a las autoridades en la planificación urbana.

## 🚀 Funcionalidades Implementadas

### 1. **Análisis de Rutas con IA (Gemini)**
- Calcula el nivel de riesgo de una ruta específica
- Basado en datos históricos de conducción (frenadas, aceleraciones, giros)
- Proporciona recomendaciones personalizadas para conductores
- Identifica las zonas más peligrosas en la ruta

**Ejemplo de uso:**
```typescript
const analysis = await analyzeRoute(
  "Av. Constitución", 
  "Blvd. Fundidora", 
  zonesData
);
// Retorna: nivel de riesgo, análisis de IA, recomendaciones
```

### 2. **Mapa de Zonas de Riesgo**
- Visualización interactiva de Monterrey
- Marcadores de color según nivel de riesgo:
  - 🔴 Rojo: Alto riesgo (>70)
  - ⚪ Gris: Medio riesgo (40-70)
  - ⚪ Blanco: Bajo riesgo (<40)
- Información detallada por zona al hacer clic

### 3. **Reportes para Autoridades**
- Resumen ejecutivo del estado de seguridad vial
- Top 5 zonas de mayor riesgo
- Recomendaciones específicas para infraestructura
- Insights de planificación urbana generados por IA

**Ejemplo de uso:**
```typescript
const report = await generateSmartCityReport(monterreyZones);
// Retorna: resumen, zonas de riesgo, recomendaciones, insights
```

## 📊 Datos Analizados

Para cada zona se recopila:
- **Frenadas bruscas**: Detecciones de frenos repentinos
- **Aceleraciones fuertes**: Eventos de aceleración brusca
- **Giros cerrados**: Maniobras de giro cerrado
- **Viajes totales**: Cantidad de viajes registrados
- **Velocidad promedio**: Velocidad media en la zona
- **Score de riesgo**: Puntuación 0-100 calculada automáticamente

## 🗺️ Zonas Monitoreadas (Ejemplo)

Actualmente se monitorean 7 zonas clave de Monterrey:
1. Av. Constitución (Centro) - Riesgo: 78/100
2. Blvd. Fundidora - Riesgo: 71/100
3. Calzada del Valle - Riesgo: 45/100
4. Av. Morones Prieto - Riesgo: 85/100
5. Blvd. Díaz Ordaz - Riesgo: 38/100
6. Av. San Pedro - Riesgo: 62/100
7. Av. Lázaro Cárdenas - Riesgo: 92/100

## 🤖 Integración con Gemini AI

Usamos **Gemini 2.0 Flash Exp** para:
- Análisis contextual de patrones de conducción
- Generación de recomendaciones personalizadas
- Insights de planificación urbana
- Predicción de zonas de alto riesgo

### Prompt del Sistema:
```
Eres un analista experto en seguridad vial y planificación urbana 
para Smart Cities. Tu trabajo es analizar datos de conducción 
recopilados por sensores MPU6050 en vehículos de Monterrey...
```

## 🎯 Beneficios para Smart Cities

### Para Conductores:
- ✅ Conocen rutas más seguras
- ✅ Reciben alertas de zonas peligrosas
- ✅ Mejoran su comportamiento al volante
- ✅ Ganan más SafeCoins en rutas seguras

### Para Autoridades:
- 🏛️ Identifican zonas que necesitan mejoras
- 🏛️ Optimizan señalización vial
- 🏛️ Priorizan inversión en infraestructura
- 🏛️ Monitorean efectividad de medidas implementadas

## 📍 Dónde Encontrarlo

En la aplicación:
1. Ve al **Menú**
2. Click en **Mapa**
3. Scroll hasta **Smart City Analytics** (al final de la página)

O directamente: `/mapa` → sección "Smart City Analytics"

## 🔧 Archivos Creados

### `src/lib/smartCityAnalyzer.ts`
- Funciones `analyzeRoute()` y `generateSmartCityReport()`
- Datos de ejemplo de zonas de Monterrey
- Interfaces TypeScript para tipos de datos
- Configuración de Gemini AI

### `src/MapPage.tsx` (actualizado)
- Nueva sección "Smart City Analytics"
- 2 tarjetas interactivas (Análisis de Ruta + Reporte)
- Mapa de zonas de riesgo con marcadores coloreados
- Integración con funciones de IA

### `src/lib/chatbotConfig.ts` (actualizado)
- Prompt actualizado con información de Smart City
- El chatbot ahora puede responder preguntas sobre esta funcionalidad

## 🚀 Cómo Usar

### 1. Analizar una Ruta:
```
1. Ve a /mapa
2. Scroll a "Smart City Analytics"
3. Click en "Calcular Riesgo de Ruta"
4. Espera el análisis de Gemini (5-10 segundos)
5. Revisa: nivel de riesgo, análisis, recomendaciones
```

### 2. Generar Reporte para Autoridades:
```
1. Ve a /mapa
2. Scroll a "Smart City Analytics"
3. Click en "Generar Reporte"
4. Espera el análisis de Gemini (5-10 segundos)
5. Revisa: resumen ejecutivo, zonas de riesgo, recomendaciones
```

### 3. Ver Mapa de Zonas:
```
1. Scroll al mapa inferior en Smart City Analytics
2. Click en marcadores para ver detalles
3. Colores indican nivel de riesgo
```

## 🔑 Variables de Entorno

Asegúrate de tener en tu `.env`:
```
VITE_GEIMINI_API_KEY=AIzaSyCnmPQWPNUlOTPOjwdoM0VBhLyN-jjgZ5c
```

## 📈 Próximas Mejoras (Ideas)

- [ ] Integración con backend real (actualmente usa datos simulados)
- [ ] Más rutas predefinidas para analizar
- [ ] Filtros por tipo de evento (frenadas/aceleraciones/giros)
- [ ] Exportar reportes en PDF
- [ ] Comparación de múltiples rutas
- [ ] Alertas en tiempo real de zonas peligrosas
- [ ] Dashboard para autoridades municipales
- [ ] API pública para desarrolladores

## 🎉 Resultado

Ahora Pay$afe no solo ayuda a conductores individuales, sino que **contribuye activamente al desarrollo de una ciudad más inteligente y segura** mediante el análisis de datos masivos de conducción.

---

**Desarrollado con:**
- React + TypeScript
- Gemini AI (Google)
- Leaflet Maps
- Tailwind CSS
- Shadcn UI
