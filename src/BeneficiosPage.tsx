import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Ticket, Fuel, Star, Shield, DollarSign, Car, Award, Coins, ChevronRight } from 'lucide-react';

const BeneficiosPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [claimed, setClaimed] = useState<string[]>([]);

    const handleClaim = (id: string, points: number) => {
        if (!user) {
            navigate('/login');
            return;
        }
        setClaimed([...claimed, id]);
        toast.success(`¡Beneficio reclamado! Has usado ${points} SafeCoins.`);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <div className="max-w-md bg-gray-800 border-2 border-gray-700 rounded-lg p-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Acceso Restringido</h2>
                    <p className="text-gray-400 mb-6">
                        Debes iniciar sesión para acceder a los beneficios exclusivos de PaySafe.
                    </p>
                    <Button onClick={() => navigate('/login')} className="w-full bg-red-600 hover:bg-red-700">
                        Iniciar Sesión
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-28 bg-gray-900">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Award className="w-4 h-4" />
                        Recompensas Exclusivas
                    </div>

                    <h1 className="text-7xl font-bold text-white mb-6">
                        Beneficios PaySafe
                    </h1>

                    <p className="text-2xl text-gray-300 mb-4 leading-relaxed">
                        Reclama recompensas exclusivas por tu <span className="text-red-500 font-semibold">conducción segura</span>
                    </p>

                    <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
                        Canjea tus SafeCoins por experiencias increíbles, descuentos en servicios y beneficios financieros exclusivos de Banorte.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Coins className="w-8 h-8 text-white" />
                                <p className="text-3xl font-bold text-white">250</p>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">SafeCoins disponibles</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">6</p>
                            <p className="text-sm text-gray-400 mt-1">Beneficios activos</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">{claimed.length}</p>
                            <p className="text-sm text-gray-400 mt-1">Reclamados</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Beneficio 1: Cupones de Gasolina */}
            <section className="bg-gray-800 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center justify-between gap-12">
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 bg-red-600/10 text-red-500 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                    <Badge variant="outline" className="border-red-500 text-red-400">100 SafeCoins</Badge>
                                </div>
                                <h2 className="text-4xl font-bold text-white mb-4">
                                    Cupones de Gasolina
                                </h2>
                                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                                    Canjea tus SafeCoins por descuentos de hasta <span className="font-semibold text-red-500">20%</span> en estaciones de servicio afiliadas.
                                    Cada vez que llenas tu tanque, recuperas parte de tu inversión en seguridad.
                                </p>
                                <Button
                                    onClick={() => handleClaim('gasolina', 100)}
                                    disabled={claimed.includes('gasolina')}
                                    className={`text-lg px-8 py-6 ${claimed.includes('gasolina')
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                >
                                    {claimed.includes('gasolina') ? '✓ Reclamado' : 'Reclamar Ahora'}
                                    {!claimed.includes('gasolina') && <ChevronRight className="ml-2 w-5 h-5" />}
                                </Button>
                            </div>
                            <div className="bg-red-600 w-64 h-64 rounded-2xl flex items-center justify-center shadow-2xl">
                                <Fuel className="w-32 h-32 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Beneficio 2: Concierto Luis Miguel */}
            <section className="bg-gray-900 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center justify-between gap-12">
                            <div className="bg-gray-700 w-64 h-64 rounded-2xl flex items-center justify-center shadow-2xl">
                                <Ticket className="w-32 h-32 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 bg-red-600/10 text-red-500 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                    <Badge variant="outline" className="border-red-500 text-red-400">500 SafeCoins</Badge>
                                </div>
                                <h2 className="text-4xl font-bold text-white mb-4">
                                    Entradas a Concierto de Luis Miguel
                                </h2>
                                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                                    Accede a entradas gratuitas para el concierto de Luis Miguel. ¡Experiencias inolvidables que nunca olvidarás!
                                    La música y el entretenimiento también son parte de tus recompensas.
                                </p>
                                <Button
                                    onClick={() => handleClaim('luis-miguel', 500)}
                                    disabled={claimed.includes('luis-miguel')}
                                    className={`text-lg px-8 py-6 ${claimed.includes('luis-miguel')
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                >
                                    {claimed.includes('luis-miguel') ? '✓ Reclamado' : 'Reclamar Ahora'}
                                    {!claimed.includes('luis-miguel') && <ChevronRight className="ml-2 w-5 h-5" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Beneficio 3: Entradas de Cine */}
            <section className="bg-gray-800 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center justify-between gap-12">
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 bg-red-600/10 text-red-500 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                    <Badge variant="outline" className="border-red-500 text-red-400">50 SafeCoins</Badge>
                                </div>
                                <h2 className="text-4xl font-bold text-white mb-4">
                                    Entradas de Cine
                                </h2>
                                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                                    Reclama entradas para las mejores películas en cartelera sin gastar dinero extra.
                                    Disfruta del séptimo arte mientras tus SafeCoins trabajan para ti.
                                </p>
                                <Button
                                    onClick={() => handleClaim('cine', 50)}
                                    disabled={claimed.includes('cine')}
                                    className={`text-lg px-8 py-6 ${claimed.includes('cine')
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                >
                                    {claimed.includes('cine') ? '✓ Reclamado' : 'Reclamar Ahora'}
                                    {!claimed.includes('cine') && <ChevronRight className="ml-2 w-5 h-5" />}
                                </Button>
                            </div>
                            <div className="bg-red-600 w-64 h-64 rounded-2xl flex items-center justify-center shadow-2xl">
                                <Star className="w-32 h-32 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Beneficio 4: Seguro de Auto */}
            <section className="bg-gray-900 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center justify-between gap-12">
                            <div className="bg-gray-700 w-64 h-64 rounded-2xl flex items-center justify-center shadow-2xl">
                                <Shield className="w-32 h-32 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 bg-red-600/10 text-red-500 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                    <Badge variant="outline" className="border-red-500 text-red-400">200 SafeCoins</Badge>
                                </div>
                                <h2 className="text-4xl font-bold text-white mb-4">
                                    Seguro de Auto Económico
                                </h2>
                                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                                    Obtén hasta <span className="font-semibold text-red-500">30% de descuento</span> en pólizas de seguro automotriz por tu conducción responsable.
                                    Tu historial de seguridad se traduce en ahorros reales cada mes.
                                </p>
                                <Button
                                    onClick={() => handleClaim('seguro-auto', 200)}
                                    disabled={claimed.includes('seguro-auto')}
                                    className={`text-lg px-8 py-6 ${claimed.includes('seguro-auto')
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                >
                                    {claimed.includes('seguro-auto') ? '✓ Reclamado' : 'Reclamar Ahora'}
                                    {!claimed.includes('seguro-auto') && <ChevronRight className="ml-2 w-5 h-5" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Beneficio 5: Fondo de Inversión */}
            <section className="bg-gray-800 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center justify-between gap-12">
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 bg-red-600/10 text-red-500 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                    <Badge variant="outline" className="border-red-500 text-red-400">300 SafeCoins</Badge>
                                </div>
                                <h2 className="text-4xl font-bold text-white mb-4">
                                    Fondos de Inversión
                                </h2>
                                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                                    Convierte tus SafeCoins en inversiones y haz crecer tu dinero automáticamente.
                                    Accede a fondos exclusivos con rendimientos garantizados de Banorte.
                                </p>
                                <Button
                                    onClick={() => handleClaim('fondo-inversion', 300)}
                                    disabled={claimed.includes('fondo-inversion')}
                                    className={`text-lg px-8 py-6 ${claimed.includes('fondo-inversion')
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                >
                                    {claimed.includes('fondo-inversion') ? '✓ Reclamado' : 'Reclamar Ahora'}
                                    {!claimed.includes('fondo-inversion') && <ChevronRight className="ml-2 w-5 h-5" />}
                                </Button>
                            </div>
                            <div className="bg-red-600 w-64 h-64 rounded-2xl flex items-center justify-center shadow-2xl">
                                <DollarSign className="w-32 h-32 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Beneficio 6: Créditos Banorte */}
            <section className="bg-gray-900 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center justify-between gap-12">
                            <div className="bg-gray-700 w-64 h-64 rounded-2xl flex items-center justify-center shadow-2xl">
                                <Car className="w-32 h-32 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 bg-red-600/10 text-red-500 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                    <Badge variant="outline" className="border-red-500 text-red-400">150 SafeCoins</Badge>
                                </div>
                                <h2 className="text-4xl font-bold text-white mb-4">
                                    Créditos Banorte
                                </h2>
                                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                                    Mejora tu Score Banorte automáticamente y accede a tasas preferenciales en créditos automotrices.
                                    Conducir bien mejora tu perfil crediticio y te abre mejores oportunidades financieras.
                                </p>
                                <Button
                                    onClick={() => handleClaim('credito-banorte', 150)}
                                    disabled={claimed.includes('credito-banorte')}
                                    className={`text-lg px-8 py-6 ${claimed.includes('credito-banorte')
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                >
                                    {claimed.includes('credito-banorte') ? '✓ Reclamado' : 'Reclamar Ahora'}
                                    {!claimed.includes('credito-banorte') && <ChevronRight className="ml-2 w-5 h-5" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Info */}
            <section className="bg-gray-800 py-12 border-t border-gray-700">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-400 text-sm">
                        Beneficios sujetos a disponibilidad. Consulta términos y condiciones. © 2025 PaySafe - Banorte
                    </p>
                </div>
            </section>
        </div>
    );
};

export default BeneficiosPage;