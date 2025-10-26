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
let safecoinTotal = 0  // Variable para acumular safecoins

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
    safecoin: 0,    // Valor de safecoin actual
    safecoinTotal: 0, // Valor acumulado de safecoin
    raw: {}
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
        } catch {
            // ignore
        }
    }
}

// POST /datos
app.post("/datos", async (req, res) => {
    try {
        const body = req.body || {}
        
        console.log("\n=== DATOS RECIBIDOS DEL ESP32 ===")
        console.log("JSON recibido:", JSON.stringify(body, null, 2))
        console.log("Timestamp:", new Date().toISOString())
        console.log("Tipo de dato safecoin:", typeof body.safecoin)
        console.log("Valor safecoin recibido:", body.safecoin)
        console.log("Balance actual antes de procesar:", safecoinTotal)
        console.log("==============================\n")

        const { 
            at: at_in, 
            T: T_in, 
            lat: lat_in, 
            lng: lng_in,
            latitud,
            longitud,
            fecha, 
            hora, 
            timestamp,
            safecoin = 0, // Nuevo valor safecoin con default 0
            operation // Para indicar si es suma o resta
        } = body

        if (at_in == null && body.ax == null && body.ay == null && body.az == null) {
            return res.status(400).json({ ok: false, error: "Falta 'at' o ax/ay/az en el JSON" })
        }

        let dateObj = toDateFromMaybeTimestamp(timestamp) || buildDateFromFechaHora(fecha, hora)
        if (!dateObj) dateObj = new Date()

        const hour = dateObj.getHours()
        const minute = dateObj.getMinutes()
        const second = dateObj.getSeconds()
        const isoTimestamp = dateObj.toISOString()
        const day = `${dateObj.getFullYear()}-${pad2(dateObj.getMonth() + 1)}-${pad2(dateObj.getDate())}`
        const weekday = dateObj.toLocaleDateString("es-ES", { weekday: "long" })

        const atValue = at_in != null ? Number(at_in) : computeAtFromAxAyAz(body.ax ?? 0, body.ay ?? 0, body.az ?? 0)
        const Tvalue = T_in != null ? Number(T_in) : (body.temp != null ? Number(body.temp) : null)
        const latValue = lat_in != null ? Number(lat_in) : (latitud != null ? Number(latitud) : null)
        const lngValue = lng_in != null ? Number(lng_in) : (longitud != null ? Number(longitud) : null)

        // Procesar safecoin y validar que sea un número
        let safecoinValue = 0;
        try {
            safecoinValue = Number(safecoin);
            if (isNaN(safecoinValue)) {
                console.log("Error: safecoin no es un número válido:", safecoin);
                safecoinValue = 0;
            }
        } catch (error) {
            console.log("Error al procesar safecoin:", error);
            safecoinValue = 0;
        }

        // Redondear a 2 decimales
        safecoinValue = Number(safecoinValue.toFixed(2));
        const prevTotal = Number(safecoinTotal.toFixed(2));

        console.log("SafecoinValue después de procesar:", safecoinValue);
        
        if (operation === 'subtract') {
            // Si es una operación de resta, verificar que hay suficiente balance
            if (safecoinTotal < safecoinValue) {
                console.log("\n=== ERROR EN OPERACIÓN SAFECOIN ===");
                console.log("Operación: Resta");
                console.log("Cantidad solicitada:", safecoinValue);
                console.log("Balance actual:", safecoinTotal);
                console.log("Error: Saldo insuficiente");
                console.log("================================\n");
                
                return res.status(400).json({ 
                    ok: false, 
                    error: "Saldo insuficiente de SafeCoin",
                    balance: safecoinTotal
                });
            }
            safecoinTotal = Number((safecoinTotal - safecoinValue).toFixed(2));
            console.log("Operación resta - Nuevo total:", safecoinTotal);
        } else {
            // Por defecto, sumar el safecoin (asegurarse que los números son válidos)
            if (safecoinValue > 0) {
                safecoinTotal = Number((safecoinTotal + safecoinValue).toFixed(2));
                console.log("Operación suma - Nuevo total:", safecoinTotal);
            } else {
                console.log("No se suma porque safecoinValue es 0 o negativo:", safecoinValue);
            }
        }

        // Log de la operación
        console.log("\n=== OPERACIÓN SAFECOIN ===");
        console.log("Operación:", operation || 'suma');
        console.log("Valor recibido:", safecoinValue);
        console.log("Balance anterior:", prevTotal);
        console.log("Balance nuevo:", safecoinTotal);
        console.log("======================\n");

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
            safecoin: safecoinValue,
            safecoinTotal: safecoinTotal, // Incluir el total acumulado
            raw: body,
        }

        history.push({ ...ultimoDato })
        if (history.length > 500) history.shift()

        console.log("\n=== DATOS PROCESADOS ===")
        console.log("Datos a enviar:", {
            at: ultimoDato.at,
            T: ultimoDato.T,
            lat: ultimoDato.lat,
            lng: ultimoDato.lng,
            safecoin: ultimoDato.safecoin,
            safecoinTotal: ultimoDato.safecoinTotal
        })
        console.log("=======================\n")

        broadcastUpdate(ultimoDato)
        return res.status(200).json({ ok: true, dato: ultimoDato })
    } catch (err) {
        console.error("Error procesando /datos:", err)
        return res.status(500).json({ ok: false, error: String(err) })
    }
})

// SSE endpoint
app.get("/stream", (req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
    })
    res.write(`data: ${JSON.stringify(ultimoDato)}\n\n`)
    sseClients.add(res)
    req.on("close", () => sseClients.delete(res))
})

app.get("/estado", (req, res) => {
    res.json(ultimoDato)
})

app.get("/history", (req, res) => {
    res.json(history.slice(-100))
})

// Endpoint para consultar el balance de SafeCoin
app.get("/balance", (req, res) => {
    res.json({
        balance: safecoinTotal,
        lastUpdate: ultimoDato.lastUpdate
    })
})

// Endpoint para gastar SafeCoins
app.post("/spend-coins", (req, res) => {
    const { amount } = req.body;
    
    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({
            ok: false,
            error: "Cantidad inválida"
        });
    }

    if (safecoinTotal < amount) {
        return res.status(400).json({
            ok: false,
            error: "Saldo insuficiente",
            balance: safecoinTotal
        });
    }

    safecoinTotal -= amount;
    
    // Actualizar ultimoDato
    ultimoDato = {
        ...ultimoDato,
        safecoinTotal,
        lastUpdate: Date.now()
    };

    // Notificar a los clientes SSE
    broadcastUpdate(ultimoDato);

    return res.json({
        ok: true,
        balance: safecoinTotal,
        spent: amount
    });
})

app.get("/", (req, res) => {
    res.send("Servidor PaySafe corriendo en puerto 3000")
})

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000
app.listen(PORT, "0.0.0.0", () => {
    console.log("\n=== SERVIDOR PAYSAFE INICIADO ===")
    console.log(`Escuchando en puerto ${PORT}`)
    console.log("Esperando datos del ESP32...")
    console.log("==============================\n")
})