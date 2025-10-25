import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Navigation, TrendingUp, AlertCircle, Award, Activity, BarChart3, Brain, Route, Map as MapIcon, Building2, Loader2, ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
    analyzeRoute,
    generateSmartCityReport,
    monterreyZones,
    type RouteRiskAnalysis,
    type SmartCityReport
} from '@/lib/smartCityAnalyzer';
import { useState, useRef, useEffect } from 'react'

// Fix para iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapPageBanorte() {
    const [routeAnalysis, setRouteAnalysis] = useState<RouteRiskAnalysis | null>(null);
    const [smartCityReport, setSmartCityReport] = useState<SmartCityReport | null>(null);
    const [isAnalyzingRoute, setIsAnalyzingRoute] = useState(false);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [openDetails, setOpenDetails] = useState(false)
    const detailsRef = useRef<HTMLDivElement | null>(null)


    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!detailsRef.current) return
            if (!detailsRef.current.contains(e.target as Node)) setOpenDetails(false)
        }
        document.addEventListener('mousedown', onDocClick)
        return () => document.removeEventListener('mousedown', onDocClick)
    }, [])


    // Datos de ejemplo
    const stats = {
        totalTrips: 145,
        safeCoinsEarned: 1250,
        averageScore: 92,
        currentStreak: 7
    };

    // Datos para la gráfica
    const chartData = [
        { name: 'Lunes', score: 85, coins: 45 },
        { name: 'Martes', score: 88, coins: 52 },
        { name: 'Miércoles', score: 92, coins: 60 },
        { name: 'Jueves', score: 87, coins: 48 },
        { name: 'Viernes', score: 95, coins: 68 },
        { name: 'Sábado', score: 90, coins: 55 },
        { name: 'Domingo', score: 93, coins: 62 },
    ];

    // Funciones para análisis con Gemini
    const handleAnalyzeRoute = async () => {
        setIsAnalyzingRoute(true);
        try {
            // Zonas de ejemplo en la ruta Constitución → Fundidora
            const routeZones = monterreyZones.slice(0, 4);
            const analysis = await analyzeRoute(
                "Av. Constitución",
                "Blvd. Fundidora",
                routeZones
            );
            setRouteAnalysis(analysis);
        } catch (error) {
            console.error("Error al analizar ruta:", error);
        } finally {
            setIsAnalyzingRoute(false);
        }
    };

    const handleGenerateReport = async () => {
        setIsGeneratingReport(true);
        try {
            const report = await generateSmartCityReport(monterreyZones);
            setSmartCityReport(report);
        } catch (error) {
            console.error("Error al generar reporte:", error);
        } finally {
            setIsGeneratingReport(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-28 bg-gray-900">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <MapPin className="w-4 h-4" />
                        Visualiza tu Conducción
                    </div>

                    <h1 className="text-7xl font-bold text-white mb-6">
                        Mapa Interactivo
                    </h1>

                    <p className="text-2xl text-gray-300 mb-4 leading-relaxed">
                        Observa tus rutas y eventos de <span className="text-red-500 font-semibold">conducción en tiempo real</span>
                    </p>

                    <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
                        Visualiza cada frenada, aceleración y ubicación donde ganaste SafeCoins. Mejora tu comportamiento al volante con datos precisos.
                    </p>


                </div>
            </section>

            {/* Mapa Principal */}
            <section className="bg-gray-800 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-white mb-4">
                                Tu Ruta en Tiempo Real
                            </h2>
                            <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
                            <p className="text-gray-300 max-w-2xl mx-auto">
                                Cada punto en el mapa representa un evento detectado por PaySafe.
                                Identifica patrones y mejora tu conducción.
                            </p>
                        </div>

                        {/* Mapa */}
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-700">
                            <MapContainer
                                center={[25.6866, -100.3161]} // Monterrey, México
                                zoom={13}
                                className="w-full h-[600px]"
                                scrollWheelZoom={true}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                />

                            </MapContainer>

                            {/* Leyenda sobre el mapa */}
                            <div className="absolute top-4 right-4 z-1000 bg-gray-800/95 backdrop-blur p-4 rounded-lg border border-gray-700">
                                <h3 className="text-white font-semibold mb-3 text-sm">Eventos</h3>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                                        <span className="text-white">Frenadas bruscas</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Estadísticas y Rendimiento */}
            <section className="bg-gray-900 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center justify-between gap-12">
                            <div className="flex-1">
                                <h2 className="text-4xl font-bold text-white mb-4">
                                    Pay$afe Score
                                </h2>
                                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                                    Analiza tu comportamiento al volante con métricas detalladas. Cada viaje mejora tu score
                                    y te acerca a más <span className="font-semibold text-red-500">SafeCoins</span>.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 relative" ref={detailsRef}>
                                        <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                                            <TrendingUp className="w-6 h-6 text-white" />
                                        </div>

                                        <button
                                            onClick={() => setOpenDetails((s) => !s)}
                                            onMouseEnter={() => {/* opcional: mostrar en hover también */ }}
                                            className="text-white font-semibold"
                                        >
                                            Dale click para más detalles
                                        </button>

                                        <div
                                            className={
                                                "absolute top-full left-0 mt-3 w-72 bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg transform origin-top-left transition-all duration-150 " +
                                                (openDetails
                                                    ? "opacity-100 scale-100 pointer-events-auto"
                                                    : "opacity-0 scale-95 pointer-events-none")
                                            }
                                        >
                                            <p className="text-white font-medium mb-1">Pay$afe Score</p>
                                            <p className="text-sm text-gray-300">
                                                Gana score para ser mas propenso a recibir ofertas exclusivas de Banorte tales como seguro de autos
                                                con descuentos especiales, tasas preferenciales en créditos y promociones en tarjetas de crédito.
                                            </p>
                                            <div className="mt-3 text-right">
                                                <button
                                                    onClick={() => setOpenDetails(false)}
                                                    className="text-xs text-red-400 hover:underline"
                                                >
                                                    Cerrar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-700 w-64 h-64 rounded-2xl flex items-center justify-center shadow-2xl">
                                <div className="text-center">
                                    <p className="text-6xl font-bold text-white mb-2">{stats.averageScore}</p>
                                    <p className="text-gray-300 text-lg">Score Promedio</p>
                                    <div className="mt-4">
                                        <Badge className="bg-red-600 text-white">Excelente</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gráfica de Rendimiento Semanal */}
            <section id="grafica" className="bg-gray-800 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-white mb-4">
                                Rendimiento Semanal
                            </h2>
                            <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
                            <p className="text-gray-300 max-w-2xl mx-auto">
                                Observa la evolución de tu score de conducción y SafeCoins ganados durante la última semana.
                            </p>
                        </div>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white text-2xl">Últimos 7 días</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis
                                                dataKey="name"
                                                stroke="#9CA3AF"
                                                style={{ fontSize: '14px' }}
                                            />
                                            <YAxis
                                                stroke="#9CA3AF"
                                                style={{ fontSize: '14px' }}
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
                                                dataKey="score"
                                                stroke="#DC2626"
                                                strokeWidth={3}
                                                name="Score de Conducción (%)"
                                                dot={{ fill: '#DC2626', r: 5 }}
                                                activeDot={{ r: 7 }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="coins"
                                                stroke="#FFFFFF"
                                                strokeWidth={3}
                                                name="SafeCoins Ganados"
                                                dot={{ fill: '#FFFFFF', r: 5 }}
                                                activeDot={{ r: 7 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Smart City: Análisis de Rutas y Zonas de Riesgo */}
            <section className="bg-gray-900 py-20 border-t border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                                <Brain className="w-4 h-4" />
                                Análisis con IA
                            </div>
                            <h2 className="text-5xl font-bold text-white mb-4">
                                Smart City Analytics
                            </h2>
                            <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
                            <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
                                PaySafe contribuye al desarrollo de <span className="text-red-500 font-semibold">Smart Cities</span>,
                                recopilando datos sobre hábitos de conducción y zonas de riesgo. Usa Gemini AI para generar
                                reportes que apoyan a autoridades en la planificación urbana y seguridad vial.
                            </p>
                        </div>

                        {/* Análisis de Rutas */}
                        <div className="grid grid-cols-2 gap-8 mb-12">
                            {/* Tarjeta: Calcular Riesgo de Ruta */}
                            <Card className="bg-gray-800 border-gray-700 hover:border-red-500 transition-all">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                                            <Route className="w-6 h-6 text-white" />
                                        </div>
                                        <CardTitle className="text-white text-2xl">Análisis de Ruta</CardTitle>
                                    </div>
                                    <p className="text-gray-400 text-sm">
                                        Calcula el nivel de riesgo de una ruta basado en datos históricos de conducción
                                    </p>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-gray-700 p-4 rounded-lg">
                                        <p className="text-white font-semibold mb-2">Ruta de ejemplo:</p>
                                        <p className="text-gray-300 text-sm">Av. Constitución → Blvd. Fundidora</p>
                                        <p className="text-gray-400 text-xs mt-1">~8 km • Centro de Monterrey</p>
                                    </div>

                                    <Button
                                        onClick={handleAnalyzeRoute}
                                        disabled={isAnalyzingRoute}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        {isAnalyzingRoute ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Analizando con Gemini...
                                            </>
                                        ) : (
                                            <>
                                                <Brain className="w-4 h-4 mr-2" />
                                                Calcular Riesgo de Ruta
                                            </>
                                        )}
                                    </Button>

                                    {routeAnalysis && (
                                        <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            {/* Risk Badge */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-300 text-sm">Nivel de Riesgo:</span>
                                                <Badge className={
                                                    routeAnalysis.riskLevel === 'high' ? 'bg-red-600' :
                                                        routeAnalysis.riskLevel === 'medium' ? 'bg-gray-600' :
                                                            'bg-gray-700'
                                                }>
                                                    {routeAnalysis.riskLevel === 'high' ? 'Alto' :
                                                        routeAnalysis.riskLevel === 'medium' ? 'Medio' : 'Bajo'} ({routeAnalysis.riskScore}/100)
                                                </Badge>
                                            </div>

                                            {/* AI Analysis */}
                                            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                                                <div className="flex items-start gap-2 mb-2">
                                                    <Brain className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                                    <div>
                                                        <p className="text-white font-semibold text-sm mb-1">Análisis de IA</p>
                                                        <p className="text-gray-300 text-sm leading-relaxed">{routeAnalysis.aiAnalysis}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Recommendations */}
                                            <div>
                                                <p className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                                    Recomendaciones:
                                                </p>
                                                <ul className="space-y-2">
                                                    {routeAnalysis.recommendations.map((rec, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-sm">
                                                            <ChevronRight className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                                            <span className="text-gray-300">{rec}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Dangerous Zones */}
                                            {routeAnalysis.dangerousZones.length > 0 && (
                                                <div>
                                                    <p className="text-white font-semibold text-sm mb-2">Zonas más peligrosas:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {routeAnalysis.dangerousZones.map((zone, idx) => (
                                                            <Badge key={idx} variant="secondary" className="bg-gray-700 text-white">
                                                                {zone}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Tarjeta: Reporte para Autoridades */}
                            <Card className="bg-gray-800 border-gray-700 hover:border-red-500 transition-all">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                                            <Building2 className="w-6 h-6 text-white" />
                                        </div>
                                        <CardTitle className="text-white text-2xl">Reporte Smart City</CardTitle>
                                    </div>
                                    <p className="text-gray-400 text-sm">
                                        Genera reportes para autoridades con insights de planificación urbana
                                    </p>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-gray-700 p-4 rounded-lg">
                                        <p className="text-white font-semibold mb-2">Datos analizados:</p>
                                        <ul className="text-gray-300 text-sm space-y-1">
                                            <li>• {monterreyZones.length} zonas de Monterrey</li>
                                            <li>• {monterreyZones.reduce((sum, z) => sum + z.totalTrips, 0).toLocaleString()} viajes totales</li>
                                            <li>• {monterreyZones.reduce((sum, z) => sum + z.hardBrakes, 0)} frenadas bruscas</li>
                                        </ul>
                                    </div>

                                    <Button
                                        onClick={handleGenerateReport}
                                        disabled={isGeneratingReport}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        {isGeneratingReport ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Generando con Gemini...
                                            </>
                                        ) : (
                                            <>
                                                <BarChart3 className="w-4 h-4 mr-2" />
                                                Generar Reporte
                                            </>
                                        )}
                                    </Button>

                                    {smartCityReport && (
                                        <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            {/* Executive Summary */}
                                            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                                                <div className="flex items-start gap-2 mb-2">
                                                    <Brain className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                                    <div>
                                                        <p className="text-white font-semibold text-sm mb-1">Resumen Ejecutivo</p>
                                                        <p className="text-gray-300 text-sm leading-relaxed">{smartCityReport.summary}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Top Risky Zones */}
                                            <div>
                                                <p className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                                                    <MapIcon className="w-4 h-4 text-red-500" />
                                                    Top 3 Zonas de Riesgo:
                                                </p>
                                                <div className="space-y-2">
                                                    {smartCityReport.topRiskyZones.slice(0, 3).map((zone, idx) => (
                                                        <div key={idx} className="bg-gray-700 p-3 rounded-lg">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-white font-medium text-sm">{zone.name}</span>
                                                                <Badge className="bg-red-600 text-white text-xs">{zone.riskScore}/100</Badge>
                                                            </div>
                                                            <p className="text-gray-400 text-xs">
                                                                {zone.hardBrakes} frenadas • {zone.totalTrips} viajes
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Recommendations for Authorities */}
                                            <div>
                                                <p className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-red-500" />
                                                    Recomendaciones para Autoridades:
                                                </p>
                                                <ul className="space-y-2">
                                                    {smartCityReport.recommendations.slice(0, 3).map((rec, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-sm">
                                                            <ChevronRight className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                                            <span className="text-gray-300">{rec}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Urban Planning Insights */}
                                            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                                                <p className="text-white font-semibold text-sm mb-2">Planificación Urbana:</p>
                                                <p className="text-gray-300 text-sm leading-relaxed">
                                                    {smartCityReport.urbanPlanningInsights}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Mapa de Zonas de Riesgo */}
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white text-2xl flex items-center gap-3">
                                    <MapIcon className="w-6 h-6 text-red-500" />
                                    Mapa de Zonas de Riesgo - Monterrey
                                </CardTitle>
                                <p className="text-gray-400 text-sm">
                                    Visualiza las zonas con mayor incidencia de conducción imprudente
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="relative rounded-xl overflow-hidden">
                                    <MapContainer
                                        center={[25.6866, -100.3161]}
                                        zoom={12}
                                        className="w-full h-[500px]"
                                        scrollWheelZoom={true}
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                        />

                                        {/* Marcadores de zonas de riesgo */}
                                        {monterreyZones.map((zone, idx) => {
                                            // Color según nivel de riesgo
                                            const color = zone.riskScore > 70 ? '#DC2626' :
                                                zone.riskScore > 40 ? '#9CA3AF' : '#FFFFFF';

                                            const customIcon = L.divIcon({
                                                className: 'custom-marker',
                                                html: `
                                                    <div style="
                                                        background: ${color};
                                                        width: ${zone.riskScore > 70 ? '20px' : '16px'};
                                                        height: ${zone.riskScore > 70 ? '20px' : '16px'};
                                                        border-radius: 50%;
                                                        border: 2px solid white;
                                                        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                                                    "></div>
                                                `,
                                                iconSize: [20, 20],
                                                iconAnchor: [10, 10],
                                            });

                                            return (
                                                <Marker
                                                    key={idx}
                                                    position={zone.location}
                                                    icon={customIcon}
                                                >
                                                    <Popup>
                                                        <div className="text-sm min-w-[200px]">
                                                            <strong className="text-base">{zone.name}</strong>
                                                            <div className="mt-2 space-y-1">
                                                                <p><strong>Score de Riesgo:</strong> {zone.riskScore}/100</p>
                                                                <p><strong>Frenadas bruscas:</strong> {zone.hardBrakes}</p>
                                                                <p><strong>Aceleraciones:</strong> {zone.hardAccelerations}</p>
                                                                <p><strong>Giros cerrados:</strong> {zone.sharpTurns}</p>
                                                                <p><strong>Viajes totales:</strong> {zone.totalTrips}</p>
                                                                <p><strong>Velocidad promedio:</strong> {zone.avgSpeed} km/h</p>
                                                            </div>
                                                        </div>
                                                    </Popup>
                                                </Marker>
                                            );
                                        })}
                                    </MapContainer>

                                    {/* Leyenda de riesgo */}
                                    <div className="absolute bottom-4 right-4 z-1000 bg-gray-800/95 backdrop-blur p-4 rounded-lg border border-gray-700">
                                        <h3 className="text-white font-semibold mb-3 text-sm">Nivel de Riesgo</h3>
                                        <div className="space-y-2 text-xs">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white"></div>
                                                <span className="text-white">Alto (&gt;70)</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 bg-gray-500 rounded-full border-2 border-white"></div>
                                                <span className="text-white">Medio (40-70)</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 bg-white rounded-full border-2 border-gray-300"></div>
                                                <span className="text-white">Bajo (&lt;40)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Footer Info */}
            <section className="bg-gray-900 py-12 border-t border-gray-800">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-400 text-sm">
                        Datos actualizados en tiempo real. © 2025 PaySafe - Banorte
                    </p>
                </div>
            </section>
        </div>
    );
}

export default MapPageBanorte;