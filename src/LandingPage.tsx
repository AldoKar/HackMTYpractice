import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Shield, DollarSign, Car, TrendingUp, Award, Gauge, Coins, ChevronRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import TextType from './TextType';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function LandingPage() {
    const { user } = useAuth();
    const [hasShownWelcome, setHasShownWelcome] = useState(() => {
        // Verificar si ya se mostró el mensaje antes (guardado en localStorage)
        return localStorage.getItem('paysafe-welcome-shown') === 'true';
    });

    // Mensaje de bienvenida inicial (toast) - solo en LandingPage y solo la primera vez
    useEffect(() => {
        if (!hasShownWelcome) {
            const timer = setTimeout(() => {
                toast(
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                            <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-white text-base mb-1">¡Bienvenido a Pay$afe! 🚗✨</h3>
                            <p className="text-gray-300 text-sm">Aquí estoy para ayudarte con cualquier duda o consulta. Haz clic en el botón rojo para chatear conmigo.</p>
                        </div>
                    </div>,
                    {
                        duration: 6000,
                        style: {
                            background: '#1F2937',
                            border: '1px solid #374151',
                            padding: '16px',
                        }
                    }
                );
                setHasShownWelcome(true);
                localStorage.setItem('paysafe-welcome-shown', 'true');
            }, 1500);
            
            return () => clearTimeout(timer);
        }
    }, [hasShownWelcome]);

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-28 bg-foregound">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Award className="w-4 h-4" />
                        Tu manejo seguro vale mas
                    </div>

                    <h1 className="text-7xl font-bold text-white mb-6">
                        <TextType
                            text="Pay$afe"
                            typingSpeed={175}
                            pauseDuration={1500}
                            showCursor={false}
                        />
                    </h1>

                    <p className="text-2xl text-gray-300 mb-4 leading-relaxed">
                        El primer dispositivo inteligente que <span className="text-red-500 font-semibold">te paga por manejar bien</span>
                    </p>

                    <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
                        Transforma tu forma de conducir en ingresos reales. Pay$afe monitorea tu comportamiento al volante
                        y te recompensa con <span className="font-semibold text-red-600">SafeCoins</span> que puedes canjear por dinero,
                        descuentos en gasolina, seguros más baratos y beneficios exclusivos de Banorte.
                    </p>

                    <div className="flex gap-4 justify-center items-center">
                        <Link to={user ? "/dashboard" : "/register"}>
                            <Button size="lg" className="text-lg px-8 py-6 bg-red-600 hover:bg-red-700 text-white font-semibold">
                                {user ? "Ir al Dashboard" : "Comenzar Ahora"}
                                <ChevronRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Button size="lg" className="text-lg px-10 py-6 bg-gray-800 text-white hover:bg-gray-700 border-2 border-white font-semibold">
                            Comprar Dispositivo
                        </Button>
                    </div>
                </div>
            </section>

            {/* Introducción - Qué es Pay$afe */}
            <section className="bg-gray-800 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-white mb-4">
                                ¿Qué es Pay$afe?
                            </h2>
                            <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-12 items-center">
                            <div>
                                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                                    Pay$afe es un <span className="font-semibold text-red-600">dispositivo inteligente MPU6050</span> que
                                    se conecta fácilmente a tu vehículo y analiza tu forma de conducir en tiempo real.
                                </p>
                                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                                    A través de sensores de movimiento avanzados, detecta aceleraciones bruscas, frenadas repentinas
                                    y giros agresivos. Mientras más suave y segura sea tu conducción,
                                    <span className="font-semibold text-red-600"> más SafeCoins ganas</span>.
                                </p>
                                <p className="text-lg text-gray-300 leading-relaxed">
                                    Tus SafeCoins se pueden canjear por dinero real, descuentos en gasolina, seguros de auto más económicos,
                                    entradas a eventos, y acceso a productos financieros exclusivos de Banorte.
                                </p>
                            </div>

                            <div className="bg-linear-to-br from-gray-700 to-gray-800 p-8 rounded-2xl">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-gray-600 text-white p-3 rounded-lg">
                                            <Car className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white mb-1">Instalación Simple</h3>
                                            <p className="text-gray-300">Conecta el dispositivo en 5 minutos sin herramientas</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-gray-600 text-white p-3 rounded-lg">
                                            <Gauge className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white mb-1">Monitoreo 24/7</h3>
                                            <p className="text-gray-300">Análisis continuo de tu comportamiento al volante</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-gray-600 text-white p-3 rounded-lg">
                                            <Coins className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white mb-1">Recompensas Automáticas</h3>
                                            <p className="text-gray-300">Gana SafeCoins por cada viaje seguro</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cómo Funciona - Paso a Paso */}
            <section className="container mx-auto px-4 py-20 bg-gray-900">
                <h2 className="text-4xl font-bold text-center text-white mb-4">
                    ¿Cómo Funciona?
                </h2>
                <div className="w-20 h-1 bg-red-600 mx-auto mb-16"></div>

                <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <Card className="border-2 border-red-600/50 hover:border-red-600 transition-all hover:shadow-xl bg-gray-800/50 backdrop-blur">
                        <CardHeader className="text-center">
                            <div className="mx-auto bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <CardTitle className="text-xl text-white">1. Detección Inteligente</CardTitle>
                            <CardDescription className="text-base mt-3 text-gray-300">
                                El sensor MPU6050 integrado monitorea en tiempo real cada movimiento de tu vehículo:
                                aceleraciones, frenadas y giros. Identifica patrones de conducción segura vs conducción agresiva.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-2 border-gray-600 hover:border-gray-400 transition-all hover:shadow-xl bg-gray-800/50 backdrop-blur">
                        <CardHeader className="text-center">
                            <div className="mx-auto bg-gray-500 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                <TrendingUp className="w-8 h-8 text-white" />
                            </div>
                            <CardTitle className="text-xl text-white">2. Análisis y Puntuación</CardTitle>
                            <CardDescription className="text-base mt-3 text-gray-300">
                                Cada viaje recibe un score de seguridad basado en suavidad de manejo, velocidad adecuada
                                y prevención de riesgos. Tu comportamiento se traduce en SafeCoins automáticamente.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-2 border-red-600/50 hover:border-red-600 transition-all hover:shadow-xl bg-gray-800/50 backdrop-blur">
                        <CardHeader className="text-center">
                            <div className="mx-auto bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                <DollarSign className="w-8 h-8 text-white" />
                            </div>
                            <CardTitle className="text-xl text-white">3. Gana Recompensas</CardTitle>
                            <CardDescription className="text-base mt-3 text-gray-300">
                                Acumula SafeCoins por kilómetro recorrido de forma segura. Canjéalos por dinero real,
                                cupones de gasolina, descuentos en seguros o beneficios exclusivos de Banorte.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </section>

            {/* Visualización en Tiempo Real */}
            <section className="bg-linear-to-b from-gray-800 to-gray-700 py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center text-white mb-4">
                        Tu Seguridad Visualizada
                    </h2>
                    <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
                    <p className="text-center text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
                        Observa en tiempo real cada evento detectado en un mapa interactivo.
                        Identifica zonas de riesgo y mejora tu comportamiento al volante.
                    </p>

                    <Card className="max-w-5xl mx-auto shadow-2xl">
                        <CardContent className="p-0">
                            <div className="h-96 bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                                <div className="text-center z-10">
                                    <MapPin className="w-20 h-20 text-red-500/70 mx-auto mb-6 animate-pulse" />
                                    <p className="text-xl font-semibold text-white mb-2">Mapa Interactivo en Tiempo Real</p>
                                    <p className="text-gray-300 max-w-md mx-auto">
                                        Visualiza tus rutas, eventos de frenado, aceleración y ubicaciones donde ganaste más SafeCoins
                                    </p>
                                    <div className="mt-6 flex gap-4 justify-center flex-wrap">
                                        <div className="bg-red-600 px-4 py-2 rounded-full border-2 border-red-500">
                                            <span className="text-white font-medium">● Frenadas bruscas</span>
                                        </div>
                                        <div className="bg-gray-700 px-4 py-2 rounded-full border-2 border-gray-600">
                                            <span className="text-white font-medium">● Aceleraciones</span>
                                        </div>
                                        <div className="bg-white px-4 py-2 rounded-full border-2 border-gray-300">
                                            <span className="text-gray-900 font-medium">● Conducción segura</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Beneficios Exclusivos - ScrollStack */}
            <section className="relative bg-linear-to-b from-gray-900 to-gray-800">
                <div className="sticky top-0 py-20 bg-gray-900/95 backdrop-blur-sm z-10">
                    <h2 className="text-4xl font-bold text-center text-white mb-4">
                        Beneficios Exclusivos
                    </h2>
                    <div className="w-20 h-1 bg-red-600 mx-auto mb-8"></div>
                </div>

                <ScrollStack
                    useWindowScroll={true}
                    itemDistance={150}
                    itemScale={0.05}
                    itemStackDistance={12}
                    stackPosition="30%"
                    scaleEndPosition="25%"
                    baseScale={0.92}
                >
                    <ScrollStackItem itemClassName="bg-gradient-to-br from-red-600 to-red-700 border-2 border-red-500 max-w-5xl mx-auto opacity-100">
                        <div className="flex flex-col items-center justify-center h-full text-center px-8" style={{ opacity: 1, backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
                                <Coins className="w-10 h-10 text-red-600" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4">Cupones de Gasolina</h3>
                            <p className="text-lg text-red-50 max-w-2xl">
                                Canjea tus SafeCoins por descuentos de hasta <span className="font-bold text-white">20%</span> en estaciones de servicio afiliadas.
                                Cada vez que llenas tu tanque, recuperas parte de tu inversión en seguridad.
                            </p>
                        </div>
                    </ScrollStackItem>

                    <ScrollStackItem itemClassName="bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300 max-w-5xl mx-auto opacity-100">
                        <div className="flex flex-col items-center justify-center h-full text-center px-8" style={{ opacity: 1, backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
                            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                                <Shield className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Seguro de Auto Económico</h3>
                            <p className="text-lg text-gray-700 max-w-2xl">
                                Los conductores seguros obtienen hasta <span className="font-bold text-red-600">30% de descuento</span> en pólizas de seguro automotriz.
                                Tu historial de conducción responsable se traduce en ahorros reales.
                            </p>
                        </div>
                    </ScrollStackItem>

                    <ScrollStackItem itemClassName="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 max-w-5xl mx-auto opacity-100">
                        <div className="flex flex-col items-center justify-center h-full text-center px-8" style={{ opacity: 1, backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
                            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                                <Award className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Eventos Exclusivos</h3>
                            <p className="text-lg text-gray-700 max-w-2xl">
                                Accede a conciertos, cine y eventos deportivos de manera preferencial.
                                Usa tus SafeCoins para experiencias inolvidables sin gastar dinero extra.
                            </p>
                        </div>
                    </ScrollStackItem>

                    <ScrollStackItem itemClassName="bg-gradient-to-br from-red-600 to-red-700 border-2 border-red-500 max-w-5xl mx-auto opacity-100">
                        <div className="flex flex-col items-center justify-center h-full text-center px-8" style={{ opacity: 1, backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
                                <TrendingUp className="w-10 h-10 text-red-600" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4">Créditos Banorte</h3>
                            <p className="text-lg text-red-50 max-w-2xl">
                                Mejora tu Score Banorte automáticamente y accede a tasas preferenciales en créditos automotrices.
                                Conducir bien mejora tu perfil crediticio.
                            </p>
                        </div>
                    </ScrollStackItem>

                    <ScrollStackItem itemClassName="bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300 max-w-5xl mx-auto opacity-100">
                        <div className="flex flex-col items-center justify-center h-full text-center px-8" style={{ opacity: 1, backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
                            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                                <DollarSign className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Fondos de Inversión</h3>
                            <p className="text-lg text-gray-700 max-w-2xl">
                                Convierte tus SafeCoins en inversiones y haz crecer tu dinero automáticamente.
                                Accede a fondos exclusivos con rendimientos garantizados de Banorte.
                            </p>
                        </div>
                    </ScrollStackItem>

                    <ScrollStackItem itemClassName="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 max-w-5xl mx-auto opacity-100">
                        <div className="flex flex-col items-center justify-center h-full text-center px-8" style={{ opacity: 1, backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
                            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                                <Gauge className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Competencias y Ranking</h3>
                            <p className="text-lg text-gray-700 max-w-2xl">
                                Compite con otros conductores en el leaderboard nacional y gana premios mensuales.
                                Los mejores conductores reciben bonos adicionales de SafeCoins.
                            </p>
                        </div>
                    </ScrollStackItem>
                </ScrollStack>
            </section>

            {/* CTA Final */}
            <section className="bg-linear-to-r from-red-600 to-red-700 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-5xl font-bold mb-6">
                        ¿Listo para ganar mientras conduces?
                    </h2>
                    <p className="text-xl mb-4 max-w-2xl mx-auto opacity-90">
                        Únete a miles de conductores que ya están convirtiendo su seguridad en recompensas reales.
                    </p>
                    <p className="text-lg mb-10 max-w-xl mx-auto opacity-80">
                        Instala Pay$afe hoy y comienza a acumular SafeCoins desde tu primer viaje.
                    </p>

                    <div className="flex gap-4 justify-center items-center">
                        <Link to={user ? "/dashboard" : "/register"}>
                            <Button size="lg" variant="secondary" className="text-lg px-10 py-6 bg-white text-red-600 hover:bg-gray-100 font-semibold">
                                {user ? "Ver Mi Dashboard" : "Crear Cuenta Gratis"}
                                <ChevronRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Button size="lg" className="text-lg px-10 py-6 bg-gray-800 text-white hover:bg-gray-700 border-2 border-white font-semibold">
                            Comprar Dispositivo
                        </Button>
                    </div>

                    <div className="mt-12 flex justify-center gap-12 text-sm opacity-75">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <span>100% Seguro</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            <span>Certificado Banorte</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Car className="w-4 h-4" />
                            <span>Fácil instalación</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h3 className="text-xl font-bold mb-4">Pay$afe</h3>
                        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
                            La manera inteligente de convertir tu seguridad al volante en recompensas reales.
                        </p>
                    </div>

                    <div className="border-t border-gray-800 pt-8 text-center">
                        <p className="text-gray-400 text-sm">© 2025 Pay$afe. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
