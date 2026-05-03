"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Home,
  Users,
  BookOpen,
  CreditCard as PaymentIcon,
  GraduationCap,
  LogOut,
  Bell,
  Search,
  ChevronLeft,
  ChevronDown,
  User,
  Calendar,
  HelpCircle,
} from "lucide-react"

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { RouteGuard } from "@/lib/route-guard"

const menuItems = [
  { icon: Home, label: "Inicio", href: "/mis-clases" },
  { icon: BookOpen, label: "Cursos", href: "/mis-clases/cursos" },
  { icon: Search, label: "Catálogo", href: "/mis-clases/catalogo" },
  { icon: Users, label: "Compañeros", href: "/mis-clases/estudiantes" },
  { icon: PaymentIcon, label: "Mis Pagos", href: "/mis-clases/pagos" },
  { icon: Calendar, label: "Calendario", href: "/mis-clases/calendario" },
  { icon: HelpCircle, label: "Ayuda", href: "/mis-clases/ayuda" },
]

export default function StudentLayout({
  children,
  }: {
    children: React.ReactNode
  }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const getInitials = (nombre?: string) => {
    if (!nombre) return "E"
    const parts = nombre.split(" ")
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase()
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <RouteGuard allowedRoles={["estudiante"]}>
      <SidebarProvider style={{"--sidebar-width-icon": "5rem"} as React.CSSProperties}>
      <StudentSidebar pathname={pathname} user={user} onLogout={handleLogout} />
      <SidebarInset className="bg-background">
        {/* Modern Header */}
        <header className="sticky top-0 z-20 flex h-18 items-center gap-4 border-b border-border/40 bg-sidebar backdrop-blur-md px-8">
          <div className="flex items-center gap-4 flex-1">
            <SidebarTrigger className="md:hidden" />
            
            <div className="hidden md:flex flex-col gap-1">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/mis-clases"  className="flex items-center gap-1.5 text-sm font-bold tracking-wider">
                      <Home className="h-4 w-4" />
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {pathname !== "/mis-clases" && (
                    <>
                      <BreadcrumbSeparator className="text-muted-foreground" />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="text-sm font-bold text-primary">
                          {pathname.split("/").pop()?.replace(/-/g, " ")}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Buscar mis clases..."
                className="pl-10 h-10 w-64 bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary/20 transition-all rounded-full text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-muted text-muted-foreground">
                <div className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-rose-500 border-2 border-background ring-1 ring-rose-200 text-[8px] font-black text-white flex items-center justify-center">2</span>
                </div>
              </Button>
              <div className="h-8 w-[1px] bg-border mx-2" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex h-10 items-center gap-3 px-2 rounded-xl hover:bg-muted transition-all group"
                  >
                    <div className="h-8 w-8 rounded-full ring-2 ring-background shadow-sm overflow-hidden border border-border flex-shrink-0 bg-primary text-white flex items-center justify-center font-bold text-sm">
                      {user?.nombre ? getInitials(user.nombre) : "E"}
                    </div>
                    <div className="hidden sm:flex flex-col items-start leading-none">
                      <span className="text-sm font-bold text-foreground">{user?.nombre || "Estudiante"}</span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{user?.rol || "Estudiante"}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] p-2 rounded-xl shadow-xl border-border">
                  <DropdownMenuItem
                    onClick={() => router.push("/mis-clases/perfil")}
                    className="rounded-lg h-10 px-3 cursor-pointer font-medium hover:bg-muted gap-2"
                  >
                    <User className="h-4 w-4" />
                    Ver Perfil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 bg-border" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-lg h-10 px-3 cursor-pointer font-bold text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-500/10 gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto bg-sidebar">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
    </RouteGuard>
  )
}

function StudentSidebar({ pathname, user, onLogout }: { pathname: string; user: any; onLogout: () => void }) {
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === "collapsed"

  // Obtener iniciales del nombre para el avatar
  const getInitials = (nombre?: string) => {
    if (!nombre) return "E"
    const parts = nombre.split(" ")
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase()
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar z-40">
      {/* Header with border-bottom */}
      <SidebarHeader className="h-auto flex flex-col gap-4 px-2 py-4 border-b border-border/60 overflow-visible">
        <div className={cn("flex items-center gap-3 transition-all", isCollapsed ? "justify-center w-full" : "w-full justify-start")}>
          <div className="relative flex-shrink-0">
             <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center ring-2 ring-primary/10">
                <GraduationCap className="h-6 w-6 text-white" />
             </div>
             <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col justify-center min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
              <span  className="text-xl font-bold tracking-tight text-sidebar-foreground leading-none">Brusben E.I.R.L</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1 leading-none">Mis Clases</span>
            </div>
          )}
        </div>

        {/* Custom Toggle Button - Red as requested */}
        <button 
          onClick={toggleSidebar}
          className={cn(
            "absolute -right-3.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all z-40 ring-4 ring-white border border-primary/20",
            isCollapsed && "rotate-180"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4 overflow-y-auto overflow-x-visible [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400">
        <SidebarMenu className="gap-2">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label} className="flex justify-center">
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                className={cn(
                  "h-11 px-4 rounded-2xl transition-all duration-200 font-bold group/item",
                  isCollapsed ? "w-12 h-12 p-0 justify-center items-center" : "w-full",
                  pathname === item.href 
                    ? "bg-primary text-white hover:bg-primary/90" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                tooltip={{
                  children: item.label,
                  className:
                        "z-[210] bg-slate-900 text-white font-bold p-2 px-3 rounded-lg shadow-xl",
                  sideOffset: 12
                }}
              >
                <Link href={item.href} className={cn("flex items-center gap-4", isCollapsed ? "justify-center gap-0" : "")}>
                  <item.icon className={cn(
                    "h-5 w-5 flex-shrink-0 transition-colors",
                    pathname === item.href ? "text-white" : "text-slate-400 group-hover/item:text-primary"
                  )} />
                  {!isCollapsed && <span className="text-sm transition-opacity duration-300 whitespace-nowrap">{item.label}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      {/* Botón de logout en mobile para Sidebar */}
      <SidebarFooter className="p-4 border-t border-slate-100 md:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="w-full justify-start px-3 h-10 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-all flex items-center gap-3 font-medium"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span>Cerrar Sesión</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
