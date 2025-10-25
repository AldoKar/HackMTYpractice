import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Ticket, Fuel, Star, Shield, DollarSign, Car } from 'lucide-react'; // Iconos de lucide-react

const BeneficiosPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [claimed, setClaimed] = useState<string[]>([]); // Estado para beneficios reclamados

    // Lista de beneficios basada en Navigation.tsx
    const beneficios = [
        {
            id: 'gasolina',
            title: 'Cupones de Gasolina',
            description: 'Reclama cupones de gasolina exclusivos para usuarios PaySafe. ¡Ahorra en tu próximo tanque!',
            icon: <Fuel className="w-8 h-8 text-blue-600" />,
            pointsRequired: 100,
        },
        {
            id: 'luis-miguel',
            title: 'Entradas a Concierto de Luis Miguel',
            description: 'Accede a entradas gratuitas para el concierto de Luis Miguel. ¡No te lo pierdas!',
            icon: <Ticket className="w-8 h-8 text-purple-600" />,
            pointsRequired: 500,
        },
        {
            id: 'cine',
            title: 'Entradas de Cine',
            description: 'Reclama entradas para las mejores películas en cartelera.',
            icon: <Star className="w-8 h-8 text-yellow-600" />,
            pointsRequired: 50,
        },
        {
            id: 'seguro-auto',
            title: 'Seguro de Auto',
            description: 'Adquiere seguros de auto exclusivos con descuentos para conductores seguros.',
            icon: <Shield className="w-8 h-8 text-green-600" />,
            pointsRequired: 200,
        },
        {
            id: 'fondo-inversion',
            title: 'Fondo de Inversión',
            description: 'Invierte en fondos exclusivos y gana intereses pasivos.',
            icon: <DollarSign className="w-8 h-8 text-green-500" />,
            pointsRequired: 300,
        },
        {
            id: 'credito-banorte',
            title: 'Créditos Banorte',
            description: 'Mejora tu Score Banorte y accede a créditos con tasas preferenciales.',
            icon: <Car className="w-8 h-8 text-red-600" />,
            pointsRequired: 150,
        },
    ];

    const handleClaim = (id: string, points: number) => {
        if (!user) {
            navigate('/login');
            return;
        }
        // Simulación de reclamación (en producción, enviar a backend)
        setClaimed([...claimed, id]);
        toast.success(`¡Beneficio reclamado! Has usado ${points} puntos.`);
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Acceso Restringido</CardTitle>
                        <CardDescription>
                            Debes iniciar sesión para acceder a los beneficios.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => navigate('/login')} className="w-full">
                            Iniciar Sesión
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto">
                <header className="text-center py-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Beneficios PaySafe</h1>
                    <p className="text-lg text-gray-600">
                        Reclama recompensas exclusivas por tu conducción segura. ¡Acumula puntos y disfruta!
                    </p>
                    <Badge variant="secondary" className="mt-2">
                        Tus Puntos: 250 {/* Simulado; en producción, obtener de backend */}
                    </Badge>
                </header>

                <div className="grid grid-cols-3 gap-6">
                    {beneficios.map((beneficio) => (
                        <Card key={beneficio.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex items-center space-x-4">
                                {beneficio.icon}
                                <div>
                                    <CardTitle className="text-lg">{beneficio.title}</CardTitle>
                                    <Badge variant="outline" className="mt-1">
                                        {beneficio.pointsRequired} puntos
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="mb-4">{beneficio.description}</CardDescription>
                                <Button
                                    onClick={() => handleClaim(beneficio.id, beneficio.pointsRequired)}
                                    disabled={claimed.includes(beneficio.id)}
                                    className="w-full"
                                >
                                    {claimed.includes(beneficio.id) ? 'Reclamado' : 'Reclamar'}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <footer className="text-center py-8 text-gray-500">
                    <p>Beneficios sujetos a disponibilidad. Consulta términos y condiciones.</p>
                </footer>
            </div>
        </div>
    );
};

export default BeneficiosPage;