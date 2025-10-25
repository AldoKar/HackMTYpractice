import express from "express"
import cors from "cors"

const app = express()
app.use(express.json())

app.use(
    cors({
        origin: true,
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
    })
)

// estado y historial
let ultimoDato = {
    at: null,      // Aceleración total
    T: null,       // Temperatura
    timestamp: null,
    lastUpdate: null
}
const history = []

const pad2 = (n) => String(n).padStart(2, "0")
function toDateFromMaybeTimestamp(v) {
    if (v == null) return null
    const n = Number(v)
    if (!Number.isFinite(n)) return null
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
        } catch (e) {
            // ignore; removal happens on close
        }
    }
}

// POST /datos
app.post("/datos", (req, res) => {
    try {
        const { at, T } = req.body

        // Validar que se reciban los datos necesarios
        if (at == null) {
            return res.status(400).json({ ok: false, error: "Falta 'at' en el JSON" })
        }

        // Crear objeto con los datos
        ultimoDato = {
            at: Number(at),
            T: T != null ? Number(T) : null,
            timestamp: new Date().toISOString(),
            lastUpdate: Date.now()
        }

        // Guardar en historial
        history.push({ ...ultimoDato })
        if (history.length > 100) history.shift() // Mantener solo últimos 100 registros

        // Broadcast a clientes SSE
        broadcastUpdate(ultimoDato)

        return res.status(200).json({ ok: true, dato: ultimoDato })
    } catch (err) {
        console.error("Error procesando /datos:", err)
        return res.status(500).json({ ok: false, error: String(err) })
    }
})

// SSE endpoint
app.get("/stream", (req, res) => {
    // headers required for SSE
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
    })
    // send a comment to keep connection alive initially
    res.write(`:ok\n\n`)
    sseClients.add(res)

    req.on("close", () => {
        sseClients.delete(res)
    })
})

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
    console.log(`Servidor escuchando en puerto ${PORT}`)
})