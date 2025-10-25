import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage.tsx';
import MPU6050Dashboard from './MPU6050Dash.tsx';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { NavigationMenuDemo } from './Navigation.tsx';
import { SignupForm } from './components/signup-form.tsx';
import { LoginForm } from './components/login-form.tsx';
import { useLocation } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";

function App() {

  const location = useLocation();
  const showNav = !['/login', '/register'].includes(location.pathname);

  return (
    <>
      {showNav && <NavigationMenuDemo />}
      <Toaster />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<MPU6050Dashboard />} />
        <Route path="/register" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/beneficios" element={<div>404 Not Found</div>} />
      </Routes>
    </>

  );
}

export default App;