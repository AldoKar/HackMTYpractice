import { Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage.tsx';
import { NavigationMenuDemo } from './Navigation.tsx';
import SignupForm from './components/signup-form.tsx';
import LoginForm from './components/login-form.tsx';
import { useLocation } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import BeneficiosPage from './BeneficiosPage.tsx';
import MapPage from './MapPage.tsx';
import { ChatBot } from './components/ChatBot.tsx';
import PaySafeDashboard from './PaySafeDash.tsx';
import MapPageBanorte from './MapPageBanorte.tsx';
import AdminPage from './AdminPage.tsx';
import { useAuth } from './context/AuthContext';
import DashboardPage from './DashboardPage.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';


function App() {
  const location = useLocation();

  // 2. Añadir tipos a los 'useState'
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 1. Escuchar la sesión de Supabase
  useEffect(() => {
    // Poner el log de Supabase en Debug
    // supabase.auth.setLogLevel('Debug'); // Descomenta si tienes problemas

    // 1. Obtener la sesión actual al cargar la app
    const getSession = async () => {
      try {
        // Supabase infiere el tipo de 'session' aquí
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error al obtener la sesión:", error as Error); // Tipar el error
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // 2. Escuchar cambios (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
    });

    // 3. Limpiar el listener al desmontar el componente
    return () => {
      subscription.unsubscribe();
    };
  }, []); // El array vacío [] asegura que esto se ejecute solo una vez

  // 2. Verificar si es admin
  const isAdmin = user?.email?.endsWith('@banorte.com.mx') ?? false;

  // 3. Ocultar la barra de navegación en login/register
  const showNav = !['/login', '/register'].includes(location.pathname);
  const { user } = useAuth();
  const showNav = !['/login', '/register'].includes(location.pathname) && user !== null;

  // No mostrar nada hasta que sepamos si el usuario está logueado o no
  if (loading) {
    return null; // O un componente de Spinner/Loading

  }

  return (
    <>
      {/* 4. Pasar 'isAdmin' como prop a la barra de navegación */}
      {showNav && <NavigationMenuDemo isAdmin={isAdmin} />}
      <Toaster />
      <ChatBot />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />

        <Route path="/beneficios" element={<BeneficiosPage />} />
        <Route path="/mapa" element={<MapPage />} />

        {/* Protegemos las rutas de admin */}
        {isAdmin && (
          <>
            <Route path="/mapabanorte" element={<MapPageBanorte />} />
            <Route path="/adminpage" element={<AdminPage />} />
          </>
        )}

        {/* Puedes añadir una ruta de "No autorizado" o redirigir al home si no es admin */}
=======

        {/* Rutas Protegidas */}
        <Route path="/paysafe" element={<ProtectedRoute><PaySafeDashboard /></ProtectedRoute>} />
        <Route path="/beneficios" element={<ProtectedRoute><BeneficiosPage /></ProtectedRoute>} />
        <Route path="/mapa" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
        <Route path="/mapabanorte" element={<ProtectedRoute><MapPageBanorte /></ProtectedRoute>} />
        <Route path="/adminpage" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

      </Routes>
    </>
  );
}

export default App;