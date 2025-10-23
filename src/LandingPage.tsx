import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Shield, DollarSign, Car } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Landing page simple con Shadcn UI
// Requisitos: Shadcn UI instalado, Tailwind CSS configurado
// npm install lucide-react leaflet react-leaflet
// Para el mapa, instala leaflet y react-leaflet si quieres funcionalidad completa

export default function LandingPage() {

    const { user } = useAuth();


    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                    PaySafe
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Nuestra app te recompensa por conducir de manera responsable. Nuestro dispositivo detecta cambios bruscos y los registra en un mapa interactivo para premiar tu seguridad.
                </p>
                <Link to={user ? "/dashboard" : "/register"}>
                    <Button size="lg" className="text-lg px-8 py-3">
                        {user ? "Ir al Dashboard" : "Comenzar Ahora"}
                    </Button>
                </Link>


            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                    ¿Cómo Funciona?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card>
                        <CardHeader>
                            <Shield className="w-12 h-12 text-blue-600 mb-4" />
                            <CardTitle>Detección Inteligente</CardTitle>
                            <CardDescription>
                                Nuestro dispositivo monitorea tus aceleraciones y frenadas para identificar conductas seguras.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <MapPin className="w-12 h-12 text-green-600 mb-4" />
                            <CardTitle>Mapa Interactivo</CardTitle>
                            <CardDescription>
                                Visualiza tus rutas y eventos en un mapa en tiempo real con Leaflet.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <DollarSign className="w-12 h-12 text-yellow-600 mb-4" />
                            <CardTitle>Gana Recompensas</CardTitle>
                            <CardDescription>
                                Acumula puntos por cada kilómetro conducido de forma segura y canjéalos por dinero.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </section>

            {/* Map Section */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                    Tu Seguridad en el Mapa
                </h2>
                <Card className="max-w-4xl mx-auto">
                    <CardContent className="p-0">
                        <div className="h-96 bg-gray-200 flex items-center justify-center">
                            <div className="text-center">
                                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">Mapa Interactivo con Leaflet</p>
                                <p className="text-sm text-gray-400">Aquí se mostrarían tus rutas y eventos detectados</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* CTA Section */}
            <section className="bg-blue-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        ¡Únete y Comienza a Ganar!
                    </h2>
                    <p className="text-xl mb-8">
                        Conecta tu dispositivo hoy mismo.
                    </p>
                    <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                        Conectar PaySafe
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <p> 2025 PaySafe</p>
                </div>
            </footer>
        </div>
    );
}