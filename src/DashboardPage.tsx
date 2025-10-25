import { useAuth } from "./context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Home,
  MapPin,
  Gift,
  CreditCard,
  Shield,
  TrendingUp,
  Users,
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
      value: "250",
      description: "Monedas acumuladas",
      icon: <TrendingUp className="w-6 h-6 text-red-600" />,
      color: "bg-red-600",
    },
    {
      title: "Rutas Seguras",
      value: "12",
      description: "Este mes",
      icon: <Shield className="w-6 h-6 text-green-400" />,
      color: "bg-gray-700",
    },
    {
      title: "Alertas Activas",
      value: "3",
      description: "En tu zona",
      icon: <Activity className="w-6 h-6 text-yellow-400" />,
      color: "bg-gray-700",
    },
    {
      title: "Beneficios",
      value: "8",
      description: "Disponibles",
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
                ¡Bienvenid@, {userName}! 👋
              </h1>
              <p className="text-red-100 text-lg">
                Tu seguridad es nuestra prioridad. Aquí está tu panel de control.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Users className="w-4 h-4 mr-1" />
              Comunidad Activa
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Shield className="w-4 h-4 mr-1" />
              Protegid@
            </Badge>
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
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                </div>
                <h3 className="font-semibold text-white mb-1">{stat.title}</h3>
                <p className="text-sm text-gray-400">{stat.description}</p>
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
                    <div className="bg-gray-700 p-3 rounded-lg group-hover:bg-red-600 transition-colors">
                      {action.icon}
                    </div>
                    <Badge variant="secondary" className="bg-red-600 text-white border-red-700">
                      {action.badge}
                    </Badge>
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

        {/* Recent Activity */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Activity className="w-5 h-5 text-red-600" />
              Actividad Reciente
            </CardTitle>
            <CardDescription className="text-gray-400">
              Tus últimas interacciones con la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg">
                <div className="bg-green-600 p-2 rounded-full">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">Ruta segura completada</p>
                  <p className="text-sm text-gray-400">Hace 2 horas</p>
                </div>
                <Badge className="bg-green-600 text-white">+10 SafeCoins</Badge>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg">
                <div className="bg-purple-600 p-2 rounded-full">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">Beneficio canjeado</p>
                  <p className="text-sm text-gray-400">Hace 1 día</p>
                </div>
                <Badge className="bg-purple-600 text-white">-50 SafeCoins</Badge>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg">
                <div className="bg-red-600 p-2 rounded-full">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">Pay$afe activado</p>
                  <p className="text-sm text-gray-400">Hace 3 días</p>
                </div>
                <Badge className="bg-red-600 text-white">Activo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
