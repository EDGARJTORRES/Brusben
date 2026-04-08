"use client"

import { usePathname } from "next/navigation"
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
  User,
  Calendar,
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

const menuItems = [
  { icon: Home, label: "Inicio", href: "/mis-clases" },
  { icon: BookOpen, label: "Cursos", href: "/mis-clases/cursos" },
  { icon: Users, label: "Compañeros", href: "/mis-clases/estudiantes" },
  { icon: PaymentIcon, label: "Mis Pagos", href: "/mis-clases/pagos" },
  { icon: Calendar, label: "Calendario", href: "/mis-clases/calendario" },
]

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <SidebarProvider style={{"--sidebar-width-icon": "5rem"} as React.CSSProperties}>
      <StudentSidebar pathname={pathname} />
      <SidebarInset className="bg-[#f8fafc]">
        {/* Modern Header */}
        <header className="sticky top-0 z-20 flex h-20 items-center gap-4 border-b border-border/40 bg-white/70 backdrop-blur-md px-8">
          <div className="flex items-center gap-4 flex-1">
            <SidebarTrigger className="md:hidden" />
            
            <div className="hidden md:flex flex-col gap-1">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/mis-clases" className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
                      <Home className="h-3 w-3" />
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {pathname !== "/mis-clases" && (
                    <>
                      <BreadcrumbSeparator className="text-slate-300" />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="text-xs font-bold text-primary uppercase tracking-wider">
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
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Buscar mis clases..."
                className="pl-10 h-10 w-64 bg-slate-100/50 border-0 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-primary/20 transition-all rounded-full text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
               <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100 text-slate-600">
                <div className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 border-2 border-white ring-1 ring-rose-200 text-[8px] font-black text-white flex items-center justify-center">2</span>
                </div>
              </Button>
              <div className="h-8 w-[1px] bg-slate-100 mx-2" />
              <Button variant="ghost" className="hidden sm:flex h-10 items-center gap-3 px-2 rounded-xl hover:bg-slate-100 transition-all">
                <div className="h-8 w-8 rounded-full ring-2 ring-white shadow-sm overflow-hidden border border-slate-100">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Molly" alt="" />
                </div>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-sm font-bold text-slate-900">Estudiante</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Mi Cuenta</span>
                </div>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

function StudentSidebar({ pathname }: { pathname: string }) {
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-100 bg-white z-[100]">
      {/* Header with border-bottom */}
      <SidebarHeader className="h-20 flex px-4 relative border-b border-slate-100/60 overflow-visible">
        <div className={cn("flex items-center gap-3 transition-all", isCollapsed ? "justify-center w-full" : "w-full justify-start")}>
          <div className="relative flex-shrink-0">
             <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center ring-2 ring-primary/10">
                <GraduationCap className="h-7 w-7 text-white" />
             </div>
             <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col justify-center min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">Brusben</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1 leading-none">Mis Clases</span>
            </div>
          )}
        </div>

        {/* Custom Toggle Button - Red as requested */}
        <button 
          onClick={toggleSidebar}
          className={cn(
            "absolute -right-3.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all z-[110] ring-4 ring-white border border-primary/20",
            isCollapsed && "rotate-180"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </SidebarHeader>

      <SidebarContent className="px-3 py-6">
        <SidebarMenu className="gap-2">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label} className="flex justify-center">
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                className={cn(
                  "h-14 px-4 rounded-2xl transition-all duration-200 font-bold",
                  isCollapsed ? "w-14 h-14 p-0 justify-center items-center" : "w-full",
                  pathname === item.href 
                    ? "bg-primary text-white hover:bg-primary/90" 
                    : "text-slate-600 hover:bg-accent hover:text-primary"
                )}
                tooltip={{
                  children: item.label,
                  className: "z-[210] bg-slate-900 text-white font-bold p-2 px-3 rounded-lg shadow-xl",
                  sideOffset: 12
                }}
              >
                <Link href={item.href} className={cn("flex items-center gap-4", isCollapsed ? "justify-center gap-0" : "")}>
                  <item.icon className={cn(
                    "h-7 w-7 flex-shrink-0 transition-transform",
                    pathname === item.href ? "text-white" : "text-slate-400 group-hover:text-primary"
                  )} />
                  {!isCollapsed && <span className="text-base transition-opacity duration-300 whitespace-nowrap">{item.label}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer with border-top */}
      <SidebarFooter className="p-4 border-t border-slate-100">
        <div className="flex flex-col gap-4">
           {/* Custom Initials Avatar */}
           <div className={cn("flex items-center gap-3 transition-all", isCollapsed ? "justify-center" : "px-2")}>
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-black flex-shrink-0">
                ES
              </div>
              {!isCollapsed && (
                <div className="flex flex-col justify-center min-w-0 animate-in fade-in duration-300">
                  <span className="text-sm font-black text-slate-900 leading-none">Estudiante</span>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight leading-none">Plan Premium</span>
                </div>
              )}
           </div>

           <div className={cn("flex flex-col gap-1", isCollapsed ? "items-center" : "px-1")}>
              <SidebarMenuButton className={cn("h-10 rounded-xl text-slate-400 hover:text-slate-900 flex items-center gap-4", isCollapsed ? "w-10 justify-center p-0" : "px-4 w-full")}>
                <User className="h-5 w-5" />
                {!isCollapsed && <span className="text-[13px] font-bold">Mi Perfil</span>}
              </SidebarMenuButton>
              <SidebarMenuButton className={cn("h-10 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 flex items-center gap-4", isCollapsed ? "w-10 justify-center p-0" : "px-4 w-full")}>
                <LogOut className="h-5 w-5" />
                {!isCollapsed && <span className="text-[13px] font-bold">Cerrar Sesión</span>}
              </SidebarMenuButton>
           </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
