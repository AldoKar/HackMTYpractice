import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Ticket,
  Fuel,
  Star,
  Shield,
  DollarSign,
  Car,
  Award,
  Coins,
  ChevronRight,
} from "lucide-react";

const BeneficiosPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [claimed, setClaimed] = useState<string[]>([]);
  const userCoins = 250; // 🔧 valor de ejemplo; puedes reemplazarlo por uno dinámico

  // Cargar beneficios reclamados guardados
  useEffect(() => {
    const saved = localStorage.getItem("claimedBenefits");
    if (saved) setClaimed(JSON.parse(saved));
  }, []);

  // Guardar automáticamente en localStorage
  useEffect(() => {
    localStorage.setItem("claimedBenefits", JSON.stringify(claimed));
  }, [claimed]);

  // ✅ Manejo del reclamo + redirección a Banorte
  const handleClaim = (id: string, cost: number) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (userCoins < cost) {
      toast.error("No tienes suficientes SafeCoins para reclamar este beneficio.");
      return;
    }

    if (!claimed.includes(id)) {
      setClaimed([...claimed, id]);
      toast.success(`¡Beneficio reclamado! Has usado ${cost} SafeCoins.`);

      // 🔗 Redirige a Banorte después de 1.5 segundos
      setTimeout(() => {
        window.open("https://www.banorte.com", "_blank");
      }, 1500);
    }
  };

  const benefits = [
    {
      id: "gasolina",
      title: "Cupones de Gasolina",
      description:
        "Canjea tus SafeCoins por descuentos de hasta 20% en estaciones afiliadas. Cada vez que llenas tu tanque, recuperas parte de tu inversión en seguridad.",
      cost: 100,
      icon: Fuel,
      bgColor: "bg-gray-800",
      iconBg: "bg-red-600",
    },
    {
      id: "luis-miguel",
      title: "Entradas a Concierto de Luis Miguel",
      description:
        "Accede a entradas gratuitas para el concierto de Luis Miguel. ¡Experiencias inolvidables que nunca olvidarás!",
      cost: 500,
      icon: Ticket,
      bgColor: "bg-gray-900",
      iconBg: "bg-gray-700",
    },
    {
      id: "cine",
      title: "Entradas de Cine",
      description:
        "Disfruta del séptimo arte sin gastar dinero extra. Reclama entradas para las mejores películas en cartelera.",
      cost: 50,
      icon: Star,
      bgColor: "bg-gray-800",
      iconBg: "bg-red-600",
    },
    {
      id: "seguro-auto",
      title: "Seguro de Auto Económico",
      description:
        "Obtén hasta 30% de descuento en pólizas de seguro automotriz por tu conducción responsable.",
      cost: 200,
      icon: Shield,
      bgColor: "bg-gray-900",
      iconBg: "bg-gray-700",
    },
    {
      id: "fondo-inversion",
      title: "Fondos de Inversión",
      description:
        "Convierte tus SafeCoins en inversiones exclusivas Banorte con rendimientos garantizados.",
      cost: 300,
      icon: DollarSign,
      bgColor: "bg-gray-800",
      iconBg: "bg-red-600",
    },
    {
      id: "credito-banorte",
      title: "Créditos Banorte",
      description:
        "Mejora tu Score Banorte y accede a tasas preferenciales en créditos automotrices.",
      cost: 150,
      icon: Car,
      bgColor: "bg-gray-900",
      iconBg: "bg-gray-700",
    },
  ];

  // 🚫 Si no hay sesión
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md bg-gray-800 border-2 border-gray-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Acceso Restringido</h2>
          <p className="text-gray-400 mb-6">
            Debes iniciar sesión para acceder a los beneficios exclusivos de PaySafe.
          </p>
          <Button
            onClick={() => navigate("/login")}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Iniciar Sesión
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* 🌟 Hero Section */}
      <section className="container mx-auto px-4 py-28 text-center">
        <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Award className="w-4 h-4" />
          Recompensas Exclusivas
        </div>

        <h1 className="text-7xl font-bold text-white mb-6">Beneficios PaySafe</h1>

        <p className="text-2xl text-gray-300 mb-4 leading-relaxed">
          Reclama recompensas exclusivas por tu{" "}
          <span className="text-red-500 font-semibold">conducción segura</span>
        </p>

        <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
          Canjea tus SafeCoins por experiencias increíbles, descuentos en servicios
          y beneficios financieros exclusivos de Banorte.
        </p>

        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins className="w-8 h-8 text-white" />
              <p className="text-3xl font-bold text-white">{userCoins}</p>
            </div>
            <p className="text-sm text-gray-400 mt-1">SafeCoins disponibles</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{benefits.length}</p>
            <p className="text-sm text-gray-400 mt-1">Beneficios activos</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{claimed.length}</p>
            <p className="text-sm text-gray-400 mt-1">Reclamados</p>
          </div>
        </div>
      </section>

      {/* 💎 Lista de beneficios */}
      {benefits.map(({ id, title, description, cost, icon: Icon, bgColor, iconBg }, i) => (
        <section key={id} className={`${bgColor} py-20`}>
          <div className="container mx-auto px-4">
            <div
              className={`max-w-5xl mx-auto flex items-center justify-between gap-12 ${
                i % 2 !== 0 ? "flex-row-reverse" : ""
              }`}
            >
              <div className={`w-64 h-64 rounded-2xl flex items-center justify-center shadow-2xl ${iconBg}`}>
                <Icon className="w-32 h-32 text-white" />
              </div>

              <div className="flex-1">
                <Badge
                  variant="outline"
                  className="border-red-500 text-red-400 mb-4 px-4 py-2 text-sm font-medium rounded-full"
                >
                  {cost} SafeCoins
                </Badge>
                <h2 className="text-4xl font-bold text-white mb-4">{title}</h2>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">{description}</p>

                <Button
                  onClick={() => handleClaim(id, cost)}
                  disabled={claimed.includes(id)}
                  className={`text-lg px-8 py-6 ${
                    claimed.includes(id)
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {claimed.includes(id) ? "✓ Reclamado" : "Reclamar Ahora"}
                  {!claimed.includes(id) && <ChevronRight className="ml-2 w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Footer */}
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
    