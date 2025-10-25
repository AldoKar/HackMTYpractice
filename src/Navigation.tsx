"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

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

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
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

    return (
        <nav className="w-full bg-background border-b">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center gap-6 h-16">
                    <div className="flex items-center gap-4">
                        <a href="/" className="text-lg font-semibold">
                            PaySafe
                        </a>
                    </div>

                    <div className="flex-1">
                        <NavigationMenu className="w-full">
                            <NavigationMenuList className="flex items-center gap-2">
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
                                        <ul className="grid w-[300px] gap-4">
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link href="/mapa">
                                                        <div className="font-medium">Mapa Interactivo</div>
                                                        <div className="text-muted-foreground">
                                                            Visualiza tus rutas y eventos de conducción en tiempo real.
                                                        </div>
                                                    </Link>
                                                </NavigationMenuLink>
                                                <NavigationMenuLink asChild>
                                                    <Link href="/mapa#grafica" onClick={handleEstadisticasClick}>
                                                        <div className="font-medium">Estadísticas</div>
                                                        <div className="text-muted-foreground">
                                                            Consulta tu rendimiento semanal y gráficas de progreso.
                                                        </div>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>Simulador</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[300px] gap-4">
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link href="#">
                                                        <div className="font-medium">Simulador de SafeCoins</div>
                                                        <div className="text-muted-foreground">
                                                            Simula tus transacciones con SafeCoins.
                                                        </div>
                                                    </Link>
                                                </NavigationMenuLink>
                                                <NavigationMenuLink asChild>
                                                    <Link href="#">
                                                        <div className="font-medium">Simulador del componente</div>
                                                        <div className="text-muted-foreground">
                                                            Simula el comportamiento del componente y el como te ayuda.
                                                        </div>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="ml-4 flex items-center">
                        <Badge variant="secondary" className="text-sm font-semibold">
                            SafeCoins: {safeCoins}
                        </Badge>
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
                <Link href={href}>
                    <div className="text-sm leading-none font-medium">{title}</div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
}