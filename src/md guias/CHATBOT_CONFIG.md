# Configuración del Chatbot de Pay$afe

## 📝 Cómo personalizar el comportamiento del chatbot

El chatbot utiliza un sistema de prompts que puedes modificar fácilmente en el archivo:
`src/lib/chatbotConfig.ts`

### 🎯 Prompt del Sistema (SYSTEM_PROMPT)

Este es el prompt principal que define cómo debe actuar el chatbot. Incluye:

1. **Rol y Personalidad**: Define cómo debe comportarse el asistente
2. **Información sobre Pay$afe**: Detalles de la plataforma, características y beneficios
3. **Instrucciones de Interacción**: Cómo responder a preguntas específicas
4. **Tono y Estilo**: El estilo de comunicación del chatbot

### ✏️ Cómo modificar el prompt:

1. Abre el archivo `src/lib/chatbotConfig.ts`
2. Edita la constante `SYSTEM_PROMPT`
3. Puedes cambiar:
   - La personalidad del chatbot
   - La información sobre Pay$afe
   - Las instrucciones de cómo responder
   - El tono y estilo de las respuestas

### 📌 Ejemplo de modificación:

Si quieres que el chatbot sea más formal:

```typescript
export const SYSTEM_PROMPT = `Eres un asistente profesional de Pay$afe...

## Tu Rol y Personalidad:
- Eres formal y profesional en todo momento
- Utilizas lenguaje técnico cuando es apropiado
- No usas emojis
- Proporcionas respuestas detalladas y estructuradas
...
`
```

Si quieres que sea más casual:

```typescript
export const SYSTEM_PROMPT = `Eres un asistente super amigable de Pay$afe...

## Tu Rol y Personalidad:
- Eres súper relajado y amigable 😎
- Usas expresiones coloquiales mexicanas
- Siempre incluyes emojis divertidos
- Mantienes las respuestas cortas y directas
...
`
```

### 🎨 Mensaje de Bienvenida

También puedes cambiar el mensaje inicial del chat modificando:

```typescript
export const WELCOME_MESSAGE = 'Tu mensaje personalizado aquí...'
```

### 🔧 Parámetros Técnicos

En `ChatBot.tsx`, puedes ajustar:

```typescript
generationConfig: {
    maxOutputTokens: 1000,  // Longitud máxima de respuesta
    temperature: 0.7,        // Creatividad (0-1, mayor = más creativo)
}
```

- **maxOutputTokens**: Controla qué tan larga puede ser la respuesta
- **temperature**: Controla la creatividad
  - 0.3-0.5: Respuestas más precisas y consistentes
  - 0.7-0.9: Respuestas más creativas y variadas
  - 1.0+: Muy creativo (puede ser impredecible)

### 💡 Tips para un buen prompt:

1. ✅ Sé específico sobre el rol y la personalidad
2. ✅ Incluye información detallada sobre tu producto/servicio
3. ✅ Define claramente el tono y estilo de comunicación
4. ✅ Proporciona ejemplos de cómo responder a preguntas comunes
5. ✅ Establece límites claros de lo que puede y no puede hacer
6. ✅ Usa instrucciones en segunda persona ("Eres...", "Debes...")

### 🚀 Aplicar los cambios:

1. Guarda el archivo `chatbotConfig.ts`
2. El chatbot aplicará los cambios automáticamente
3. Refresca la página para ver los nuevos comportamientos

---

## 🎭 Ejemplos de Prompts Personalizados

### Chatbot de Soporte Técnico:
```typescript
export const SYSTEM_PROMPT = `Eres un experto en soporte técnico de Pay$afe.
- Siempre preguntas por detalles específicos del problema
- Ofreces soluciones paso a paso
- Eres paciente y didáctico
- Usas lenguaje técnico pero lo explicas de forma simple`
```

### Chatbot de Ventas:
```typescript
export const SYSTEM_PROMPT = `Eres un asesor comercial de Pay$afe.
- Te enfocas en los beneficios y ROI
- Usas datos y estadísticas para convencer
- Eres persuasivo pero no agresivo
- Ofreces demostraciones y pruebas gratuitas`
```

### Chatbot Educativo:
```typescript
export const SYSTEM_PROMPT = `Eres un educador sobre seguridad vial.
- Enseñas sobre conducción responsable
- Usas ejemplos y analogías
- Celebras las buenas prácticas de conducción
- Proporcionas tips de seguridad constantemente`
```
