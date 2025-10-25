import { MapContainer, TileLayer } from 'react-leaflet';
import { Building2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapPageBanorte() {
    // Datos de ejemplo
    const recentEvents = [
        { id: 1, type: 'safe', location: 'Av. Constitución', score: 95, coins: 15 },
        { id: 2, type: 'warning', location: 'Blvd. Morelos', score: 78, coins: 5 },
        { id: 3, type: 'safe', location: 'Calzada del Valle', score: 98, coins: 20 },
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
                                Monitoreo y análisis de dispositivos en <span className="text-red-600 font-semibold">tiempo real</span>
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
                        <Card className="bg-white shadow-lg border-2 border-gray-200">
                            <CardContent className="p-0">
                                <div className="relative rounded-lg overflow-hidden z-0">
                                    <MapContainer
                                        center={[25.6866, -100.3161]}
                                        zoom={13}
                                        className="w-full h-[500px]"
                                        scrollWheelZoom={true}
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
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

            {/* Tabla de Eventos */}
            <section className="bg-gray-900 py-12">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-200 mb-2">
                                Registro de Eventos Recientes
                            </h2>
                            <p className="text-gray-400">
                                Últimos eventos detectados en la red
                            </p>
                        </div>

                        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-red-600 text-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Ubicación</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Tipo</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Score</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">SafeCoins</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {recentEvents.map((event) => (
                                        <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-200 font-medium">#{event.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-200">{event.location}</td>
                                            <td className="px-6 py-4">
                                                <Badge className={
                                                    event.type === 'safe' 
                                                        ? 'bg-green-100 text-green-800 border border-green-300' 
                                                        : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                                }>
                                                    {event.type === 'safe' ? '✓ Seguro' : '⚠ Atención'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-200 font-semibold">{event.score}%</td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-200">+{event.coins}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* Resto de secciones omitidas por brevedad */}
            <section className="bg-gray-800 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-gray-200 mb-4">
                            Vista Administrativa Banorte
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Panel diseñado para supervisión y análisis de la red Pay$afe
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}


export default MapPageBanorte;
