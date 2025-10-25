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
        <Route path="/paysafe" element={<PaySafeDashboard />} />
        <Route path="/register" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/beneficios" element={<BeneficiosPage />} />
        <Route path="/mapa" element={<MapPage />} />
        <Route path="/mapabanorte" element={<MapPageBanorte />} />
        <Route path="/adminpage" element={<AdminPage />} />
      </Routes>
    </>

  );
}

export default App;