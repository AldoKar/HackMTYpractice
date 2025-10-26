# 🤖 ChatBot con Análisis de Datos - Pay$afe

## 📊 Descripción General

El ChatBot de Pay$afe ahora tiene capacidades avanzadas de análisis de datos en tiempo real. Puede leer, analizar y generar reportes basados en los 300 registros de conducción almacenados en el archivo CSV.

## ✨ Capacidades del ChatBot

### 1. **Reportes Generales**
El chatbot puede generar un reporte completo con estadísticas de todos los conductores.

**Ejemplos de preguntas:**
- "Dame un reporte general"
- "Muéstrame las estadísticas generales"
- "Genera un análisis general"
- "¿Cómo está la conducción en general?"

**Información incluida:**
- Total de registros y usuarios
- Aceleración promedio, máxima y mínima
- Temperatura promedio
- Distribución de niveles de riesgo (%)
- Top 3 conductores más seguros
- Top 3 conductores de mayor riesgo
- Recomendaciones automáticas

---

### 2. **Análisis por Usuario**
Analiza el comportamiento de un conductor específico.

**Ejemplos de preguntas:**
- "Analiza al usuario Juan Pérez"
- "¿Cómo maneja Carlos López?"
- "Dame información de Laura Hernández"
- "Estadísticas del conductor María García"

**Información incluida:**
- Total de registros del usuario
- Aceleración promedio
- Nivel de riesgo (Seguro/Precaución/Peligroso)
- Distribución de eventos por nivel de riesgo
- Día más activo
- Horario preferido

---

### 3. **Top Conductores**
Muestra rankings de los mejores y peores conductores.

**Ejemplos de preguntas:**
- "¿Quiénes son los mejores conductores?"
- "Muéstrame un ranking"
- "Top 5 conductores"
- "¿Quiénes manejan peor?"

**Información incluida:**
- Top 5 conductores más seguros (menor aceleración)
- Top 3 conductores de mayor riesgo (mayor aceleración)
- Aceleración promedio de cada uno

---

### 4. **Análisis por Día de la Semana**
Analiza patrones de conducción por día.

**Ejemplos de preguntas:**
- "¿Cómo fue el lunes?"
- "Análisis del martes"
- "Estadísticas del viernes"
- "¿Qué día tiene más conducción peligrosa?"

**Información incluida:**
- Total de registros del día
- Usuarios activos
- Aceleración promedio
- Distribución de eventos por nivel de riesgo

---

### 5. **Análisis por Horario**
Analiza patrones según la hora del día.

**Rangos horarios:**
- **Mañana:** 07:00 - 12:00
- **Tarde:** 12:00 - 17:00
- **Noche:** 17:00 - 20:00

**Ejemplos de preguntas:**
- "¿Cómo es la conducción en la mañana?"
- "Análisis de la tarde"
- "¿Es peligroso manejar en la noche?"
- "¿Qué horario es más seguro?"

**Información incluida:**
- Total de registros en ese horario
- Aceleración promedio
- Cantidad de eventos peligrosos
- Nivel de riesgo general

---

### 6. **Comparaciones**
Compara datos entre usuarios o períodos.

**Ejemplos de preguntas:**
- "Compara a Juan Pérez con Carlos López"
- "¿Quién maneja mejor entre todos?"
- "Diferencias entre usuarios"

**Información incluida:**
- Estadísticas generales de todos los usuarios
- Lista de usuarios disponibles
- Aceleración promedio global

---

## 🎯 Niveles de Riesgo

El sistema clasifica la conducción en 3 niveles basados en la aceleración:

- 🟢 **Seguro:** < 1.5g (aceleraciones suaves)
- 🟡 **Precaución:** 1.5g - 2.0g (aceleraciones moderadas)
- 🔴 **Peligroso:** >= 2.0g (aceleraciones bruscas)

---

## 🔧 Cómo Funciona Técnicamente

### Arquitectura del Sistema

1. **Carga de Datos:**
   - Al iniciar el ChatBot, se carga automáticamente el CSV (`usuarios_dispositivos.csv`)
   - Los datos se parsean y almacenan en memoria

2. **Detección de Intención:**
   - El sistema analiza el mensaje del usuario
   - Detecta palabras clave (reporte, usuario, día, horario, etc.)
   - Selecciona la función de análisis apropiada

3. **Análisis de Datos:**
   - Se ejecuta la función correspondiente (`analyzeAllData`, `analyzeByUser`, etc.)
   - Se generan estadísticas en tiempo real

4. **Contextualización:**
   - Los datos analizados se agregan al prompt del sistema
   - Gemini 2.5 Flash recibe el contexto completo

5. **Generación de Respuesta:**
   - Gemini genera una respuesta natural basada en los datos reales
   - El ChatBot presenta la información de forma amigable

