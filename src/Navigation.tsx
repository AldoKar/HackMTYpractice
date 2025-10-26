"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { LogOut } from "lucide-react"
import { toast } from "sonner"

type NextLikeLinkProps = React.ComponentPropsWithoutRef<"a"> & { href: string }
const Link = React.forwardRef<HTMLAnchorElement, NextLikeLinkProps>(
    ({ href, children, ...props }, ref) => {
        return (
            <a href={href} ref={ref} {...props}>
                {children}
            </a>
        )
    }
)
Link.displayName = "Link"
//aulas 6 a las 9am
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Cupones de gasolina",
        href: "/beneficios",
        description:
            "Consulta y administra tus cupones de gasolina exclusivos para usuarios PaySafe.",
    },
    {
        title: "Entradas a eventos exclusivos",
        href: "/beneficios",
        description:
            "Alguna vez te imaginaste asistir a un concierto de tu artista favorito gratis? Con PaySafe es posible.",
    },
    {
        title: "Entradas de cine",
        href: "/beneficios",
        description:
            "Consulta y adquiere entradas para las mejores películas en cartelera.",
    },
    {
        title: "Creditos Banorte",
        href: "/beneficios",
        description: "Consulta tu Score Banorte y mejora tus beneficios.",
    },
    {
        title: "Fondo de inversión",
        href: "/beneficios",
        description:
            "Consulta y adquiere fondos de inversión exclusivos para usuarios PaySafe.",
    },
    {
        title: "Seguro de auto",
        href: "/beneficios",
        description:
            "Consulta y adquiere seguros de auto exclusivos para usuarios PaySafe.",
    },
]

