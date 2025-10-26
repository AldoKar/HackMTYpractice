import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { Building2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from 'react';
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

interface DeviceData {
    usuario: string;
    lat: number;
    lng: number;
    aceleracion: number;
    temperatura: number;
    dia: string;
    hora: string;
}

function MapPageBanorte() {
    const [selectedUser, setSelectedUser] = useState<string>("todos");
    const [selectedDay, setSelectedDay] = useState<string>("todos");
    const [selectedHour, setSelectedHour] = useState<string>("todos");
    const [allDevices, setAllDevices] = useState<DeviceData[]>([]);
    const [loading, setLoading] = useState(true);

    // Cargar datos del CSV
    useEffect(() => {
        const loadCSVData = async () => {
            try {
                const response = await fetch('/data/usuarios_dispositivos.csv');
                const csvText = await response.text();
                
                // Parsear CSV
                const lines = csvText.trim().split('\n');
                const headers = lines[0].split(',');
                
                const data: DeviceData[] = lines.slice(1).map(line => {
                    const values = line.split(',');
                    return {
                        usuario: values[0],
                        lat: parseFloat(values[1]),
                        lng: parseFloat(values[2]),
                        aceleracion: parseFloat(values[3]),
                        temperatura: parseFloat(values[4]),
                        dia: values[5],
                        hora: values[6]
                    };
                });
                
                setAllDevices(data);
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar datos CSV:', error);
                setLoading(false);
            }
        };

        loadCSVData();
    }, []);

    // Obtener lista única de usuarios
    const usuarios = ['todos', ...Array.from(new Set(allDevices.map(d => d.usuario)))];
    
    // Obtener lista única de días
    const dias = ['todos', ...Array.from(new Set(allDevices.map(d => d.dia)))];
    
    // Obtener rangos de horas únicos (agrupar por bloques de tiempo)
    const getHourRange = (hora: string) => {
        const hour = parseInt(hora.split(':')[0]);
        if (hour >= 7 && hour < 12) return '07:00-12:00 (Mañana)';
        if (hour >= 12 && hour < 17) return '12:00-17:00 (Tarde)';
        if (hour >= 17 && hour < 20) return '17:00-20:00 (Noche)';
        return 'Otro';
    };
    
    const hoursRanges = ['todos', '07:00-12:00 (Mañana)', '12:00-17:00 (Tarde)', '17:00-20:00 (Noche)'];

    // Filtrar dispositivos por usuario, día y hora seleccionados
    let devices = allDevices;
    if (selectedUser !== "todos") {
        devices = devices.filter(device => device.usuario === selectedUser);
    }
    if (selectedDay !== "todos") {
        devices = devices.filter(device => device.dia === selectedDay);
    }
    if (selectedHour !== "todos") {
        devices = devices.filter(device => getHourRange(device.hora) === selectedHour);
    }

    // Función para determinar el color según la aceleración
    const getColorByAcceleration = (aceleracion: number) => {
        if (aceleracion >= 2) return '#DC2626'; // Rojo - Peligroso
        if (aceleracion >= 1.5 && aceleracion < 2) return '#F59E0B'; // Amarillo - Precaución
        return '#10B981'; // Verde - Seguro
    };

    // Función para obtener el estado según la aceleración
    const getStatusByAcceleration = (aceleracion: number) => {
        if (aceleracion >= 2) return 'Peligroso';
        if (aceleracion >= 1.5 && aceleracion < 2) return 'Precaución';
        return 'Seguro';
    };

    // Calcular datos de la gráfica
    const calculateChartData = () => {
        const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        const diasCompletos = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        
        return dias.map((dia, index) => {
            const devicesDia = devices.filter(d => d.dia === diasCompletos[index]);
            
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
                            <p className="text-gray-400 mb-6">
                                Vista general de zonas monitoreadas y niveles de riesgo detectados
                            </p>
                            
                            {/* Filtros de Usuario, Día y Hora */}
                            <div className="flex items-center gap-4 mb-6 flex-wrap">
                                <span className="text-gray-300 font-semibold">Filtros:</span>
                                
                                {/* Select de Usuario */}
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 text-sm">Usuario:</span>
                                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                                        <SelectTrigger className="w-[200px] bg-gray-700 border-gray-600 text-white">
                                            <SelectValue placeholder="Selecciona un usuario" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-700 border-gray-600">
                                            <SelectItem value="todos" className="text-white hover:bg-gray-600">Todos los usuarios</SelectItem>
                                            {usuarios.filter(u => u !== 'todos').map(usuario => (
                                                <SelectItem key={usuario} value={usuario} className="text-white hover:bg-gray-600">
                                                    {usuario}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                {/* Select de Día */}
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 text-sm">Día:</span>
                                    <Select value={selectedDay} onValueChange={setSelectedDay}>
                                        <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                                            <SelectValue placeholder="Selecciona un día" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-700 border-gray-600">
                                            <SelectItem value="todos" className="text-white hover:bg-gray-600">Todos los días</SelectItem>
                                            {dias.filter(d => d !== 'todos').map(dia => (
                                                <SelectItem key={dia} value={dia} className="text-white hover:bg-gray-600">
                                                    {dia}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                {/* Select de Hora */}
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 text-sm">Horario:</span>
                                    <Select value={selectedHour} onValueChange={setSelectedHour}>
                                        <SelectTrigger className="w-[200px] bg-gray-700 border-gray-600 text-white">
                                            <SelectValue placeholder="Selecciona horario" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-700 border-gray-600">
                                            <SelectItem value="todos" className="text-white hover:bg-gray-600">Todos los horarios</SelectItem>
                                            {hoursRanges.filter(h => h !== 'todos').map(hour => (
                                                <SelectItem key={hour} value={hour} className="text-white hover:bg-gray-600">
                                                    {hour}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <Badge variant="outline" className="text-white border-gray-600">
                                    {devices.length} {devices.length === 1 ? 'registro' : 'registros'}
                                </Badge>
                            </div>
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
                                        {devices.map((device, index) => (
                                            <Circle
                                                key={`${device.usuario}-${device.lat}-${device.lng}-${index}`}
                                                center={[device.lat, device.lng]}
                                                radius={200}
                                                pathOptions={{
                                                    fillColor: getColorByAcceleration(device.aceleracion),
                                                    color: '#fff',
                                                    weight: 2,
                                                    opacity: 1,
                                                    fillOpacity: 0.8
                                                }}
                                            >
                                                <Popup>
                                                    <div className="text-sm min-w-[220px]">
                                                        <h3 className="font-bold text-gray-900 mb-3 text-base">
                                                            {device.usuario}
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
                                Análisis Semanal por Usuario
                            </h2>
                            <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
                            <p className="text-gray-300 max-w-2xl mx-auto">
                                Visualiza los promedios de aceleración y temperatura por día para cada usuario.
                            </p>
                        </div>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white text-2xl">
                                    {selectedUser === "todos" ? "Todos los usuarios" : selectedUser}
                                </CardTitle>
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



        </div>
    );
}


export default MapPageBanorte;
