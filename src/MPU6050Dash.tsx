import { useEffect, useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// Opción 1: Si Shadcn UI no está instalado correctamente
// Comenta las importaciones y usa elementos HTML básicos temporalmente
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

// Opción 2: Si el alias @ no está configurado en tsconfig.json
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";

// Opción 3: Si los componentes no existen, instálalos con:
// npx shadcn@latest add card
// npx shadcn@latest add badge

// Versión con Shadcn UI y Tailwind CSS
// Requisitos: Shadcn UI instalado, Tailwind CSS configurado
// npm install recharts
// npx shadcn-ui@latest add card badge

interface HistoryItem {
    t: string;
    ax: number;
    ay: number;
    az: number;
}

interface CardProps {
    title: string;
    value: number | string;
    unit: string;
}

export default function MPU6050Dashboard() {
    const [dato, setDato] = useState({ ax: 0, ay: 0, az: 0, lat: 0, lng: 0, at: 0, T: 0 });
    const [connected, setConnected] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [suddenMovements, setSuddenMovements] = useState(0);
    const [safeCoins, setSafeCoins] = useState(0);
    const mounted = useRef(true);

    useEffect(() => {
        mounted.current = true;

        async function fetchEstado() {
            try {
                const res = await fetch("http://localhost:3000/estado", { cache: "no-store" });
                if (!res.ok) throw new Error("HTTP " + res.status);
                const json = await res.json();
                if (!mounted.current) return;

                const ax = Number(json.ax) || 0;
                const ay = Number(json.ay) || 0;
                const az = Number(json.az) || 0;
                const lat = Number(json.lat) || 0;
                const lng = Number(json.lng) || 0;
                const lastUpdate = Number(json.lastUpdate) || 0;
                const at = Number(json.at) || 0;
                const T = Number(json.T) || 0;
                const balance = Number(json.balance) || 0;

                setDato({ ax, ay, az, lat, lng, at, T });
                setSafeCoins(balance);
                // Considera conectado si el último update fue hace menos de 5 segundos
                setConnected(Date.now() - lastUpdate < 5000);

                // Detectar movimientos bruscos (ej. si aceleración > 2g en cualquier eje)
                const isSudden = Math.abs(ax) > 2 || Math.abs(ay) > 2 || Math.abs(az) > 2;
                if (isSudden) {
                    setSuddenMovements(prev => prev + 1);
                }

                setHistory(h => {
                    const next = [...h, { t: new Date().toLocaleTimeString(), ax, ay, az }];
                    return next.slice(-30);
                });
            } catch (err) {
                console.error("Error al obtener /estado:", err);
                setConnected(false);
            }
        }

        fetchEstado();
        const id = setInterval(fetchEstado, 1000);
        return () => {
            mounted.current = false;
            clearInterval(id);
        };
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <header className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">MPU6050 — Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Lecturas de acelerómetro en tiempo real</p>
                </div>
                <div className="text-right">
                    <Badge variant={connected ? "default" : "destructive"}>
                        {connected ? "Conectado" : "Desconectado"}
                    </Badge>
                </div>
            </header>

            <section className="grid grid-cols-3 gap-4 mb-6">
                <AccelCard title="Acc X" value={dato.ax} unit="g" />
                <AccelCard title="Acc Y" value={dato.ay} unit="g" />
                <AccelCard title="Acc Z" value={dato.az} unit="g" />
                <AccelCard title="Acc AT" value={dato.at} unit="g" />
                <AccelCard title="Temp" value={dato.T} unit="g" />
            </section>

            <section className="grid grid-cols-3 gap-4 mb-6">
                <AccelCard title="SafeCoins" value={safeCoins} unit="SC" />
                <AccelCard title="Latitud" value={dato.lat.toFixed(6)} unit="°" />
                <AccelCard title="Longitud" value={dato.lng.toFixed(6)} unit="°" />
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>Historial (últimas {history.length} muestras)</CardTitle>
                    <CardDescription>Gráfico de aceleraciones en tiempo real</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full h-64">
                        <ResponsiveContainer minWidth={0} minHeight={0}>
                            <LineChart data={history} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="t" minTickGap={20} />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="ax" stroke="#8884d8" dot={false} isAnimationActive={false} />
                                <Line type="monotone" dataKey="ay" stroke="#82ca9d" dot={false} isAnimationActive={false} />
                                <Line type="monotone" dataKey="az" stroke="#ff7300" dot={false} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <footer className="mt-4 text-sm text-muted-foreground text-center">
                Actualiza automáticamente cada segundo · Servidor: <code>/estado</code>
            </footer>
        </div>
    );
}

function AccelCard({ title, value, unit }: CardProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardDescription>{title}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-semibold flex items-baseline">
                    <span>{value}</span>
                    <span className="ml-2 text-sm text-muted-foreground">{unit}</span>
                </div>
            </CardContent>
        </Card>
    );
}