# PaySafe — ESP32 + Node + React (PaySafeDash)

Resumen breve
-------------
PaySafe es un proyecto que integra un ESP32 (con RTC DS3231 y MPU6050) que manda lecturas de aceleración y temperatura a un servidor Node/Express. El servidor procesa y expone datos vía HTTP y SSE (stream en tiempo real). La interfaz web (React + TypeScript + Vite) consume esos datos y muestra métricas, gráfico de historial, mapa y hora del dispositivo.

Arquitectura
------------
- ESP32: lee MPU6050 + DS3231 y hace POST JSON a `/datos`.
- Backend: Express (server/index.js) expone:
  - POST /datos → recibe JSON del ESP32, procesa y guarda `ultimoDato`.
  - GET /estado → devuelve último dato procesado.
  - GET /stream → Server-Sent Events (SSE) para actualizaciones en tiempo real.
  - GET /history → historial (últimos N).
  - POST /logout → (opcional) borrar cookie/sesión.
- Frontend: React (Vite, TypeScript) con componentes PaySafeDash y MapPage que consumen `/stream` y `/estado`.

Formato JSON esperado
--------------------
Ejemplo que envía el ESP32 (debe ajustarse `serverUrl`):
```json
{
  "at": 1.03,               // aceleración total en g
  "T": 25.2,                // temperatura °C
  "fecha": "2025-10-25",    // opcional: fecha RTC (YYYY-MM-DD)
  "hora": "00:48:30",       // opcional: hora RTC (HH:MM:SS)
  "timestamp": 1729825710   // opcional: unix timestamp (segundos o ms)
}
```
El servidor calcula y añade: `time` (hour,minute,second), `day` (YYYY-MM-DD), `weekday`, `timestamp` (ISO) y `lastUpdate`.

Instalación y ejecución (desarrollo, Windows)
---------------------------------------------
1. Clonar repo y entrar al proyecto:
   - cd c:\Users\HP\OneDrive\Escritorio\HackMTYpractice