export function NavigationMenuDemo() {
    const safeCoins = 34 // temporal, reemplazar por contexto/backend si hace falta
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    
    // Verificar si el usuario es de Banorte
    const isBanorteUser = user?.email?.endsWith('@banorte.com.mx') ?? false

    const handleEstadisticasClick = (e: React.MouseEvent) => {
        e.preventDefault()
        navigate('/mapa')
        // Pequeño delay para asegurar que la página se cargue antes de hacer scroll
        setTimeout(() => {
            const element = document.getElementById('grafica')
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        }, 100)
    }

    const handleLogout = async () => {
        try {
            localStorage.removeItem('token')
            sessionStorage.removeItem('token')

            await logout()
            toast.success('Sesión cerrada exitosamente')
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
            toast.error('Error al cerrar sesión')
        }
        navigate('/login') // o '/' según tu ruta de login
    }

    return (
        <nav className="w-full bg-background border-b sticky top-0 z-100">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center gap-6 h-16">
                    <div className="flex items-center gap-4">
                        <a href="/" className="text-lg font-semibold">
                            PaySafe
                        </a>
                    </div>

                    <div className="flex-1 relative">
                        <NavigationMenu viewport={false}>
                            <NavigationMenuList className="flex items-center gap-2">

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>Dashboard</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid gap-2 w-[500px] grid-cols-[.75fr_1fr]">
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        href="/dashboard"
                                                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors bg-muted/50 hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">Dashboard</div>
                                                        <p className="text-sm leading-snug text-muted-foreground">
                                                            Consulta un breve resumen de la actividad reciente y estadísticas clave.
                                                        </p>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>Home</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid gap-2 w-[500px] grid-cols-[.75fr_1fr]">
                                            <li className="row-span-3">
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        href="/"
                                                        className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md"
                                                    >
                                                        <div className="mb-2 text-lg font-medium mt-4">
                                                            PaySafe
                                                        </div>
                                                        <p className="text-muted-foreground text-sm leading-tight">
                                                            Disfrute de ingresos pasivos mientras explora el potencial de PaySafe.
                                                        </p>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>

                                            <ListItem href="/" title="Introduccion">
                                                Conoce como funciona PaySafe y comienza a usarlo.
                                            </ListItem>
                                            <ListItem href="/" title="Proposito">
                                                Conoce el proposito detras de PaySafe y su impacto en la seguridad vial.
                                            </ListItem>
                                            <ListItem href="/" title="Funcionamiento">
                                                Conoce el funcionamiento de PaySafe y como nuestro dispositivo manda datos.
                                            </ListItem>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>Beneficios Banorte</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid gap-2 w-[600px] grid-cols-2">
                                            {components.map((component) => (
                                                <ListItem key={component.title} title={component.title} href={component.href}>
                                                    {component.description}
                                                </ListItem>
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>Mapa</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[400px] gap-3 p-4">
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        href="/mapa"
                                                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors bg-muted/50 hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">Mapa Interactivo</div>
                                                        <p className="text-sm leading-snug text-muted-foreground">
                                                            Visualiza tus rutas y eventos de conducción en tiempo real.
                                                        </p>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        href="/mapa#grafica"
                                                        onClick={handleEstadisticasClick}
                                                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors bg-muted/50 hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">Estadísticas</div>
                                                        <p className="text-sm leading-snug text-muted-foreground">
                                                            Consulta tu rendimiento semanal y gráficas de progreso.
                                                        </p>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>Pay$afe</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[400px] gap-3 p-4">
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        href="/adminpage"
                                                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors bg-muted/50 hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">Administra tu Pay$afe</div>
                                                        <p className="text-sm leading-snug text-muted-foreground">
                                                            Configura y gestiona tu dispositivo Pay$afe.
                                                        </p>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        href="/mapa"
                                                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors bg-muted/50 hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">Historial de Pay$afe</div>
                                                        <p className="text-sm leading-snug text-muted-foreground">
                                                            Visualiza tu historial de transacciones de Pay$afe.
                                                        </p>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        href="/paysafe"
                                                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors bg-muted/50 hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">Pruebas de Pay$afe</div>
                                                        <p className="text-sm leading-snug text-muted-foreground">
                                                            Visualiza tus pruebas de Pay$afe.
                                                        </p>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                {/* Menú Mapa Banorte - solo visible para usuarios @banorte.com.mx */}
                                {isBanorteUser && (
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="text-red-600">Mapa Banorte</NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid w-[400px] gap-3 p-4">
                                                <li>
                                                    <NavigationMenuLink asChild>
                                                        <Link
                                                            href="/mapabanorte"
                                                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors bg-muted/50 hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground"
                                                        >
                                                            <div className="text-sm font-medium leading-none text-red-600">Panel Administrativo Banorte</div>
                                                            <p className="text-sm leading-snug text-muted-foreground">
                                                                Visualiza las rutas y eventos de todos los usuarios de Pay$afe.
                                                            </p>
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </li>
                                                <li>
                                                    <NavigationMenuLink asChild>
                                                        <Link
                                                            href="/mapabanorte"
                                                            onClick={handleEstadisticasClick}
                                                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors bg-muted/50 hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground"
                                                        >
                                                            <div className="text-sm font-medium leading-none text-red-600">Estadísticas Banorte</div>
                                                            <p className="text-sm leading-snug text-muted-foreground">
                                                                Consulta gráficas, estadisticas y reportes de todos los usuarios de Pay$afe.
                                                            </p>
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </li>
                                                <li>
                                                    <NavigationMenuLink asChild>
                                                        <Link
                                                            href="/mapabanorte"
                                                            onClick={handleEstadisticasClick}
                                                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors bg-muted/50 hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground"
                                                        >
                                                            <div className="text-sm font-medium leading-none text-red-600">Pay$afe assistant Banorte</div>
                                                            <p className="text-sm leading-snug text-muted-foreground">
                                                                Consulta gráficas, estadisticas y reportes de todos los usuarios de Pay$afe.
                                                            </p>
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </li>
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                )}

                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="ml-4 flex items-center gap-3">
                        <Badge variant="secondary" className="text-sm font-semibold">
                            SafeCoins: {safeCoins}
                        </Badge>

                        {user && (
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                size="sm"
                                className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Cerrar Sesión
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

function ListItem({
    title,
    children,
    href,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link
                    href={href}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors bg-muted/50 hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground"
                >
                    <div className="text-sm leading-none font-medium">{title}</div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
}