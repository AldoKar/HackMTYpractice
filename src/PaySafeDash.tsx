import React, { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

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

    // Time state coming from server
    const [serverTime, setServerTime] = useState<{ hour: number; minute: number; second: number } | null>(null)
    const [serverDay, setServerDay] = useState<{ day: string; weekday: string } | null>(null)

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

            // update main values
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

            // update server time/day if available
            if (json.time && typeof json.time === "object") {
                const { hour, minute, second } = json.time
                setServerTime({ hour: Number(hour), minute: Number(minute), second: Number(second) })
            }
            if (json.day || json.weekday) {
                setServerDay({ day: json.day ?? "", weekday: json.weekday ?? "" })
            }
        }

        // Try SSE connection first
        try {
            const host = window.location.hostname || "localhost"
            const port = 3000
            const url = `${window.location.protocol}//${host}:${port}/stream`
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
            es.onerror = () => {
                // fallback to polling
                if (esRef.current) {
                    esRef.current.close()
                    esRef.current = null
                }
            }
        } catch (err) {
            // SSE not available
        }

        // Polling fallback
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

        // if SSE not ready in 2s, start polling
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

    // format time helpers
    const pad2 = (n: number) => String(n).padStart(2, "0")
    const formattedTime = serverTime
        ? `${pad2(serverTime.hour)}:${pad2(serverTime.minute)}:${pad2(serverTime.second)}`
        : "--:--:--"
    const formattedDay = serverDay ? `${serverDay.weekday ?? ""} ${serverDay.day ?? ""}` : ""

    return (
        <div className="min-h-screen min-h-[100dvh] pt-16 bg-gray-50 text-gray-900">
            <div className="max-w-6xl mx-auto p-6">
                <header className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold">PaySafe — Dashboard</h1>
                        <p className="text-sm text-muted-foreground">Lecturas y hora del servidor</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground">Servidor</div>
                            <div className="font-mono text-lg">{formattedTime}</div>
                            <div className="text-sm text-muted-foreground">{formattedDay}</div>
                        </div>

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
                                <LineChart data={history}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="t" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="at" stroke="#6366f1" dot={false} isAnimationActive={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
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