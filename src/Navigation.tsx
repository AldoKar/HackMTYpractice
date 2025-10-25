"use client"

import * as React from "react"
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react"

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

const useIsMobile = (): boolean => {
    const [isMobile, setIsMobile] = React.useState<boolean>(false)

    React.useEffect(() => {
        if (typeof window === "undefined") return

        const mediaQuery = window.matchMedia("(max-width: 767px)")
        const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
            // MediaQueryListEvent for modern browsers, MediaQueryList for older ones when used directly
            // @ts-ignore - unify types for runtime check
            setIsMobile(event.matches ?? mediaQuery.matches)
        }

        // initialize state
        setIsMobile(mediaQuery.matches)

        // prefer addEventListener if available, fallback to addListener
        if ("addEventListener" in mediaQuery) {
            // modern API
            // @ts-ignore
            mediaQuery.addEventListener("change", handleChange)
            return () => {
                // @ts-ignore
                mediaQuery.removeEventListener("change", handleChange)
            }
        } else {
            // legacy API
            // @ts-ignore
            mediaQuery.addListener(handleChange)
            return () => {
                // @ts-ignore
                mediaQuery.removeListener(handleChange)
            }
        }
    }, [])

    return isMobile
}
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
    const isMobile = useIsMobile()

    return (
        <NavigationMenu viewport={isMobile} className="max-w-4xl mx-auto p-4 bg-background" >
            <NavigationMenuList className="flex-wrap justify-between w-full">
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Home</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <a
                                        className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6"
                                        href="/"
                                    >
                                        <div className="mb-2 text-lg font-medium sm:mt-4">
                                            PaySafe
                                        </div>
                                        <p className="text-muted-foreground text-sm leading-tight">
                                            Disfrute de ingresos pasivos mientras explora el potencial de PaySafe.
                                        </p>
                                    </a>
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
                        <ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {components.map((component) => (
                                <ListItem
                                    key={component.title}
                                    title={component.title}
                                    href={component.href}
                                >
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem className="hidden md:block">
                    <NavigationMenuTrigger>Mapa</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-4">
                            <li>
                                <NavigationMenuLink asChild>
                                    <Link href="#">
                                        <div className="font-medium">Components</div>
                                        <div className="text-muted-foreground">
                                            Browse all components in the library.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                    <Link href="#">
                                        <div className="font-medium">Documentation</div>
                                        <div className="text-muted-foreground">
                                            Learn how to use the library.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                    <Link href="#">
                                        <div className="font-medium">Blog</div>
                                        <div className="text-muted-foreground">
                                            Read our latest blog posts.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem className="hidden md:block">
                    <NavigationMenuTrigger>Leaderboard</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-4">
                            <li>
                                <NavigationMenuLink asChild>
                                    <Link href="#">
                                        <div className="font-medium">Racha</div>
                                        <div className="text-muted-foreground">
                                            Consulta tu racha actual y compite con otros usuarios.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                    <Link href="#">
                                        <div className="font-medium">Primeros lugares</div>
                                        <div className="text-muted-foreground">
                                            Consulta los primeros lugares de la competencia.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                    <Link href="#">
                                        <div className="font-medium">Insignias</div>
                                        <div className="text-muted-foreground">
                                            Consulta tus insignias y logros.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>



                <NavigationMenuItem className="hidden md:block">
                    <NavigationMenuTrigger>SafeCoins</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-4">
                            <li>
                                <NavigationMenuLink asChild>
                                    <Link href="#">
                                        <div className="font-medium">Administra tus SafeCoins</div>
                                        <div className="text-muted-foreground">
                                            Administra tus SafeCoins de manera eficiente.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                    <Link href="#">
                                        <div className="font-medium">Market</div>
                                        <div className="text-muted-foreground">
                                            Explora el mercado de SafeCoins.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                    <Link href="#">
                                        <div className="font-medium">Score Banorte</div>
                                        <div className="text-muted-foreground">
                                            Consulta tu Score Banorte y mejora tus beneficios.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>


                <NavigationMenuItem className="hidden md:block">
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