---

## 📁 Archivos Involucrados

### `src/lib/dataAnalyzer.ts`
Contiene todas las funciones de análisis:
- `loadDeviceData()` - Carga el CSV
- `analyzeAllData()` - Análisis general
- `analyzeByUser()` - Análisis por usuario
- `analyzeByDay()` - Análisis por día
- `analyzeByTimeRange()` - Análisis por horario
- `getTopSafeDrivers()` - Top conductores seguros
- `getTopDangerousDrivers()` - Top conductores peligrosos
- `generateFullReport()` - Reporte completo en texto

### `src/components/ChatBot.tsx`
Componente principal del chatbot con:
- Integración de funciones de análisis
- Detección de palabras clave
- Inyección de contexto al prompt

### `src/lib/chatbotConfig.ts`
Configuración del prompt del sistema con:
- Instrucciones sobre análisis de datos
- Información sobre niveles de riesgo
- Guías para generar reportes

### `public/data/usuarios_dispositivos.csv`
Fuente de datos con 300 registros de:
- 9 usuarios diferentes
- 7 días de la semana
- Múltiples horarios
- Datos de aceleración, temperatura, ubicación

---

## 💡 Ejemplos de Uso Práctico

### Caso 1: Banorte quiere saber quiénes son sus mejores clientes
**Pregunta:** "¿Quiénes son los conductores más seguros?"

**Respuesta esperada:**
```
🏆 ¡Aquí están los conductores más seguros de Pay$afe!

TOP 5 MEJORES:
1. Laura Hernández - 0.82g promedio (muy segura) 🟢
2. Juan Pérez - 1.06g promedio (seguro) 🟢
3. Sofía Torres - 1.02g promedio (seguro) 🟢
...

Estos conductores pueden ganar hasta 150 SafeCoins semanales 💰
```

### Caso 2: Análisis de patrones por horario
**Pregunta:** "¿Es más peligroso manejar en la noche?"

**Respuesta esperada:**
```
📊 Según los datos de conducción:

🌙 NOCHE (17:00-20:00):
- 95 registros analizados
- Aceleración promedio: 1.78g
- 18 eventos peligrosos
- Nivel: Precaución 🟡

Comparado con la mañana, sí hay 15% más riesgo en la noche.
```

### Caso 3: Análisis individual
**Pregunta:** "¿Cómo maneja Carlos López?"

**Respuesta esperada:**
```
⚠️ Análisis de Carlos López:

- 30 viajes registrados
- Aceleración promedio: 2.57g 🔴
- Nivel: PELIGROSO
- 28 eventos de alto riesgo

Recomendaciones:
- Reducir aceleraciones bruscas
- Practicar conducción defensiva
- Revisar patrones en Martes (día más activo)
```

---

## 🚀 Futuras Mejoras

### Posibles extensiones:
1. **Análisis predictivo:** Predecir comportamiento futuro
2. **Alertas automáticas:** Notificar conductores de riesgo
3. **Comparación temporal:** Comparar semanas/meses
4. **Análisis geográfico:** Zonas de mayor riesgo
5. **Recomendaciones personalizadas:** Sugerencias específicas por usuario
6. **Exportar reportes:** PDF, Excel
7. **Visualizaciones:** Generar gráficas desde el chat

---

## 🎓 Entrenamiento del ChatBot

El ChatBot está configurado para:
- ✅ Responder en español mexicano
- ✅ Usar emojis apropiados
- ✅ Mantener respuestas cortas (2-3 párrafos)
- ✅ Incluir números específicos en los reportes
- ✅ Dar recomendaciones prácticas
- ✅ Mencionar SafeCoins cuando sea relevante
- ✅ Evitar confusión con Paysafecard

---

## 🔑 Variables de Entorno Necesarias

Asegúrate de tener en tu `.env`:
```
VITE_GEIMINI_API_KEY=tu_api_key_de_gemini
```

---

## 📞 Soporte

Si el ChatBot no está generando reportes correctamente:

1. **Verificar datos:** Asegúrate que el CSV se cargó (`console.log` en DevTools)
2. **Verificar API Key:** La API de Gemini debe estar activa
3. **Probar palabras clave:** Usa palabras específicas como "reporte", "usuario", "día"
4. **Revisar errores:** Abre la consola del navegador para ver logs

---

## 🎉 ¡Listo para usar!

Ahora tu ChatBot es un analista de datos inteligente que puede:
- 📊 Generar reportes automáticos
- 🔍 Analizar patrones de conducción
- 🏆 Identificar mejores conductores
- ⚠️ Detectar conductores de riesgo
- 💡 Dar recomendaciones personalizadas

¡Todo basado en datos reales de tu CSV! 🚗✨
