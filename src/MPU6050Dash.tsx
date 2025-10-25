import React, { useEffect, useState, useRef } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface HistoryItem {
    t: string
    at: number
}

interface CardProps {
    title: string
    value: number | string
    unit?: string
}

export default function MPU6050Dashboard() {
    const [dato, setDato] = useState({ lat: 0, lng: 0, at: 0, T: 0 })
    const [connected, setConnected] = useState(false)
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [suddenMovements, setSuddenMovements] = useState(0)
    const mounted = useRef(true)

    useEffect(() => {
        mounted.current = true

        async function fetchEstado() {
            try {
                const res = await fetch("http://localhost:3000/estado", { cache: "no-store" })
                if (!res.ok) throw new Error("HTTP " + res.status)
                const json = await res.json()
                if (!mounted.current) return

                // Server may return accelTotal / temp or at / T or raw.{...}
                const accel =
                    Number(json.accelTotal ?? json.at ?? json.raw?.at ?? json.raw?.accelTotal ?? 0) || 0
                const temp =
                    Number(json.temp ?? json.T ?? json.raw?.T ?? json.raw?.temp ?? NaN) || 0
                const lat = Number(json.raw?.lat ?? json.lat ?? 0) || 0
                const lng = Number(json.raw?.lng ?? json.lng ?? 0) || 0
                const lastUpdate = Number(json.lastUpdate ?? json.raw?.lastUpdate ?? 0) || 0

                setDato({ lat, lng, at: accel, T: temp })

                // Consider connected if last update was within 5s
                setConnected(Date.now() - lastUpdate < 5000)

                // Detect sudden movement (threshold 2g)
                if (accel > 2) {
                    setSuddenMovements((prev) => prev + 1)
                }

                // Append to history (keep last 60)
                setHistory((h) => {
                    const next = [
                        ...h,
                        {
                            t: new Date().toLocaleTimeString(),
                            at: Number(accel.toFixed(3)),
                        },
                    ]
                    return next.slice(-60)
                })
            } catch (err) {
                console.error("Error al obtener /estado:", err)
                setConnected(false)
            }
        }

        fetchEstado()
        const id = setInterval(fetchEstado, 1000)
        return () => {
            mounted.current = false
            clearInterval(id)
        }
    }, [])

    return (
        <div className="max-w-5xl mx-auto p-6">
            <header className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">MPU6050 — Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Lecturas de aceleración y temperatura en tiempo real</p>
                </div>
                <div className="text-right">
                    <Badge variant={connected ? "default" : "destructive"}>
                        {connected ? "Conectado" : "Desconectado"}
                    </Badge>
                </div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <AccelCard title="Aceleración (AT)" value={dato.at} unit="g" />
                <AccelCard title="Temperatura" value={dato.T} unit="°C" />
                <AccelCard title="Movimientos bruscos" value={suddenMovements} />
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>Historial (últimas {history.length} muestras)</CardTitle>
                    <CardDescription>Gráfico de aceleración total (AT)</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={history} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="t" minTickGap={20} />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="at" stroke="#8884d8" dot={false} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <footer className="mt-4 text-sm text-muted-foreground text-center">
                Actualiza automáticamente cada segundo · Endpoint: <code>/estado</code>
            </footer>
        </div>
    )
}

function AccelCard({ title, value, unit = "" }: CardProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardDescription>{title}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-semibold flex items-baseline">
                    <span>{value}</span>
                    {unit && <span className="ml-2 text-sm text-muted-foreground">{unit}</span>}
                </div>
            </CardContent>
        </Card>
    )
}