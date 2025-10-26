import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { Building2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Fix para iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapPageBanorte() {
    // Datos de dispositivos en diferentes ubicaciones de Monterrey
    const devices = [
        { id: 1, lat: 25.6866, lng: -100.3161, aceleracion: 1.2, temperatura: 28.5, status: 'safe' },
        { id: 2, lat: 25.6712, lng: -100.3089, aceleracion: 2.8, temperatura: 30.2, status: 'warning' },
        { id: 3, lat: 25.6950, lng: -100.3350, aceleracion: 0.9, temperatura: 27.1, status: 'safe' },
        { id: 4, lat: 25.6800, lng: -100.3100, aceleracion: 3.5, temperatura: 32.8, status: 'danger' },
        { id: 5, lat: 25.6600, lng: -100.2950, aceleracion: 1.5, temperatura: 29.0, status: 'safe' },
        { id: 6, lat: 25.7000, lng: -100.3200, aceleracion: 2.1, temperatura: 28.8, status: 'warning' },
        { id: 7, lat: 25.6750, lng: -100.3400, aceleracion: 0.8, temperatura: 26.5, status: 'safe' },
        { id: 8, lat: 25.6900, lng: -100.3000, aceleracion: 1.1, temperatura: 27.8, status: 'safe' },
    ];

    // Función para determinar el color según el estado
    const getColor = (status: string) => {
        switch (status) {
            case 'safe': return '#10B981'; // Verde
            case 'warning': return '#F59E0B'; // Amarillo
            case 'danger': return '#DC2626'; // Rojo
            default: return '#6B7280'; // Gris
        }
    };

    // Datos de ejemplo
    const recentEvents = [
        { id: 1, type: 'safe', location: 'Av. Constitución', score: 95, coins: 15 },
        { id: 2, type: 'warning', location: 'Blvd. Morelos', score: 78, coins: 5 },
        { id: 3, type: 'safe', location: 'Calzada del Valle', score: 98, coins: 20 },
    ];

    const chartData = [
        { name: 'Lun', score: 85, coins: 12 },
        { name: 'Mar', score: 88, coins: 15 },
        { name: 'Mié', score: 82, coins: 10 },
        { name: 'Jue', score: 90, coins: 18 },
        { name: 'Vie', score: 87, coins: 14 },
        { name: 'Sáb', score: 92, coins: 20 },
        { name: 'Dom', score: 89, coins: 16 },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Administrativo Banorte */}
            <section className="bg-gray-900 ">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold mb-3">
                                <Building2 className="w-4 h-4" />
                                Panel Banorte Administrativo
                            </div>
                            <h1 className="text-5xl font-bold text-gray-200 mb-2">
                                Gestión de Red Pay$afe
                            </h1>
                            <p className="text-xl text-gray-400">
                                Monitoreo y análisis de todos los dispositivos<span className="text-red-600 font-semibold"> Pay$afe</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mapa con estilo administrativo */}
            <section className="bg-gray-800 py-12">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-200 mb-2">
                                Mapa de Cobertura - Monterrey
                            </h2>
                            <p className="text-gray-400">
                                Vista general de zonas monitoreadas y niveles de riesgo detectados
                            </p>
                        </div>

                        {/* Mapa con diseño administrativo */}
                        <Card className="h-[600px] bg-gray-800">
                            <CardContent className="p-0 h-full bg-gray-800">
                                <div className="relative rounded-lg overflow-hidden z-0 w-full h-full bg-gray-800">
                                    <MapContainer
                                        center={[25.6866, -100.3161]}
                                        zoom={13}
                                        className="w-full h-full"
                                        scrollWheelZoom={true}
                                        doubleClickZoom={true}
                                        touchZoom={true}
                                        zoomControl={true}
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                        />
                                        
                                        {/* Markers circulares para cada dispositivo */}
                                        {devices.map((device) => (
                                            <Circle
                                                key={device.id}
                                                center={[device.lat, device.lng]}
                                                radius={200}
                                                pathOptions={{
                                                    fillColor: getColor(device.status),
                                                    color: '#fff',
                                                    weight: 2,
                                                    opacity: 1,
                                                    fillOpacity: 0.8
                                                }}
                                            >
                                                <Popup>
                                                    <div className="text-sm">
                                                        <h3 className="font-bold text-gray-900 mb-2">Dispositivo #{device.id}</h3>
                                                        <div className="space-y-1">
                                                            <p className="text-gray-700">
                                                                <span className="font-semibold">Aceleración:</span> {device.aceleracion.toFixed(2)} g
                                                            </p>
                                                            <p className="text-gray-700">
                                                                <span className="font-semibold">Temperatura:</span> {device.temperatura.toFixed(1)} °C
                                                            </p>
                                                            <p className="text-gray-700">
                                                                <span className="font-semibold">Ubicación:</span> {device.lat.toFixed(4)}, {device.lng.toFixed(4)}
                                                            </p>
                                                            <div className="mt-2">
                                                                <Badge className={
                                                                    device.status === 'safe' 
                                                                        ? 'bg-green-100 text-green-800 border border-green-300' 
                                                                        : device.status === 'warning'
                                                                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                                                        : 'bg-red-100 text-red-800 border border-red-300'
                                                                }>
                                                                    {device.status === 'safe' ? '✓ Normal' : device.status === 'warning' ? '⚠ Atención' : '🚨 Peligro'}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Popup>
                                            </Circle>
                                        ))}
                                    </MapContainer>

                                    {/* Leyenda con estilo claro */}
                                    <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur p-4 rounded-lg shadow-lg border-2 border-gray-200">
                                        <h3 className="text-gray-900 font-bold mb-3 text-sm">Indicadores</h3>
                                        <div className="space-y-2 text-xs">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-red-600 rounded-full border border-gray-300"></div>
                                                <span className="text-gray-700 font-medium">Alta Prioridad</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-yellow-500 rounded-full border border-gray-300"></div>
                                                <span className="text-gray-700 font-medium">Media Prioridad</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-green-500 rounded-full border border-gray-300"></div>
                                                <span className="text-gray-700 font-medium">Bajo Riesgo</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
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



        </div>
    );
}


export default MapPageBanorte;
