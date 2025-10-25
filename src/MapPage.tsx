// ...existing code...
import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function MapPage() {
    return (
        <div className="min-h-screen bg-gray-900">
            <div className="min-h-screen min-h-[100dvh] w-full bg-gray-50 text-gray-900">


                <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
                    {/* MAP - visible primero, responsive height */}
                    <section className="relative w-full rounded-lg overflow-hidden shadow-sm">
                        <MapContainer
                            center={[40.7128, -74.0060]}
                            zoom={11}
                            className="w-full h-[40vh] sm:h-[45vh] md:h-[55vh] lg:h-[60vh]"
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &amp; CARTO'
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            />
                        </MapContainer>

                        {/* overlay controls / legend */}
                        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                            <button className="bg-white/90 text-sm px-3 py-1 rounded-lg shadow-sm hover:shadow-md">Center</button>
                            <button className="bg-white/90 text-sm px-3 py-1 rounded-lg shadow-sm hover:shadow-md">Layers</button>
                        </div>
                    </section>

                    {/* Resizable two-panel area: left = chart, right = text */}
                    <section className="w-full h-[45vh] sm:h-[40vh] md:h-[35vh] lg:h-[30vh]">
                        <ResizablePanelGroup direction="horizontal" className="h-full w-full bg-transparent">
                            <ResizablePanel defaultSize={70} className="h-full">
                                <div className="h-full w-full bg-white rounded-l-lg shadow-sm p-4 overflow-hidden flex flex-col">
                                    <h2 className="text-lg font-medium mb-3">Rendimiento - Últimos viajes</h2>
                                    <div className="flex-1 min-h-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={[{ name: 'Trip A', uv: 400 }, { name: 'Trip B', uv: 300 }, { name: 'Trip C', uv: 500 }]}>
                                                <CartesianGrid strokeDasharray="3 3" opacity={0.6} />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="uv" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </ResizablePanel>

                            <ResizableHandle />

                            <ResizablePanel defaultSize={30} className="h-full">
                                <div className="h-full w-full bg-white rounded-r-lg shadow-sm p-6 overflow-auto flex items-center">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Resumen rápido</h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Métricas sintetizadas del viaje actual. Aquí puedes mostrar alertas, score de conducción,
                                            consumo estimado o acciones recomendadas.
                                        </p>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-green-400 rounded-full" /> Condición: Estable
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-amber-400 rounded-full" /> Consumo estimado: 6.8 L/100km
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-red-400 rounded-full" /> Alertas: 0
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </section>
                </main>
            </div>
        </div>
    )
}

export default MapPage
// ...existing code...