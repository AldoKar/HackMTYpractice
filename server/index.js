import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

// ✅ Permitir CORS desde tu frontend (puerto 5173)
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
}));

// Datos globales del acelerómetro
let ultimoDato = { ax: 0, ay: 0, az: 0, lastUpdate: 0 };

// Endpoint para recibir datos del ESP32
app.post("/estado", (req, res) => {
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

// Inicia el servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));