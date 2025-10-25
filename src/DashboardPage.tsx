import { useAuth } from "./context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Home,
  MapPin,
  Gift,
  CreditCard,
  Shield,
  TrendingUp,
  Activity,
} from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Obtener el nombre del usuario desde user metadata
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Usuario";

  const stats = [
    {
      title: "SafeCoins",
      icon: <TrendingUp className="w-6 h-6 text-red-600" />,
      color: "bg-gray-700",
    },
    {
      title: "Rutas Seguras",
      icon: <Shield className="w-6 h-6 text-green-400" />,
      color: "bg-gray-700",
    },
    {
      title: "Alertas Activas",
      icon: <Activity className="w-6 h-6 text-yellow-400" />,
      color: "bg-gray-700",
    },
    {
      title: "Beneficios",
      icon: <Gift className="w-6 h-6 text-purple-400" />,
      color: "bg-gray-700",
    },
  ];

  const quickActions = [
    {
      title: "Ver Mapa",
      description: "Consulta rutas seguras en tiempo real",
      icon: <MapPin className="w-8 h-8 text-red-600" />,
      path: "/mapa",
      badge: "Popular",
    },
    {
      title: "Beneficios",
      description: "Canjea tus SafeCoins",
      icon: <Gift className="w-8 h-8 text-red-600" />,
      path: "/beneficios",
      badge: "8 disponibles",
    },
    {
      title: "Pay$afe",
      description: "Gestiona tu dispositivo de seguridad",
      icon: <CreditCard className="w-8 h-8 text-red-600" />,
      path: "/paysafe",
      badge: "Activo",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section con Bienvenida */}
      <div className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-3 rounded-full">
              <Home className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                ¡Bienvenid@, {userName}!
              </h1>
              <p className="text-red-100 text-lg pt-2">
                Revisa nuestros beneficios.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-red-900/20 transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    {stat.icon}
                  </div>
                  <div className="text-right">
                    
                  </div>
                </div>
                <h3 className="font-semibold text-white mb-1">{stat.title}</h3>
                
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-red-600" />
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="bg-gray-800 border-gray-700 hover:shadow-xl hover:shadow-red-900/30 transition-all cursor-pointer group hover:border-red-600"
                onClick={() => navigate(action.path)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-gray-700 p-3 rounded-lg transition-colors">
                      {action.icon}
                    </div>
                    
                  </div>
                  <CardTitle className="text-xl text-white">{action.title}</CardTitle>
                  <CardDescription className="text-base text-gray-400">
                    {action.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                  >
                    Ir ahora
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
