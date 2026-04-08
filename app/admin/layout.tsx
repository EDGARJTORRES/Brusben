"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
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
  BarChart3,
  Settings,
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/auth-context"

type SingleMenuItem = {
  type: "single"
  icon: any
  label: string
  href: string
}

type GroupMenuItem = {
  type: "group"
  icon: any
  label: string
  children: { icon: any; label: string; href: string }[]
}

type MenuItem = SingleMenuItem | GroupMenuItem

const menuGroups: MenuItem[] = [
  {
    type: "single",
    icon: Home,
    label: "Inicio",
    href: "/admin",
  },
  {
    type: "group",
    icon: User,
    label: "Gestión de Usuarios",
    children: [
      { icon: User, label: "Usuarios", href: "/admin/Usuarios" },
      { icon: Users, label: "Estudiantes", href: "/admin/Estudiantes" },
    ],
  },
  {
    type: "group",
    icon: GraduationCap,
    label: "Académico",
    children: [
      { icon: BookOpen, label: "Cursos", href: "/admin/Cursos" },
      { icon: GraduationCap, label: "Control Academico", href: "/admin/ControlAcademico" },
    ],
  },
  {
    type: "group",
    icon: PaymentIcon,
    label: "Finanzas",
    children: [
      { icon: PaymentIcon, label: "Pagos", href: "/admin/Pagos" },
    ],
  },
  {
    type: "single",
    icon: BarChart3,
    label: "Reportes",
    href: "/admin/Reportes",
  },
  {
    type: "single",
    icon: Settings,
    label: "Configuración",
    href: "/admin/Configuracion",
  },
  {
    type: "single",
    icon: User,
    label: "Ver Perfil",
    href: "/admin/Perfil",
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  // Obtener iniciales del nombre para el avatar
  const getInitials = (nombre?: string) => {
    if (!nombre) return "U"
    const parts = nombre.split(" ")
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase()
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <SidebarProvider style={{ "--sidebar-width-icon": "5rem" } as React.CSSProperties}>
      <AdminSidebar pathname={pathname} user={user} onLogout={handleLogout} />
      <SidebarInset className="bg-background">
        {/* Modern Header */}
        <header className="sticky top-0 z-20 flex h-20 items-center gap-4 border-b border-border/40 bg-background/70 backdrop-blur-md px-8">
          <div className="flex items-center gap-4 flex-1">
            <SidebarTrigger className="md:hidden" />

            <div className="hidden md:flex flex-col gap-1">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href="/admin"
                      className="flex items-center gap-1.5 text-sm font-bold tracking-wider"
                    >
                      <Home className="h-6 w-4" />
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {pathname !== "/admin" && (
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
                placeholder="Buscar recursos..."
                className="pl-10 h-10 w-64 bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary/20 transition-all rounded-full text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl hover:bg-muted text-muted-foreground"
              >
                <div className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-rose-500 border-2 border-background ring-1 ring-rose-200 text-[8px] font-black text-white flex items-center justify-center">
                    3
                  </span>
                </div>
              </Button>
              <div className="h-8 w-[1px] bg-border mx-2" />
              <Button
                variant="ghost"
                className="flex h-10 items-center gap-3 px-2 rounded-xl hover:bg-muted transition-all"
              >
                <div className="h-8 w-8 rounded-full ring-2 ring-background shadow-sm overflow-hidden border border-border flex-shrink-0 bg-primary text-white flex items-center justify-center font-bold text-sm">
                  {user?.nombre ? getInitials(user.nombre) : "U"}
                </div>
                <div className="hidden sm:flex flex-col items-start leading-none">
                  <span className="text-sm font-bold text-foreground">{user?.nombre || "Usuario"}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                    {user?.rol || "Sin rol"}
                  </span>
                </div>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Cerrar Sesión"
                onClick={handleLogout}
                className="h-10 w-10 rounded-xl hover:bg-rose-50 hover:text-rose-600 text-muted-foreground transition-all dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

function AdminSidebar({ pathname, user, onLogout }: { pathname: string; user: any; onLogout: () => void }) {
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === "collapsed"

  // Obtener iniciales del nombre para el avatar
  const getInitials = (nombre?: string) => {
    if (!nombre) return "U"
    const parts = nombre.split(" ")
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase()
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar z-40">
      <SidebarHeader className="h-auto flex flex-col gap-4 px-4 py-4 border-b border-border/60 overflow-visible">
        <div
          className={cn(
            "flex items-center gap-3 transition-all",
            isCollapsed ? "justify-center w-full" : "w-full justify-start"
          )}
        >
          <div className="relative flex-shrink-0">
            <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center ring-2 ring-primary/10">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col justify-center min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="text-xl font-bold tracking-tight text-sidebar-foreground leading-none">
                Brusben E.I.R.L
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1 leading-none">
                Panel Admin
              </span>
            </div>
          )}
        </div>

        {/* Custom Toggle Button */}
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

      <SidebarContent className="px-3 py-6 overflow-y-auto overflow-x-visible [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400">
        <SidebarMenu className="gap-2">
          {menuGroups.map((item) => {
            if (item.type === "single") {
              const isActive = pathname === item.href

              return (
                <SidebarMenuItem key={item.label} className="flex justify-center">
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "h-12 px-4 rounded-2xl transition-all duration-200 font-bold",
                      isCollapsed ? "w-14 h-14 p-0 justify-center items-center" : "w-full",
                      isActive
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    tooltip={{
                      children: item.label,
                      className:
                        "z-[210] bg-slate-900 text-white font-bold p-2 px-3 rounded-lg shadow-xl",
                      sideOffset: 12,
                    }}
                  >
                    <Link
                      href={item.href}
                      className={cn("flex items-center gap-4", isCollapsed ? "justify-center gap-0" : "")}
                    >
                      <item.icon
                        className={cn(
                          "h-6 w-6 flex-shrink-0 transition-transform",
                          isActive ? "text-white" : "text-muted-foreground"
                        )}
                      />
                      {!isCollapsed && (
                        <span className="text-sm transition-opacity duration-300 whitespace-nowrap">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            }

            const hasActiveChild = item.children?.some((child) => pathname === child.href)

            return (
              <SidebarGroupItem
                key={item.label}
                item={item as GroupMenuItem}
                pathname={pathname}
                isCollapsed={isCollapsed}
                hasActiveChild={hasActiveChild}
              />
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border">
        <div className="flex flex-col gap-4">
          {/* User Info Section */}
          <div
            className={cn(
              "flex items-center gap-3 transition-all p-2 rounded-lg bg-sidebar-accent/30",
              isCollapsed ? "justify-center" : ""
            )}
          >
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-black flex-shrink-0 text-sm">
              {user?.nombre ? getInitials(user.nombre) : "U"}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col justify-center min-w-0 animate-in fade-in duration-300">
                <span className="text-sm font-bold text-sidebar-foreground leading-none truncate">
                  {user?.nombre || "Usuario"}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground mt-0.5 uppercase tracking-tight leading-none">
                  {user?.rol || "Sin rol"}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className={cn("flex flex-col gap-2", isCollapsed ? "items-center" : "")}>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className={cn(
                "h-10 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all flex items-center gap-3 font-medium",
                isCollapsed ? "w-10 justify-center px-0" : "w-full justify-start px-3"
              )}
              title={isCollapsed ? "Cerrar Sesión" : ""}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>Cerrar Sesión</span>}
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

function SidebarGroupItem({
  item,
  pathname,
  isCollapsed,
  hasActiveChild,
}: {
  item: GroupMenuItem
  pathname: string
  isCollapsed: boolean
  hasActiveChild?: boolean
}) {
  const [open, setOpen] = useState(hasActiveChild)
  const [showFloatingMenu, setShowFloatingMenu] = useState(false)

  return (
    <div className="relative space-y-1">
      <button
        onClick={() => {
          if (isCollapsed) {
            setShowFloatingMenu(!showFloatingMenu)
          } else {
            setOpen(!open)
          }
        }}
        className={cn(
          "w-full flex items-center rounded-2xl transition-all duration-200 font-bold relative z-10",
          isCollapsed ? "h-14 w-14 justify-center mx-auto" : "h-12 px-4 justify-between",
          hasActiveChild
            ? "bg-primary/10 text-primary"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        title={isCollapsed ? item.label : undefined}
      >
        <div className={cn("flex items-center gap-4", isCollapsed ? "justify-center" : "")}>
          <item.icon
            className={cn(
              "h-6 w-6 flex-shrink-0",
              hasActiveChild ? "text-primary" : "text-muted-foreground"
            )}
          />
          {!isCollapsed && <span className="text-sm whitespace-nowrap">{item.label}</span>}
        </div>

        {!isCollapsed && (
          <ChevronDown
            className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")}
          />
        )}
      </button>

      {/* Submenú normal cuando está expandido */}
      {!isCollapsed && open && (
        <div className="ml-4 space-y-1 border-l border-border pl-3">
          {item.children.map((child) => {
            const isChildActive = pathname === child.href

            return (
              <Link
                key={child.label}
                href={child.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                  isChildActive
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <child.icon className={cn("h-4 w-4", isChildActive ? "text-white" : "")} />
                <span>{child.label}</span>
              </Link>
            )
          })}
        </div>
      )}

      {/* Submenú flotante cuando está colapsado */}
      {isCollapsed && showFloatingMenu && (
        <div className="fixed left-[calc(5rem+1rem)] top-[6rem] z-[100] min-w-[220px] rounded-2xl border border-border bg-background shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-3 py-2 text-xs font-black uppercase tracking-wider text-muted-foreground">
            {item.label}
          </div>

          <div className="space-y-1">
            {item.children.map((child) => {
              const isChildActive = pathname === child.href

              return (
                <Link
                  key={child.label}
                  href={child.href}
                  onClick={() => setShowFloatingMenu(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                    isChildActive
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <child.icon className={cn("h-4 w-4", isChildActive ? "text-white" : "")} />
                  <span>{child.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}