import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Shield, DollarSign, Car, TrendingUp, Award, Gauge, Coins, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import TextType from './TextType';
import ScrollStack, { ScrollStackItem } from './ScrollStack';

export default function LandingPage() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 md:py-28">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Award className="w-4 h-4" />
                        Conduce Seguro, Gana Recompensas
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                        <TextType 
                            text="PaySafe"
                            typingSpeed={175}
                            pauseDuration={1500}
                            showCursor={false}
                        />
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-gray-600 mb-4 leading-relaxed">
                        El primer dispositivo inteligente que <span className="text-blue-600 font-semibold">te paga por manejar bien</span>
                    </p>
                    
                    <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
                        Transforma tu forma de conducir en ingresos reales. PaySafe monitorea tu comportamiento al volante 
                        y te recompensa con <span className="font-semibold text-yellow-600">SafeCoins</span> que puedes canjear por dinero, 
                        descuentos en gasolina, seguros más baratos y beneficios exclusivos de Banorte.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to={user ? "/dashboard" : "/register"}>
                            <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
                                {user ? "Ir al Dashboard" : "Comenzar Ahora"}
                                <ChevronRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                            Ver Demo
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-blue-600">$250+</p>
                            <p className="text-sm text-gray-600 mt-1">Ahorro promedio/mes</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-green-600">98%</p>
                            <p className="text-sm text-gray-600 mt-1">Satisfacción usuarios</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-yellow-600">50k+</p>
                            <p className="text-sm text-gray-600 mt-1">Conductores activos</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Introducción - Qué es PaySafe */}
            <section className="bg-white py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                ¿Qué es PaySafe?
                            </h2>
                            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                    PaySafe es un <span className="font-semibold text-blue-600">dispositivo inteligente MPU6050</span> que 
                                    se conecta fácilmente a tu vehículo y analiza tu forma de conducir en tiempo real.
                                </p>
                                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                    A través de sensores de movimiento avanzados, detecta aceleraciones bruscas, frenadas repentinas 
                                    y giros agresivos. Mientras más suave y segura sea tu conducción, 
                                    <span className="font-semibold text-yellow-600"> más SafeCoins ganas</span>.
                                </p>
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    Tus SafeCoins se pueden canjear por dinero real, descuentos en gasolina, seguros de auto más económicos, 
                                    entradas a eventos, y acceso a productos financieros exclusivos de Banorte.
                                </p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-600 text-white p-3 rounded-lg">
                                            <Car className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Instalación Simple</h3>
                                            <p className="text-gray-600">Conecta el dispositivo en 5 minutos sin herramientas</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-4">
                                        <div className="bg-green-600 text-white p-3 rounded-lg">
                                            <Gauge className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Monitoreo 24/7</h3>
                                            <p className="text-gray-600">Análisis continuo de tu comportamiento al volante</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-4">
                                        <div className="bg-yellow-600 text-white p-3 rounded-lg">
                                            <Coins className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Recompensas Automáticas</h3>
                                            <p className="text-gray-600">Gana SafeCoins por cada viaje seguro</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cómo Funciona - Paso a Paso */}
            <section className="container mx-auto px-4 py-20">
                <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
                    ¿Cómo Funciona?
                </h2>
                <div className="w-20 h-1 bg-blue-600 mx-auto mb-16"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <Card className="border-2 hover:border-blue-300 transition-all hover:shadow-xl">
                        <CardHeader className="text-center">
                            <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                <Shield className="w-8 h-8 text-blue-600" />
                            </div>
                            <CardTitle className="text-xl">1. Detección Inteligente</CardTitle>
                            <CardDescription className="text-base mt-3">
                                El sensor MPU6050 integrado monitorea en tiempo real cada movimiento de tu vehículo: 
                                aceleraciones, frenadas y giros. Identifica patrones de conducción segura vs conducción agresiva.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    
                    <Card className="border-2 hover:border-green-300 transition-all hover:shadow-xl">
                        <CardHeader className="text-center">
                            <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                <TrendingUp className="w-8 h-8 text-green-600" />
                            </div>
                            <CardTitle className="text-xl">2. Análisis y Puntuación</CardTitle>
                            <CardDescription className="text-base mt-3">
                                Cada viaje recibe un score de seguridad basado en suavidad de manejo, velocidad adecuada 
                                y prevención de riesgos. Tu comportamiento se traduce en SafeCoins automáticamente.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    
                    <Card className="border-2 hover:border-yellow-300 transition-all hover:shadow-xl">
                        <CardHeader className="text-center">
                            <div className="mx-auto bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                <DollarSign className="w-8 h-8 text-yellow-600" />
                            </div>
                            <CardTitle className="text-xl">3. Gana Recompensas</CardTitle>
                            <CardDescription className="text-base mt-3">
                                Acumula SafeCoins por kilómetro recorrido de forma segura. Canjéalos por dinero real, 
                                cupones de gasolina, descuentos en seguros o beneficios exclusivos de Banorte.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </section>

            {/* Visualización en Tiempo Real */}
            <section className="bg-gray-50 py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
                        Tu Seguridad Visualizada
                    </h2>
                    <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
                    <p className="text-center text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
                        Observa en tiempo real cada evento detectado en un mapa interactivo. 
                        Identifica zonas de riesgo y mejora tu comportamiento al volante.
                    </p>
                    
                    <Card className="max-w-5xl mx-auto shadow-2xl">
                        <CardContent className="p-0">
                            <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                                <div className="text-center z-10">
                                    <MapPin className="w-20 h-20 text-blue-400 mx-auto mb-6 animate-pulse" />
                                    <p className="text-xl font-semibold text-gray-700 mb-2">Mapa Interactivo en Tiempo Real</p>
                                    <p className="text-gray-500 max-w-md mx-auto">
                                        Visualiza tus rutas, eventos de frenado, aceleración y ubicaciones donde ganaste más SafeCoins
                                    </p>
                                    <div className="mt-6 flex gap-4 justify-center">
                                        <div className="bg-red-100 px-4 py-2 rounded-full">
                                            <span className="text-red-600 font-medium">● Frenadas bruscas</span>
                                        </div>
                                        <div className="bg-yellow-100 px-4 py-2 rounded-full">
                                            <span className="text-yellow-600 font-medium">● Aceleraciones</span>
                                        </div>
                                        <div className="bg-green-100 px-4 py-2 rounded-full">
                                            <span className="text-green-600 font-medium">● Conducción segura</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Beneficios Exclusivos - ScrollStack */}
            <section className="relative bg-white">
                <div className="sticky top-0 py-20 bg-white z-10">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
                        Beneficios Exclusivos
                    </h2>
                    <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
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
                    <ScrollStackItem itemClassName="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 max-w-5xl mx-auto opacity-100">
                        <div className="flex flex-col items-center justify-center h-full text-center px-8" style={{ opacity: 1, backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
                            <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                                <Coins className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Cupones de Gasolina</h3>
                            <p className="text-lg text-gray-700 max-w-2xl">
                                Canjea tus SafeCoins por descuentos de hasta <span className="font-bold text-yellow-600">20%</span> en estaciones de servicio afiliadas. 
                                Cada vez que llenas tu tanque, recuperas parte de tu inversión en seguridad.
                            </p>
                        </div>
                    </ScrollStackItem>
                    
                    <ScrollStackItem itemClassName="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 max-w-5xl mx-auto opacity-100">
                        <div className="flex flex-col items-center justify-center h-full text-center px-8" style={{ opacity: 1, backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
                            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                                <Shield className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Seguro de Auto Económico</h3>
                            <p className="text-lg text-gray-700 max-w-2xl">
                                Los conductores seguros obtienen hasta <span className="font-bold text-blue-600">30% de descuento</span> en pólizas de seguro automotriz. 
                                Tu historial de conducción responsable se traduce en ahorros reales.
                            </p>
                        </div>
                    </ScrollStackItem>
                    
                    <ScrollStackItem itemClassName="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 max-w-5xl mx-auto opacity-100">
                        <div className="flex flex-col items-center justify-center h-full text-center px-8" style={{ opacity: 1, backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
                            <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                                <Award className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Eventos Exclusivos</h3>
                            <p className="text-lg text-gray-700 max-w-2xl">
                                Accede a conciertos, cine y eventos deportivos de manera preferencial. 
                                Usa tus SafeCoins para experiencias inolvidables sin gastar dinero extra.
                            </p>
                        </div>
                    </ScrollStackItem>
                    
                    <ScrollStackItem itemClassName="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 max-w-5xl mx-auto opacity-100">
                        <div className="flex flex-col items-center justify-center h-full text-center px-8" style={{ opacity: 1, backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                                <TrendingUp className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Créditos Banorte</h3>
                            <p className="text-lg text-gray-700 max-w-2xl">
                                Mejora tu Score Banorte automáticamente y accede a tasas preferenciales en créditos automotrices. 
                                Conducir bien mejora tu perfil crediticio.
                            </p>
                        </div>
                    </ScrollStackItem>
                    
                    <ScrollStackItem itemClassName="bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 max-w-5xl mx-auto opacity-100">
                        <div className="flex flex-col items-center justify-center h-full text-center px-8" style={{ opacity: 1, backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
                            <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                                <DollarSign className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Fondos de Inversión</h3>
                            <p className="text-lg text-gray-700 max-w-2xl">
                                Convierte tus SafeCoins en inversiones y haz crecer tu dinero automáticamente. 
                                Accede a fondos exclusivos con rendimientos garantizados de Banorte.
                            </p>
                        </div>
                    </ScrollStackItem>
                    
                    <ScrollStackItem itemClassName="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 max-w-5xl mx-auto opacity-100">
                        <div className="flex flex-col items-center justify-center h-full text-center px-8" style={{ opacity: 1, backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
                            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
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
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        ¿Listo para ganar mientras conduces?
                    </h2>
                    <p className="text-xl mb-4 max-w-2xl mx-auto opacity-90">
                        Únete a miles de conductores que ya están convirtiendo su seguridad en recompensas reales.
                    </p>
                    <p className="text-lg mb-10 max-w-xl mx-auto opacity-80">
                        Instala PaySafe hoy y comienza a acumular SafeCoins desde tu primer viaje.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to={user ? "/dashboard" : "/register"}>
                            <Button size="lg" variant="secondary" className="text-lg px-10 py-6 bg-white text-blue-600 hover:bg-gray-100">
                                {user ? "Ver Mi Dashboard" : "Crear Cuenta Gratis"}
                                <ChevronRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-white text-white hover:bg-white/10">
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
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">PaySafe</h3>
                            <p className="text-gray-400 text-sm">
                                La manera inteligente de convertir tu seguridad al volante en recompensas reales.
                            </p>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-4">Producto</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Cómo funciona</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Dispositivo</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Beneficios</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-4">Soporte</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Centro de ayuda</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Instalación</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Licencias</a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">© 2025 PaySafe. Todos los derechos reservados.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <span className="sr-only">Twitter</span>
                                Twitter
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <span className="sr-only">Facebook</span>
                                Facebook
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <span className="sr-only">Instagram</span>
                                Instagram
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}