import express from "express"
import cors from "cors"
import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

// Cargar variables de entorno
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const userEmail = body.user_email || body.email;

if (!userEmail) {
  console.warn("⚠️ No se recibió email del usuario");
} else {
  try {
    const { error } = await supabase.from("device_data").insert([
      {
        user_email: userEmail,
        at: ultimoDato.at,
        T: ultimoDato.T,
        lat: ultimoDato.lat,
        lng: ultimoDato.lng,
        timestamp: ultimoDato.timestamp,
        raw: ultimoDato.raw,
      },
    ]);

    if (error) console.error("Error insertando en Supabase:", error);
    else console.log("✅ Datos guardados en Supabase para", userEmail);
  } catch (e) {
    console.error("Excepción al insertar en Supabase:", e);
  }
}

const app = express()
app.use(express.json())

app.use(
    cors({
        origin: true, // ajustar a tu front en producción
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
    })
)

// estado y historial
let ultimoDato = {
    at: 0,           // Aceleración total
    T: 0,           // Temperatura
    lat: null,      // Latitud
    lng: null,      // Longitud
    timestamp: null, // ISO string
    time: { hour: null, minute: null, second: null },
    day: null,      // YYYY-MM-DD
    weekday: null,  // nombre en es-ES
    lastUpdate: Date.now(),
    raw: {}
}
const history = []

const pad2 = (n) => String(n).padStart(2, "0")

function toDateFromMaybeTimestamp(v) {
    if (v == null) return null
    const n = Number(v)
    if (!Number.isFinite(n)) return null
    // si viene en segundos (p. ej. now.unixtime()) -> multiplicar por 1000
    if (n > 1e9 && n < 1e12) return new Date(n * 1000)
    return new Date(n)
}

function buildDateFromFechaHora(fecha, hora) {
    if (!fecha) return null
    if (hora) {
        const iso = `${fecha}T${hora}`
        const d = new Date(iso)
        if (!isNaN(d)) return d
    }
    const d = new Date(fecha)
    return isNaN(d) ? null : d
}

function computeAtFromAxAyAz(ax, ay, az) {
    const a = [ax, ay, az].map((v) => Number(v) || 0)
    const total = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2])
    return Number(total.toFixed(4))
}

// SSE clients
const sseClients = new Set()
function broadcastUpdate(payload) {
    const data = `data: ${JSON.stringify(payload)}\n\n`
    for (const res of sseClients) {
        try {
            res.write(data)
        } catch {
            // ignore
        }
    }
}

// POST /datos
// recibe JSON del ESP32, por ejemplo:
// { "at":1.03, "T":25.2, "fecha":"2025-10-25", "hora":"00:48:30", "timestamp":1729825710 }
app.post("/datos", (req, res) => {
    try {
        const body = req.body || {}
        
        // Mostrar datos recibidos del ESP32
        console.log("\n=== DATOS RECIBIDOS DEL ESP32 ===");
        console.log("JSON recibido:", JSON.stringify(body, null, 2));
        console.log("Timestamp:", new Date().toISOString());
        console.log("==============================\n");

        const { 
            at: at_in, 
            T: T_in, 
            lat: lat_in, 
            lng: lng_in,
            latitud, // Nombre alternativo para lat
            longitud, // Nombre alternativo para lng 
            fecha, 
            hora, 
            timestamp 
        } = body

        // Si no hay at ni ejes, rechaza
        if (at_in == null && body.ax == null && body.ay == null && body.az == null) {
            return res.status(400).json({ ok: false, error: "Falta 'at' o ax/ay/az en el JSON" })
        }

        // fecha/hora
        let dateObj = toDateFromMaybeTimestamp(timestamp) || buildDateFromFechaHora(fecha, hora)
        if (!dateObj) dateObj = new Date()

        const hour = dateObj.getHours()
        const minute = dateObj.getMinutes()
        const second = dateObj.getSeconds()
        const isoTimestamp = dateObj.toISOString()
        const day = `${dateObj.getFullYear()}-${pad2(dateObj.getMonth() + 1)}-${pad2(dateObj.getDate())}`
        const weekday = dateObj.toLocaleDateString("es-ES", { weekday: "long" })

        // calcular at si hace falta
        const atValue =
            at_in != null
                ? Number(at_in)
                : computeAtFromAxAyAz(body.ax ?? 0, body.ay ?? 0, body.az ?? 0)

        const Tvalue = T_in != null ? Number(T_in) : (body.temp != null ? Number(body.temp) : null)

        // Procesar coordenadas GPS
        const latValue = lat_in != null ? Number(lat_in) : (latitud != null ? Number(latitud) : null);
        const lngValue = lng_in != null ? Number(lng_in) : (longitud != null ? Number(longitud) : null);

        ultimoDato = {
            at: isNaN(atValue) ? null : atValue,
            T: isNaN(Tvalue) ? null : Tvalue,
            lat: isNaN(latValue) ? null : latValue,
            lng: isNaN(lngValue) ? null : lngValue,
            timestamp: isoTimestamp,
            time: { hour, minute, second },
            day,
            weekday,
            lastUpdate: Date.now(),
            raw: body,
        }

        history.push({ ...ultimoDato })
        if (history.length > 500) history.shift()

        // Verificar los datos antes de enviar
        console.log("\n=== DATOS PROCESADOS ===");
        console.log("Datos a enviar:", {
            at: ultimoDato.at,
            T: ultimoDato.T,
            lat: ultimoDato.lat,
            lng: ultimoDato.lng
        });
        console.log("=======================\n");

        // emitir a clientes SSE y responder
        broadcastUpdate(ultimoDato)
        return res.status(200).json({ ok: true, dato: ultimoDato })
    } catch (err) {
        console.error("Error procesando /datos:", err)
        return res.status(500).json({ ok: false, error: String(err) })
    }
})

// SSE endpoint para el front (PaySafeDash)
app.get("/stream", (req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
    })
    // enviar estado actual inmediatamente
    res.write(`data: ${JSON.stringify(ultimoDato)}\n\n`)
    sseClients.add(res)
    req.on("close", () => sseClients.delete(res))
})

// endpoint simple para obtener estado actual
app.get("/estado", (req, res) => {
    res.json(ultimoDato)
})

app.get("/history", (req, res) => {
    res.json(history.slice(-100))
})

app.get("/", (req, res) => {
    res.send("Servidor PaySafe corriendo en puerto 3000")
})

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000
app.listen(PORT, "0.0.0.0", () => {
    console.log("\n=== SERVIDOR PAYSAFE INICIADO ===");
    console.log(`Escuchando en puerto ${PORT}`);
    console.log("Esperando datos del ESP32...");
    console.log("==============================\n");
})