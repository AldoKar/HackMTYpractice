import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner'; // Asumiendo que usas shadcn/ui
import { ChatBot } from './components/ChatBot'; // Asumiendo la ruta
import { NavigationMenuDemo } from './Navigation'; // Asumiendo la ruta
import { supabase } from './lib/supabase'; // ¡IMPORTANTE! Necesitas este archivo
import type { User } from '@supabase/supabase-js'; // <-- 1. Importar el tipo 'User'

// Importa tus páginas
import LandingPage from './LandingPage';
import PaySafeDashboard from './PaySafeDash';
import SignupForm from './components/signup-form';
import LoginForm from './components/login-form';
import BeneficiosPage from './BeneficiosPage';
import MapPage from './MapPage';
import MapPageBanorte from './MapPageBanorte';
import AdminPage from './AdminPage';

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
        <Route path="/paysafe" element={<PaySafeDashboard />} />
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
      </Routes>
    </>
  );
}

export default App;