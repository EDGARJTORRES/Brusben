"use client"

import {
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  PlayCircle,
  FileText,
  ChevronRight,
  LayoutGrid,
  DollarSign,
  Users,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const statsCards = [
  {
    title: "MIS CURSOS",
    value: "0",
    badge: "ACTIVOS",
    icon: BookOpen,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-100/50",
  },
  {
    title: "HORAS DE ESTUDIO",
    value: "0 h",
    badge: "TOTAL",
    icon: Clock,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    iconBg: "bg-rose-100/50",
  },
  {
    title: "CERTIFICADOS",
    value: "0",
    badge: "OBTENIDOS",
    icon: Award,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    iconBg: "bg-slate-100/50",
  },
  {
    title: "PROMEDIO ACTUAL",
    value: "0.0",
    badge: "EXCELENTE",
    icon: TrendingUp,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    iconBg: "bg-emerald-100/50",
  },
]

const myClasses = [
  { rank: "1º", name: "DIPLOMADO EN MARKETING DIGITAL", sales: "Progreso: 75%", demand: "8/12 Lecc.", progress: 75 },
  { rank: "2º", name: "GESTIÓN DE PROYECTOS CON PMP", sales: "Progreso: 40%", demand: "4/10 Lecc.", progress: 40 },
  { rank: "3º", name: "EXCEL AVANZADO PARA FINANZAS", sales: "Progreso: 15%", demand: "2/12 Lecc.", progress: 15 },
]

export default function StudentDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
           ¡Hola, {user?.nombre || "Estudiante"}! 👋
          </h1>
          <p className="text-muted-foreground font-medium">
            Continúa donde lo dejaste y alcanza tus metas en <span className="text-primary font-bold">Brusben</span>.
          </p>
        </div>
        
        {/* Date Badge */}
        <div className="flex items-center gap-4 bg-white p-3 px-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ESTADO ACTUAL</span>
            <span className="text-sm font-bold text-slate-900">Alumno Regular</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm rounded-3xl overflow-hidden relative group">
            <CardContent className="p-8">
              <div className="flex items-start justify-between">
                <div className={`${stat.iconBg} ${stat.color} p-2 rounded-2xl mb-4`}>
                  <stat.icon className="h-7 w-7" />
                </div>
                <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-tight">
                  {stat.badge}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
                <p className="text-2xl font-black text-slate-800">{stat.value}</p>
              </div>
              {/* Background accent */}
              <div className={`absolute top-0 right-0 h-32 w-32 ${stat.bgColor} rounded-full -mr-16 -mt-16 opacity-50 z-0`} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Main List Section */}
        <Card className="lg:col-span-8 border-0 shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-extrabold tracking-tight text-foreground">Mis Clases en Progreso</CardTitle>
            <Button variant="ghost" className="text-primary font-bold gap-2 hover:bg-primary/5" onClick={() => router.push("/mis-clases/cursos")}>
              Ir a mis cursos <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            {myClasses.map((course, index) => (
              <div key={course.name} className="flex items-center gap-6 group">
                <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg ring-1 ring-blue-100">
                  {course.rank}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-sm tracking-tight group-hover:text-primary transition-colors cursor-pointer capitalize">
                      {course.name.toLowerCase()}
                    </span>
                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900">{course.sales}</span>
                      <span className="text-[10px] block text-slate-400 font-bold uppercase">{course.demand}</span>
                    </div>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out shadow-sm"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions Sidebar Section */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-slate-800 border-0 shadow-xl rounded-3xl overflow-hidden text-white p-10 relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <LayoutGrid className="h-8 w-18" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight  underline-offset-8">Acciones Rápidas</h3>
                <p className="text-slate-400 text-sm font-medium">Gestiona tu aprendizaje hoy.</p>
              </div>
              <div className="grid gap-4 mt-10">
                <Button className="h-16 rounded-2xl bg-white/10 hover:bg-white hover:text-slate-900 transition-all duration-300 gap-4 justify-start px-6 group border border-white/10 group shadow-lg" onClick={() => router.push("/mis-clases/cursos")}>
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                    <PlayCircle className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-lg">Continuar Clase</span>
                </Button>
                <Button className="h-16 rounded-2xl bg-white/10 hover:bg-white hover:text-slate-900 transition-all duration-300 gap-4 justify-start px-6 group border border-white/10 shadow-lg" onClick={() => router.push("/mis-clases/pagos")}>
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-lg">Ver mis pagos</span>
                </Button>
                <Button className="h-16 rounded-2xl bg-white/10 hover:bg-white hover:text-slate-900 transition-all duration-300 gap-4 justify-start px-6 group border border-white/10 shadow-lg" onClick={() => router.push("/mis-clases/apoyo")}>
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-lg">Mis Compañeros</span>
                </Button>
              </div>
            </div>
          </Card>
          
          <Card className="bg-primary border-0 shadow-lg shadow-primary/20 rounded-3xl p-8 text-white flex items-center justify-between group cursor-pointer hover:scale-[1.02] transition-transform">
             <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                   <Award className="h-6 w-6" />
                </div>
                <div>
                   <p className="font-black text-lg leading-tight uppercase">Próxima Meta</p>
                   <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Diplomado en Marketing</p>
                </div>
             </div>
             <ChevronRight className="h-6 w-6 text-white/40 group-hover:text-white transition-colors" />
          </Card>
        </div>
      </div>
    </div>
  )
}
