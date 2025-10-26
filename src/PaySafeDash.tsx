import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Activity, Thermometer, AlertTriangle, Clock, Calendar, Gauge, MapPin } from "lucide-react"

interface SensorData {
    lat: number | null
    lng: number | null
    at: number
    T: number
}

interface HistoryItem {
    t: string
    at: number
}

interface CardProps {
    title: string
    value: number | string
    unit?: string
    icon?: React.ElementType
    iconBg?: string
}

export default function PaySafeDashboard() {
    const [dato, setDato] = useState<SensorData>({ lat: null, lng: null, at: 0, T: 0 })
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
            console.log('Datos recibidos del servidor:', json); // Para debugging
            
            const accel = Number(json.at ?? json.accelTotal ?? json.raw?.at ?? json.raw?.accelTotal ?? 0) || 0
            const temp = Number(json.T ?? json.temp ?? json.raw?.T ?? json.raw?.temp ?? 0) || 0
            
            // Procesar coordenadas GPS
            const lat = json.lat != null ? Number(json.lat) : (json.raw?.lat != null ? Number(json.raw.lat) : null)
            const lng = json.lng != null ? Number(json.lng) : (json.raw?.lng != null ? Number(json.raw.lng) : null)
            
            console.log('Valores procesados:', { accel, temp, lat, lng }); // Para debugging
            
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
        <div className="min-h-screen bg-gray-900">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-28 bg-gray-900">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Activity className="w-4 h-4" />
                        Monitoreo en Tiempo Real
                    </div>

                    <h1 className="text-7xl font-bold text-white mb-6">
                        PaySafe Dashboard
                    </h1>

                    <p className="text-2xl text-gray-300 mb-4 leading-relaxed">
                        Monitorea tu <span className="text-red-500 font-semibold">conducción en tiempo real</span>
                    </p>

                    <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
                        Visualiza los datos del sensor MPU6050 instalado en tu vehículo. Cada lectura te ayuda a mejorar tu estilo de conducción.
                    </p>

                    {/* Status Badge */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <Badge 
                            variant={connected ? "default" : "destructive"}
                            className={`px-6 py-3 text-base ${connected ? 'bg-red-600' : 'bg-gray-600'}`}
                        >
                            <div className={`w-2 h-2 rounded-full mr-2 ${connected ? 'bg-white animate-pulse' : 'bg-gray-300'}`}></div>
                            {connected ? "Sensor Conectado" : "Sensor Desconectado"}
                        </Badge>
                    </div>

                    {/* Server Time */}
                    <div className="grid grid-cols-2 gap-8 mt-12 max-w-md mx-auto">
                        <div className="text-center bg-gray-800 p-6 rounded-lg border border-gray-700">
                            <Clock className="w-8 h-8 text-red-500 mx-auto mb-3" />
                            <p className="text-sm text-gray-400 mb-1">Hora del Servidor</p>
                            <p className="text-2xl font-bold text-white font-mono">{formattedTime}</p>
                        </div>
                        <div className="text-center bg-gray-800 p-6 rounded-lg border border-gray-700">
                            <Calendar className="w-8 h-8 text-red-500 mx-auto mb-3" />
                            <p className="text-sm text-gray-400 mb-1">Fecha</p>
                            <p className="text-xl font-bold text-white">{formattedDay || "Cargando..."}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Métricas en Tiempo Real */}
            <section className="bg-gray-800 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-white mb-4">
                                Lecturas del Sensor
                            </h2>
                            <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
                            <p className="text-gray-300 max-w-2xl mx-auto">
                                Datos recopilados en tiempo real desde el sensor MPU6050
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <MetricCard 
                                title="Aceleración Total" 
                                value={dato.at.toFixed(3)} 
                                unit="g"
                                icon={Gauge}
                                iconBg="bg-gray-700"
                            />
                            <MetricCard 
                                title="Temperatura" 
                                value={dato.T.toFixed(1)} 
                                unit="°C"
                                icon={Thermometer}
                                iconBg="bg-gray-700"
                            />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-8">
                            <MetricCard 
                                title="Latitud" 
                                value={dato.lat ? dato.lat.toFixed(6) : "N/A"} 
                                unit="°"
                                icon={MapPin}
                                iconBg="bg-blue-600"
                            />
                            <MetricCard 
                                title="Longitud" 
                                value={dato.lng ? dato.lng.toFixed(6) : "N/A"} 
                                unit="°"
                                icon={MapPin}
                                iconBg="bg-green-600"
                            />
                            <MetricCard 
                                title="Movimientos Bruscos" 
                                value={suddenMovements}
                                icon={AlertTriangle}
                                iconBg="bg-gray-700"
                            />
                            <MetricCard 
                                title="Latitud" 
                                value={dato.lat.toFixed(6)} 
                                unit="°"
                                icon={MapPin}
                                iconBg="bg-gray-700"
                            />
                            <MetricCard 
                                title="Longitud" 
                                value={dato.lng.toFixed(6)} 
                                unit="°"
                                icon={Navigation}
                                iconBg="bg-gray-700"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Gráfica de Historial */}
            <section className="bg-gray-900 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-white mb-4">
                                Historial de Aceleración
                            </h2>
                            <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
                            <p className="text-gray-300 max-w-2xl mx-auto">
                                Últimas {history.length} lecturas del sensor en tiempo real
                            </p>
                        </div>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white text-2xl">Gráfico de Aceleración Total (AT)</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={history}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis 
                                                dataKey="t" 
                                                stroke="#9CA3AF"
                                                style={{ fontSize: '12px' }}
                                            />
                                            <YAxis 
                                                stroke="#9CA3AF"
                                                style={{ fontSize: '12px' }}
                                                label={{ value: 'Aceleración (g)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                                            />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    backgroundColor: '#1F2937', 
                                                    border: '1px solid #374151',
                                                    borderRadius: '8px',
                                                    color: '#fff'
                                                }}
                                            />
                                            <Legend 
                                                wrapperStyle={{ color: '#fff' }}
                                            />
                                            <Line 
                                                type="monotone" 
                                                dataKey="at" 
                                                stroke="#DC2626" 
                                                strokeWidth={2}
                                                name="Aceleración (g)"
                                                dot={false}
                                                isAnimationActive={false}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    )
}

function MetricCard({ title, value, unit = "", icon: Icon, iconBg }: CardProps & { icon: React.ElementType, iconBg: string }) {
    return (
        <Card className="bg-gray-700 border-gray-600 hover:border-red-500 transition-all">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 ${iconBg} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">{value}</span>
                    {unit && <span className="text-lg text-gray-400">{unit}</span>}
                </div>
            </CardContent>
        </Card>
    )
}