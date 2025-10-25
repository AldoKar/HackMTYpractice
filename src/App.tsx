import { Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage.tsx';
import { NavigationMenuDemo } from './Navigation.tsx';
import { SignupForm } from './components/signup-form.tsx';
import { LoginForm } from './components/login-form.tsx';
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
  const { user } = useAuth();
  const showNav = !['/login', '/register'].includes(location.pathname) && user !== null;

  return (
    <>
      {showNav && <NavigationMenuDemo />}
      <Toaster />
      <ChatBot />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        
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