2. Backend:
   - cd server
   - npm install
   - node index.js
   - (por defecto escucha en http://0.0.0.0:3000)
3. Frontend:
   - regresar a la raíz
   - npm install
   - npm run dev
   - (Vite por defecto en http://localhost:5173)
4. ESP32:
   - ajustar `serverUrl` en el sketch al IP del servidor (ej. http://10.22.198.150:3000/datos)
   - flashear el ESP32.

Variables de entorno
--------------------
- Si usas Supabase/otras integraciones revisa `.env` / `server/index.js` para las variables:
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY

Consumo en el frontend
----------------------
- El componente PaySafeDash se conecta a `/stream` (EventSource) y utiliza `/estado` como fallback por polling.
- Asegúrate que la URL del stream coincide con la del servidor (hostname y puerto).

Problemas comunes y soluciones
------------------------------
- CORS: habilitar `cors()` en Express (ya incluido en server/index.js).
- SSE no conecta: verificar que el navegador y servidor permiten `text/event-stream` y que no hay bloqueo por proxies.
- Cookies HttpOnly: para logout es necesario un endpoint en el servidor que invoque `res.clearCookie(...)` (el frontend no puede borrar cookies HttpOnly).
- Popup/hover recortado: evitar `overflow-hidden` en ancestros o usar React portal para el popup.

Estructura principal de carpetas
-------------------------------
- /src — frontend (React + TS)
  - PaySafeDash.tsx, MapPage.tsx, MPU6050Dash.tsx, Navigation.tsx, App.tsx, etc.
- /server — backend (Express)
  - index.js
- /src/ArduinoCode — código/nota del ESP32
- /README.md — este archivo

Notas finales
-------------
- Cambiar `ssid`, `password` y `serverUrl` en el sketch ESP32.
- Reiniciar servidor al cambiar `server/index.js`.
- Si necesitas, se puede ajustar el formato JSON enviado por el ESP32 para incluir lat/lng, ax/ay/az u otros campos.

Licencia
--------
Proyecto para práctica. Ajustar según política del equipo/empresa.

```// filepath: c:\Users\HP\OneDrive\Escritorio\HackMTYpractice\README.md
# PaySafe — ESP32 + Node + React (PaySafeDash)

Resumen breve
-------------
PaySafe es un proyecto que integra un ESP32 (con RTC DS3231 y MPU6050) que manda lecturas de aceleración y temperatura a un servidor Node/Express. El servidor procesa y expone datos vía HTTP y SSE (stream en tiempo real). La interfaz web (React + TypeScript + Vite) consume esos datos y muestra métricas, gráfico de historial, mapa y hora del dispositivo.

Arquitectura
------------
- ESP32: lee MPU6050 + DS3231 y hace POST JSON a `/datos`.
- Backend: Express (server/index.js) expone:
  - POST /datos → recibe JSON del ESP32, procesa y guarda `ultimoDato`.
  - GET /estado → devuelve último dato procesado.
  - GET /stream → Server-Sent Events (SSE) para actualizaciones en tiempo real.
  - GET /history → historial (últimos N).
  - POST /logout → (opcional) borrar cookie/sesión.
- Frontend: React (Vite, TypeScript) con componentes PaySafeDash y MapPage que consumen `/stream` y `/estado`.

Formato JSON esperado
--------------------
Ejemplo que envía el ESP32 (debe ajustarse `serverUrl`):
```json
{
  "at": 1.03,               // aceleración total en g
  "T": 25.2,                // temperatura °C
  "fecha": "2025-10-25",    // opcional: fecha RTC (YYYY-MM-DD)
  "hora": "00:48:30",       // opcional: hora RTC (HH:MM:SS)
  "timestamp": 1729825710   // opcional: unix timestamp (segundos o ms)
}
```
El servidor calcula y añade: `time` (hour,minute,second), `day` (YYYY-MM-DD), `weekday`, `timestamp` (ISO) y `lastUpdate`.

Instalación y ejecución (desarrollo, Windows)
---------------------------------------------
1. Clonar repo y entrar al proyecto:
   - cd c:\Users\HP\OneDrive\Escritorio\HackMTYpractice
2. Backend:
   - cd server
   - npm install
   - node index.js
   - (por defecto escucha en http://0.0.0.0:3000)
3. Frontend:
   - regresar a la raíz
   - npm install
   - npm run dev
   - (Vite por defecto en http://localhost:5173)
4. ESP32:
   - ajustar `serverUrl` en el sketch al IP del servidor (ej. http://10.22.198.150:3000/datos)
   - flashear el ESP32.

Variables de entorno
--------------------
- Si usas Supabase/otras integraciones revisa `.env` / `server/index.js` para las variables:
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY

Consumo en el frontend
----------------------
- El componente PaySafeDash se conecta a `/stream` (EventSource) y utiliza `/estado` como fallback por polling.
- Asegúrate que la URL del stream coincide con la del servidor (hostname y puerto).

Problemas comunes y soluciones
------------------------------
- CORS: habilitar `cors()` en Express (ya incluido en server/index.js).
- SSE no conecta: verificar que el navegador y servidor permiten `text/event-stream` y que no hay bloqueo por proxies.
- Cookies HttpOnly: para logout es necesario un endpoint en el servidor que invoque `res.clearCookie(...)` (el frontend no puede borrar cookies HttpOnly).
- Popup/hover recortado: evitar `overflow-hidden` en ancestros o usar React portal para el popup.

Estructura principal de carpetas
-------------------------------
- /src — frontend (React + TS)
  - PaySafeDash.tsx, MapPage.tsx, MPU6050Dash.tsx, Navigation.tsx, App.tsx, etc.
- /server — backend (Express)
  - index.js
- /src/ArduinoCode — código/nota del ESP32
- /README.md — este archivo

Notas finales
-------------
- Cambiar `ssid`, `password` y `serverUrl` en el sketch ESP32.
- Reiniciar servidor al cambiar `server/index.js`.
- Si necesitas, se puede ajustar el formato JSON enviado por el ESP32 para incluir lat/lng, ax/ay/az u otros campos.

Licencia
--------
Proyecto para práctica. Ajustar según política del equipo/empresa.
