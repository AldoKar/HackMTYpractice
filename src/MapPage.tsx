import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Navigation, TrendingUp, AlertCircle, Award, Activity, BarChart3 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapPage() {
    // Datos de ejemplo
    const stats = {
        totalTrips: 145,
        safeCoinsEarned: 1250,
        averageScore: 92,
        currentStreak: 7
    };

    const recentEvents = [
        { id: 1, type: 'safe', location: 'Av. Constitución', score: 95, coins: 15 },
        { id: 2, type: 'warning', location: 'Blvd. Morelos', score: 78, coins: 5 },
        { id: 3, type: 'safe', location: 'Calzada del Valle', score: 98, coins: 20 },
    ];

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

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-8 mt-16 max-w-3xl mx-auto">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">{stats.totalTrips}</p>
                            <p className="text-sm text-gray-400 mt-1">Viajes totales</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">{stats.safeCoinsEarned}</p>
                            <p className="text-sm text-gray-400 mt-1">SafeCoins ganados</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">{stats.averageScore}%</p>
                            <p className="text-sm text-gray-400 mt-1">Score promedio</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">{stats.currentStreak}</p>
                            <p className="text-sm text-gray-400 mt-1">Días de racha</p>
                        </div>
                    </div>
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

                                {/* Marcadores de ejemplo */}
                                <Marker position={[25.6866, -100.3161]}>
                                    <Popup>
                                        <div className="text-sm">
                                            <strong>Conducción Segura</strong>
                                            <p>+20 SafeCoins</p>
                                        </div>
                                    </Popup>
                                </Marker>
                                <Marker position={[25.6800, -100.3100]}>
                                    <Popup>
                                        <div className="text-sm">
                                            <strong>Frenada Suave</strong>
                                            <p>+15 SafeCoins</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            </MapContainer>

                            {/* Leyenda sobre el mapa */}
                            <div className="absolute top-4 right-4 z-[1000] bg-gray-800/95 backdrop-blur p-4 rounded-lg border border-gray-700">
                                <h3 className="text-white font-semibold mb-3 text-sm">Eventos</h3>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                                        <span className="text-white">Frenadas bruscas</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                        <span className="text-white">Aceleraciones</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-white rounded-full"></div>
                                        <span className="text-white">Conducción segura</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Eventos Recientes */}
            <section className="bg-gray-900 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-white mb-4">
                                Eventos Recientes
                            </h2>
                            <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
                        </div>

                        <div className="grid grid-cols-3 gap-8">
                            {recentEvents.map((event) => (
                                <Card key={event.id} className="bg-gray-800 border-gray-700 hover:border-red-500 transition-all">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${event.type === 'safe' ? 'bg-white' : 'bg-gray-700'
                                                }`}>
                                                {event.type === 'safe' ? (
                                                    <Award className="w-6 h-6 text-red-600" />
                                                ) : (
                                                    <AlertCircle className="w-6 h-6 text-white" />
                                                )}
                                            </div>
                                            <Badge variant={event.type === 'safe' ? 'default' : 'secondary'} className={
                                                event.type === 'safe' ? 'bg-red-600' : 'bg-white'
                                            }>
                                                {event.type === 'safe' ? 'Seguro' : 'Atención'}
                                            </Badge>
                                        </div>

                                        <h3 className="text-white font-semibold mb-2">{event.location}</h3>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400">Score: {event.score}%</span>
                                            <span className="text-white font-semibold">+{event.coins} SafeCoins</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Estadísticas y Rendimiento */}
            <section className="bg-gray-800 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center justify-between gap-12">
                            <div className="flex-1">
                                <h2 className="text-4xl font-bold text-white mb-4">
                                    Rendimiento del Viaje
                                </h2>
                                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                                    Analiza tu comportamiento al volante con métricas detalladas. Cada viaje mejora tu score
                                    y te acerca a más <span className="font-semibold text-red-500">SafeCoins</span>.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                                            <Navigation className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold">Distancia recorrida</p>
                                            <p className="text-gray-400 text-sm">87.5 km esta semana</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                                            <TrendingUp className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold">Mejora continua</p>
                                            <p className="text-gray-400 text-sm">+12% vs. semana anterior</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                                            <Activity className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold">Eventos detectados</p>
                                            <p className="text-gray-400 text-sm">3 frenadas, 2 aceleraciones</p>
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
            <section className="bg-gray-900 py-20">
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

export default MapPage;