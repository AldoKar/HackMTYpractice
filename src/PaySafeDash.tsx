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

export default function PaySafeDashboard() {
    const [dato, setDato] = useState({ lat: 0, lng: 0, at: 0, T: 0 })
    const [connected, setConnected] = useState(false)
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [suddenMovements, setSuddenMovements] = useState(0)
    const mounted = useRef(true)
    const esRef = useRef<EventSource | null>(null)

    useEffect(() => {
        mounted.current = true

        function applyPayload(json: any) {
            const accel =
                Number(json.at ?? json.accelTotal ?? json.raw?.at ?? json.raw?.accelTotal ?? 0) || 0
            const temp =
                Number(json.T ?? json.temp ?? json.raw?.T ?? json.raw?.temp ?? 0) || 0
            const lat = Number(json.lat ?? json.raw?.lat ?? 0) || 0
            const lng = Number(json.lng ?? json.raw?.lng ?? 0) || 0
            const lastUpdate = Number(json.lastUpdate ?? json.raw?.lastUpdate ?? Date.now())

            setDato({ lat, lng, at: accel, T: temp })
            setConnected(Date.now() - lastUpdate < 5000)
            if (accel > 2) setSuddenMovements((p) => p + 1)
            setHistory((h) => {
                const next = [
                    ...h,
                    { t: new Date().toLocaleTimeString(), at: Number(accel.toFixed(3)) },
                ]
                return next.slice(-60)
            })
        }

        // Try SSE connection first
        try {
            const url = `${window.location.protocol}//${window.location.hostname}:3000/stream`
            const es = new EventSource(url)
            esRef.current = es

            es.onmessage = (e) => {
                try {
                    const payload = JSON.parse(e.data)
                    if (!mounted.current) return
                    applyPayload(payload)
                } catch (err) {
                    // ignore non-json messages
                }
            }
            es.onerror = (e) => {
                console.warn("SSE error, falling back to polling", e)
                es.close()
                esRef.current = null
            }
        } catch (err) {
            // ignore, will use polling
            console.warn("SSE not available, using polling", err)
        }

        // Fallback polling every 1s if SSE not connected
        let pollId: number | null = null
        const startPolling = () => {
            if (pollId != null) return
            const fetchEstado = async () => {
                try {
                    const res = await fetch("http://localhost:3000/estado", { cache: "no-store" })
                    if (!res.ok) throw new Error("HTTP " + res.status)
                    const json = await res.json()
                    if (!mounted.current) return
                    applyPayload(json)
                } catch (err) {
                    setConnected(false)
                }
            }
            fetchEstado()
            pollId = window.setInterval(fetchEstado, 1000)
        }

        // if SSE fails to open in 2s, start polling
        const fallbackTimer = window.setTimeout(() => {
            if (!esRef.current || esRef.current.readyState !== 1) startPolling()
        }, 2000)

        return () => {
            mounted.current = false
            if (esRef.current) {
                esRef.current.close()
                esRef.current = null
            }
            if (pollId) clearInterval(pollId)
            clearTimeout(fallbackTimer)
        }
    }, [])

    return (
        <div className="max-w-5xl mx-auto p-6 bg-gray-900">
            <header className="flex items-center justify-between mb-6 bg-gray-900">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Pay$afe — Dashboard</h1>
                    <p className="text-sm text-muted-foreground text-white">Lecturas de aceleración y temperatura de tu Pay$afe en tiempo real</p>
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
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <AccelCard title="Latitud GPS" value={60} unit="°" />
                <AccelCard title="Longitud GPS" value={70} unit="°" />
                <AccelCard title="Tiempo actual" value={suddenMovements} />
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
                Actualiza en tiempo real vía SSE · Endpoint: <code>/stream</code>
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