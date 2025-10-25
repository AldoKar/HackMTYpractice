import express from "express"
import cors from "cors"

const app = express()
app.use(express.json())
app.use(
    cors({
        origin: true, // permitir orígenes dinámicos en desarrollo
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
    })
)

// Estado y historial
let ultimoDato = {
    raw: {},
    ax: null,
    ay: null,
    az: null,
    at: null, // aceleración total (g)
    T: null,  // temperatura (°C)
    lat: null,
    lng: null,
    time: { hour: null, minute: null, second: null },
    day: null,       // YYYY-MM-DD
    weekday: null,   // nombre del día en es-ES
    timestamp: null, // ISO
    lastUpdate: null // epoch ms
}
const history = [] // mantiene historial corto

// helpers
const pad2 = (n) => String(n).padStart(2, "0")
const toDateFromMaybeTimestamp = (v) => {
    if (v == null) return null
    const n = Number(v)
    if (!Number.isFinite(n)) return null
    // si parece en segundos (10 dígitos), convertir a ms
    if (n > 1e9 && n < 1e12) return new Date(n * 1000)
    return new Date(n)
}
const buildDateFromFechaHora = (fecha, hora) => {
    if (!fecha) return null
    if (hora) {
        const iso = `${fecha}T${hora}`
        const d = new Date(iso)
        if (!isNaN(d)) return d
    }
    const d = new Date(fecha)
    return isNaN(d) ? null : d
}
const computeAtFromAxAyAz = (ax, ay, az) => {
    const a = [ax, ay, az].map((v) => Number(v) || 0)
    const total = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2])
    return Number(total.toFixed(4))
}

// POST /datos - recibe JSON del ESP32
app.post("/datos", (req, res) => {
    try {
        const body = req.body || {}

        // campos esperados flexibles:
        // at (aceleración total), T (temp), ax, ay, az, lat, lng, timestamp (s o ms), fecha, hora
        const { at: at_in, T: T_in, ax, ay, az, lat, lng, timestamp, fecha, hora } = body

        // determinar fecha/hora
        let dateObj = toDateFromMaybeTimestamp(timestamp) || buildDateFromFechaHora(fecha, hora)
        if (!dateObj) dateObj = new Date()

        const hour = dateObj.getHours()
        const minute = dateObj.getMinutes()
        const second = dateObj.getSeconds()
        const isoTimestamp = dateObj.toISOString()
        const day = `${dateObj.getFullYear()}-${pad2(dateObj.getMonth() + 1)}-${pad2(dateObj.getDate())}`
        const weekday = dateObj.toLocaleDateString("es-ES", { weekday: "long" })

        // calcular at si no viene
        const at = at_in != null ? Number(at_in) : computeAtFromAxAyAz(ax, ay, az)
        const T = T_in != null ? Number(T_in) : (body.temp != null ? Number(body.temp) : null)

        // construir objeto procesado
        ultimoDato = {
            raw: body,
            ax: ax != null ? Number(ax) : null,
            ay: ay != null ? Number(ay) : null,
            az: az != null ? Number(az) : null,
            at: at != null && !isNaN(at) ? Number(at) : null,
            T: T != null && !isNaN(T) ? Number(T) : null,
            lat: lat != null ? Number(lat) : null,
            lng: lng != null ? Number(lng) : null,
            time: { hour, minute, second },
            day,
            weekday,
            timestamp: isoTimestamp,
            lastUpdate: Date.now(),
        }

        // push a historial (mantener tope 500)
        history.push({ ...ultimoDato })
        if (history.length > 500) history.shift()

        console.log("POST /datos ->", {
            at: ultimoDato.at,
            T: ultimoDato.T,
            time: ultimoDato.time,
            day: ultimoDato.day,
        })

        return res.status(200).json({ ok: true, dato: ultimoDato })
    } catch (err) {
        console.error("Error procesando /datos:", err)
        return res.status(500).json({ ok: false, error: String(err) })
    }
})

// GET /estado - último dato procesado
app.get("/estado", (req, res) => {
    res.json(ultimoDato)
})

// GET /history - historial (opcional)
app.get("/history", (req, res) => {
    res.json(history.slice(-100)) // últimos 100
})

// health
app.get("/", (req, res) => {
    res.send("Servidor PaySafe corriendo en puerto 3000")
})

// start
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor escuchando en puerto ${PORT}`)
})