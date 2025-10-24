import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

// ✅ Permitir CORS desde tu frontend (puerto 5173) y cualquier origen para el ESP32
app.use(cors({
    origin: ["http://localhost:5173", "*"],  // "*" permite cualquier origen, pero para producción limita
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
}));

// Datos globales del acelerómetro
let ultimoDato = { ax: 0, ay: 0, az: 0, lat: 0, lng: 0, lastUpdate: 0 };

// Endpoint para recibir datos del ESP32 (cambiado a /datos para coincidir con ESP32)
app.post("/datos", (req, res) => {
    ultimoDato = { ...req.body, lastUpdate: Date.now() };
    console.log("Datos recibidos del ESP32:", ultimoDato);
    res.sendStatus(200);
});

// Endpoint para enviar los datos al frontend
app.get("/estado", (req, res) => {
    res.json(ultimoDato);
});

// Agregar endpoint raíz para verificar que el servidor está corriendo
app.get("/", (req, res) => {
    res.send("Servidor corriendo en puerto 3000");
});

// Inicia el servidor (escucha en todas las IPs para que el ESP32 pueda acceder)
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor escuchando en puerto ${PORT} en todas las IPs`));