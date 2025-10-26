import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { MapPin, TrendingUp, AlertCircle, BarChart3, Brain, Route, Map as MapIcon, Building2, Loader2, ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { supabase } from "./lib/supabase"






// Fix para iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapPage() {
    const [routeAnalysis, setRouteAnalysis] = useState<RouteRiskAnalysis | null>(null);
    const [smartCityReport, setSmartCityReport] = useState<SmartCityReport | null>(null);
    const [isAnalyzingRoute, setIsAnalyzingRoute] = useState(false);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [openDetails, setOpenDetails] = useState(false)
    const detailsRef = useRef<HTMLDivElement | null>(null)
    const [gpsLogs, setGpsLogs] = useState<Array<{latitude: number, longitude: number, user_id: string}>>([]);
    const [selectedDay, setSelectedDay] = useState<string>("todos");

    // Datos de dispositivos en Monterrey con aceleración, temperatura, día y hora
    const allDevices = [
        // Lunes
        { lat: 25.6866, lng: -100.3161, aceleracion: 0.8, temperatura: 28.5, dia: 'Lunes', hora: '08:15' },
        { lat: 25.6712, lng: -100.3089, aceleracion: 1.3, temperatura: 30.2, dia: 'Lunes', hora: '09:45' },
        { lat: 25.6950, lng: -100.3350, aceleracion: 1.7, temperatura: 27.1, dia: 'Lunes', hora: '12:30' },
        { lat: 25.6800, lng: -100.3100, aceleracion: 2.5, temperatura: 32.8, dia: 'Lunes', hora: '14:20' },
        { lat: 25.6600, lng: -100.2950, aceleracion: 1.1, temperatura: 29.0, dia: 'Lunes', hora: '16:05' },
        
        // Martes
        { lat: 25.7000, lng: -100.3200, aceleracion: 1.4, temperatura: 28.8, dia: 'Martes', hora: '07:50' },
        { lat: 25.6750, lng: -100.3400, aceleracion: 2.8, temperatura: 26.5, dia: 'Martes', hora: '10:15' },
        { lat: 25.6900, lng: -100.3000, aceleracion: 0.9, temperatura: 27.8, dia: 'Martes', hora: '11:40' },
        { lat: 25.6650, lng: -100.3250, aceleracion: 1.6, temperatura: 31.2, dia: 'Martes', hora: '13:25' },
        { lat: 25.6920, lng: -100.3120, aceleracion: 2.2, temperatura: 29.5, dia: 'Martes', hora: '15:50' },
        
        // Miércoles
        { lat: 25.6780, lng: -100.3180, aceleracion: 1.2, temperatura: 30.1, dia: 'Miércoles', hora: '08:30' },
        { lat: 25.6850, lng: -100.3050, aceleracion: 1.8, temperatura: 28.3, dia: 'Miércoles', hora: '09:20' },
        { lat: 25.6700, lng: -100.3300, aceleracion: 0.7, temperatura: 26.9, dia: 'Miércoles', hora: '11:00' },
        { lat: 25.6950, lng: -100.3150, aceleracion: 2.1, temperatura: 31.5, dia: 'Miércoles', hora: '13:45' },
        { lat: 25.6620, lng: -100.3080, aceleracion: 1.5, temperatura: 29.7, dia: 'Miércoles', hora: '16:30' },
        
        // Jueves
        { lat: 25.6880, lng: -100.3220, aceleracion: 1.0, temperatura: 27.5, dia: 'Jueves', hora: '07:45' },
        { lat: 25.6730, lng: -100.3110, aceleracion: 2.4, temperatura: 32.1, dia: 'Jueves', hora: '10:05' },
        { lat: 25.6990, lng: -100.3280, aceleracion: 1.3, temperatura: 28.6, dia: 'Jueves', hora: '12:15' },
        { lat: 25.6580, lng: -100.2980, aceleracion: 0.8, temperatura: 27.2, dia: 'Jueves', hora: '14:40' },
        { lat: 25.6940, lng: -100.3090, aceleracion: 1.9, temperatura: 30.8, dia: 'Jueves', hora: '17:10' },
        
        // Viernes
        { lat: 25.6820, lng: -100.3170, aceleracion: 1.6, temperatura: 29.4, dia: 'Viernes', hora: '08:00' },
        { lat: 25.6680, lng: -100.3240, aceleracion: 2.7, temperatura: 31.9, dia: 'Viernes', hora: '09:30' },
        { lat: 25.6970, lng: -100.3320, aceleracion: 1.1, temperatura: 26.8, dia: 'Viernes', hora: '11:50' },
        { lat: 25.6640, lng: -100.3060, aceleracion: 1.4, temperatura: 28.1, dia: 'Viernes', hora: '13:20' },
        { lat: 25.6910, lng: -100.3140, aceleracion: 2.0, temperatura: 30.3, dia: 'Viernes', hora: '16:45' },
        
        // Sábado
        { lat: 25.6760, lng: -100.3200, aceleracion: 0.9, temperatura: 27.9, dia: 'Sábado', hora: '10:20' },
        { lat: 25.6890, lng: -100.3070, aceleracion: 1.5, temperatura: 29.2, dia: 'Sábado', hora: '12:00' },
        { lat: 25.6610, lng: -100.3150, aceleracion: 2.3, temperatura: 31.6, dia: 'Sábado', hora: '14:30' },
        { lat: 25.6980, lng: -100.3260, aceleracion: 1.2, temperatura: 28.4, dia: 'Sábado', hora: '16:15' },
        { lat: 25.6720, lng: -100.3190, aceleracion: 1.7, temperatura: 30.0, dia: 'Sábado', hora: '18:00' },
        
        // Domingo
        { lat: 25.6840, lng: -100.3130, aceleracion: 0.6, temperatura: 26.5, dia: 'Domingo', hora: '11:10' },
        { lat: 25.6670, lng: -100.3270, aceleracion: 1.4, temperatura: 28.7, dia: 'Domingo', hora: '13:00' },
        { lat: 25.6930, lng: -100.3040, aceleracion: 2.6, temperatura: 32.4, dia: 'Domingo', hora: '15:20' },
        { lat: 25.6790, lng: -100.3210, aceleracion: 1.0, temperatura: 27.6, dia: 'Domingo', hora: '17:45' },
        { lat: 25.6960, lng: -100.3160, aceleracion: 1.8, temperatura: 29.9, dia: 'Domingo', hora: '19:30' },
    ];

    // Filtrar dispositivos por día seleccionado
    const devices = selectedDay === "todos" 
        ? allDevices 
        : allDevices.filter(device => device.dia === selectedDay);

    // Función para determinar el color según la aceleración
    const getColorByAcceleration = (aceleracion: number) => {
        if (aceleracion >= 2) return '#DC2626'; // Rojo - Peligroso
        if (aceleracion >= 1.5 && aceleracion < 2) return '#F59E0B'; // Amarillo - Precaución
        if (aceleracion >= 1 && aceleracion < 1.5) return '#10B981'; // Verde - Seguro
        return '#10B981'; // Verde por defecto para valores < 1
    };

    // Función para obtener el estado según la aceleración
    const getStatusByAcceleration = (aceleracion: number) => {
        if (aceleracion >= 2) return 'Peligroso';
        if (aceleracion >= 1.5 && aceleracion < 2) return 'Precaución';
        return 'Seguro';
    };

useEffect(() => {
  async function fetchLogs() {
    const { data, error } = await supabase
      .from('sensordata')
      .select('latitude, longitude, user_id');

    if (error) {
      console.error('Error fetching GPS logs:', error);
      return;
    }

    setGpsLogs(data || []);
  }

  fetchLogs();
}, []);


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

    // Calcular datos de la gráfica basados en los dispositivos reales
    const calculateChartData = () => {
        const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        
        return dias.map(dia => {
            const devicesDia = allDevices.filter(d => d.dia === dia);
            
            if (devicesDia.length === 0) {
                return { name: dia, aceleracionPromedio: 0, temperatura: 0, registros: 0 };
            }
            
            const aceleracionPromedio = devicesDia.reduce((sum, d) => sum + d.aceleracion, 0) / devicesDia.length;
            const temperaturaPromedio = devicesDia.reduce((sum, d) => sum + d.temperatura, 0) / devicesDia.length;
            
            return {
                name: dia,
                aceleracionPromedio: Number(aceleracionPromedio.toFixed(2)),
                temperatura: Number(temperaturaPromedio.toFixed(1)),
                registros: devicesDia.length
            };
        });
    };

    const chartData = calculateChartData();
    
    // Filtrar datos de la gráfica si hay un día seleccionado
    const filteredChartData = selectedDay === "todos" 
        ? chartData 
        : chartData.filter(data => data.name === selectedDay);

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
                            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
                                Cada punto en el mapa representa un evento detectado por PaySafe.
                                Identifica patrones y mejora tu conducción.
                            </p>
                            
                            {/* Filtro de Día */}
                            <div className="flex items-center justify-center gap-3 mb-8">
                                <span className="text-gray-300 font-semibold">Filtrar por día:</span>
                                <Select value={selectedDay} onValueChange={setSelectedDay}>
                                    <SelectTrigger className="w-[200px] bg-gray-700 border-gray-600 text-white">
                                        <SelectValue placeholder="Selecciona un día" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-700 border-gray-600">
                                        <SelectItem value="todos" className="text-white hover:bg-gray-600">Todos los días</SelectItem>
                                        <SelectItem value="Lunes" className="text-white hover:bg-gray-600">Lunes</SelectItem>
                                        <SelectItem value="Martes" className="text-white hover:bg-gray-600">Martes</SelectItem>
                                        <SelectItem value="Miércoles" className="text-white hover:bg-gray-600">Miércoles</SelectItem>
                                        <SelectItem value="Jueves" className="text-white hover:bg-gray-600">Jueves</SelectItem>
                                        <SelectItem value="Viernes" className="text-white hover:bg-gray-600">Viernes</SelectItem>
                                        <SelectItem value="Sábado" className="text-white hover:bg-gray-600">Sábado</SelectItem>
                                        <SelectItem value="Domingo" className="text-white hover:bg-gray-600">Domingo</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Badge variant="outline" className="text-white border-gray-600">
                                    {devices.length} {devices.length === 1 ? 'registro' : 'registros'}
                                </Badge>
                            </div>
                        </div>

                        {/* Mapa */}
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-700 z-0">
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

                                {/* Círculos de dispositivos con código de colores */}
                                {devices.map((device, index) => (
                                    <Circle
                                        key={`${device.lat}-${device.lng}-${index}`}
                                        center={[device.lat, device.lng]}
                                        radius={200}
                                        pathOptions={{
                                            fillColor: getColorByAcceleration(device.aceleracion),
                                            color: '#fff',
                                            weight: 2,
                                            opacity: 1,
                                            fillOpacity: 0.7
                                        }}
                                    >
                                        <Popup>
                                            <div className="text-sm min-w-[220px]">
                                                <h3 className="font-bold text-gray-900 mb-3 text-base">
                                                    Registro de Dispositivo
                                                </h3>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="text-gray-700 font-semibold">Día:</span>
                                                        <span className="font-mono text-gray-900">
                                                            {device.dia}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="text-gray-700 font-semibold">Hora:</span>
                                                        <span className="font-mono text-gray-900">
                                                            {device.hora}
                                                        </span>
                                                    </div>
                                                    <div className="border-t border-gray-200 pt-2 mt-2"></div>
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="text-gray-700 font-semibold">Aceleración:</span>
                                                        <span className="font-mono font-bold" style={{ color: getColorByAcceleration(device.aceleracion) }}>
                                                            {device.aceleracion.toFixed(2)} g
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="text-gray-700 font-semibold">Temperatura:</span>
                                                        <span className="font-mono text-gray-900">
                                                            {device.temperatura.toFixed(1)} °C
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="text-gray-700 font-semibold text-xs">Ubicación:</span>
                                                        <span className="text-gray-600 text-xs">
                                                            {device.lat.toFixed(4)}, {device.lng.toFixed(4)}
                                                        </span>
                                                    </div>
                                                    <div className="mt-3 pt-2 border-t border-gray-200">
                                                        <Badge 
                                                            className={
                                                                device.aceleracion >= 2 
                                                                    ? 'bg-red-100 text-red-800 border border-red-300' 
                                                                    : device.aceleracion >= 1.5
                                                                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                                                    : 'bg-green-100 text-green-800 border border-green-300'
                                                            }
                                                        >
                                                            {device.aceleracion >= 2 ? '🚨 ' : device.aceleracion >= 1.5 ? '⚠️ ' : '✓ '}
                                                            {getStatusByAcceleration(device.aceleracion)}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Circle>
                                ))}

                            </MapContainer>

                            {/* Leyenda sobre el mapa */}
                            <div className="absolute top-4 right-4 z-10 bg-gray-800/95 backdrop-blur p-4 rounded-lg border border-gray-700">
                                <h3 className="text-white font-semibold mb-3 text-sm">Niveles de Aceleración</h3>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                                        <span className="text-white">Peligroso (≥2.0 g)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <span className="text-white">Precaución (1.5-2.0 g)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-white">Seguro (&lt;1.5 g)</span>
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
                                Análisis por Día
                            </h2>
                            <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
                            <p className="text-gray-300 max-w-2xl mx-auto">
                                Visualiza los promedios de aceleración y temperatura por día de la semana.
                            </p>
                        </div>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white text-2xl">
                                    {selectedDay === "todos" ? "Todos los días" : selectedDay}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={filteredChartData}>
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
                                                formatter={(value: any, name: string) => {
                                                    if (name === 'aceleracionPromedio') return [value + ' g', 'Aceleración Promedio'];
                                                    if (name === 'temperatura') return [value + ' °C', 'Temperatura Promedio'];
                                                    if (name === 'registros') return [value, 'Número de Registros'];
                                                    return [value, name];
                                                }}
                                            />
                                            <Legend
                                                wrapperStyle={{ color: '#fff' }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="aceleracionPromedio"
                                                stroke="#DC2626"
                                                strokeWidth={3}
                                                name="Aceleración Promedio (g)"
                                                dot={{ fill: '#DC2626', r: 5 }}
                                                activeDot={{ r: 7 }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="temperatura"
                                                stroke="#F59E0B"
                                                strokeWidth={3}
                                                name="Temperatura Promedio (°C)"
                                                dot={{ fill: '#F59E0B', r: 5 }}
                                                activeDot={{ r: 7 }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="registros"
                                                stroke="#10B981"
                                                strokeWidth={3}
                                                name="Número de Registros"
                                                dot={{ fill: '#10B981', r: 5 }}
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
                                <div className="relative rounded-xl overflow-hidden z-0">
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

                                        {gpsLogs.map((log, idx) => (
                                            <Marker
                                                key={idx}
                                                position={[log.latitude, log.longitude]}
                                            >
                                                <Popup>
                                                    <div>
                                                        <p><strong>Usuario:</strong> {log.user_id}</p>
                                                        <p><strong>Lat:</strong> {log.latitude.toFixed(5)}</p>
                                                        <p><strong>Lng:</strong> {log.longitude.toFixed(5)}</p>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        ))}

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
                                    <div className="absolute bottom-4 right-4 z-10 bg-gray-800/95 backdrop-blur p-4 rounded-lg border border-gray-700">
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
        </div>
    );
}

export default MapPage;