"use client"

import { useState, useEffect } from "react"
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
  CalendarDays,
  Sparkles,
  Users,
  UserCheck,
  Video,
  BarChart3,
  Target,
  Activity,
  Bell,
  Star,
  Eye,
  Settings,
  PlusCircle,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Buenos días"
  if (h < 18) return "Buenas tardes"
  return "Buenas noches"
}


export default function TeacherDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  
  // State for real data
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalVideos: 0,
    totalEarnings: 0,
    totalViews: 0
  })
  const [courses, setCourses] = useState([])
  const [courseMaterials, setCourseMaterials] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)

  // Fetch real teacher data
  useEffect(() => {
    fetchTeacherData()
  }, [])

  const fetchTeacherData = async () => {
    try {
      // Fetch teacher's courses
      const coursesRes = await fetch("http://localhost:8081/api/cursos")
      const allCourses = await coursesRes.json()
      const teacherCourses = allCourses.filter((course: any) => course.idDocente === user?.id)
      setCourses(teacherCourses)

      // Fetch teacher's payments/earnings
      const egresosRes = await fetch("http://localhost:8081/api/egresos-docentes")
      const docentesRes = await fetch("http://localhost:8081/api/egresos-docentes/docentes")
      const [allEgresos, docentes] = await Promise.all([egresosRes.json(), docentesRes.json()])
      
      // Filter payments for current teacher
      const teacherEgresos = allEgresos.filter((egreso: any) => {
        if (typeof egreso.docente === 'number' && egreso.docente === user?.id) {
          return true
        }
        if (typeof egreso.docente === 'string') {
          const docente = docentes.find((d: any) => d.nombres === egreso.docente)
          return docente?.idUsuario === user?.id
        }
        return false
      })

      // Calculate total earnings
      const totalEarnings = teacherEgresos.reduce((sum: number, egreso: any) => sum + Number(egreso.monto), 0)

      // Fetch course materials to count videos and calculate views
      let totalVideos = 0
      let totalViews = 0
      const materialsData: any = {}
      
      for (const course of teacherCourses) {
        try {
          const materialsRes = await fetch(`http://localhost:8081/api/cursos-materiales/${course.idCurso}/modulos`)
          const modules = await materialsRes.json()
          let courseVideoCount = 0
          let courseViewCount = 0
          
          modules.forEach((module: any) => {
            if (module.materiales) {
              const videos = module.materiales.filter((material: any) => material.tipoMaterial === 'VIDEO')
              courseVideoCount += videos.length
              // Sum views from videos (assuming views field exists)
              videos.forEach((video: any) => {
                courseViewCount += video.vistas || 0
              })
            }
          })
          
          totalVideos += courseVideoCount
          totalViews += courseViewCount
          materialsData[course.idCurso] = {
            videos: courseVideoCount,
            views: courseViewCount,
            modules: modules
          }
        } catch (error) {
          console.error('Error fetching materials for course:', course.idCurso)
          materialsData[course.idCurso] = { videos: 0, views: 0, modules: [] }
        }
      }
      
      setCourseMaterials(materialsData)

      setStats({
        totalCourses: teacherCourses.length,
        totalVideos,
        totalEarnings,
        totalViews
      })
    } catch (error) {
      toast.error("Error al cargar datos del dashboard")
      console.error('Dashboard data fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Dynamic stats based on real data
  const statsCards = [
    {
      title: "MIS CURSOS",
      value: stats.totalCourses.toString(),
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100/50",
      description: "Total publicados"
    },
    {
      title: "TOTAL VIDEOS",
      value: stats.totalVideos.toString(),
      icon: Video,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100/50",
      description: "En todos los cursos"
    },
    {
      title: "VISUALIZACIONES",
      value: stats.totalViews > 1000 ? `${(stats.totalViews / 1000).toFixed(1)}K` : stats.totalViews.toString(),
      icon: Eye,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      iconBg: "bg-emerald-100/50",
      description: "Acumuladas"
    },
    {
      title: "GANANCIAS",
      value: `S/ ${stats.totalEarnings.toFixed(2)}`,
      icon: DollarSign,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      iconBg: "bg-rose-100/50",
      description: "Acumuladas"
    },
  ]

  return (
    <div className="space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-2xl font-black text-foreground flex items-center gap-2 flex-wrap">
            <Sparkles className="h-6 w-6 text-primary flex-shrink-0" />
            {getGreeting()}, {user?.nombre ?? "Admin"} 👋
          </h4>
          <p className="text-muted-foreground text-sm mt-1">
             Gestiona tus cursos y monitorea el progreso de tus estudiantes en <span className="text-foreground font-bold">Brusben E.I.R.L </span>.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-5 py-3 shadow-sm self-start sm:self-auto">
          <CalendarDays className="h-5 w-5 text-primary" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Hoy</p>
            <p className="text-sm font-bold text-foreground">
              {new Date().toLocaleDateString("es-PE", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border border-border shadow-sm rounded-2xl overflow-hidden relative group animate-pulse">
              <CardContent className="py-2 px-8">
                <div className="flex items-start justify-between">
                  <div className="bg-muted h-12 w-12 rounded-2xl mb-4" />
                  <div className="bg-muted h-6 w-16 rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="bg-muted h-3 w-20 rounded" />
                  <div className="bg-muted h-8 w-16 rounded" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          statsCards.map((stat: any) => (
            <Card key={stat.title} className="border border-border shadow-sm rounded-2xl overflow-hidden relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="px-4">
                <div className="flex items-center gap-6">
                  <div className={`${stat.iconBg} ${stat.color} p-3 rounded-2xl group-hover:scale-110 transition-transform flex-shrink-0`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
                    <p className="text-2xs font-black text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.description}</p>
                  </div>
                </div>
                {/* Background accent */}
                <div className={`absolute top-0 right-0 h-32 w-32 ${stat.bgColor} rounded-full -mr-16 -mt-16 opacity-30 z-0`} />
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Main List Section - Teacher's Courses */}
        <Card className="lg:col-span-8 border-0 shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-extrabold tracking-tight text-foreground">Mis Cursos</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">Gestiona y monitorea el rendimiento de tus cursos</CardDescription>
            </div>
            <Button variant="ghost" className="text-primary font-bold gap-2 hover:bg-primary/5" onClick={() => router.push("/docente/curso")}>
              Ver todos <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-6 animate-pulse">
                    <div className="h-12 w-12 rounded-xl bg-muted" />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="bg-muted h-4 w-48 rounded" />
                        <div className="bg-muted h-4 w-24 rounded" />
                      </div>
                      <div className="h-2.5 w-full bg-muted rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-16">
                <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">No tienes cursos creados</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">Comienza creando tu primer curso para empezar a compartir tu conocimiento con estudiantes.</p>
                <Button onClick={() => router.push("/docente/curso")} className="bg-primary hover:bg-primary/90 h-12 px-8 rounded-2xl font-bold gap-2">
                  <PlusCircle className="h-5 w-5" />
                  Crear mi primer curso
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.slice(0, 3).map((course: any, index) => (
                  <div key={course.idCurso} className="group border border-border/50 rounded-2xl p-6 hover:shadow-md transition-all duration-300 hover:border-primary/30 cursor-pointer" onClick={() => router.push(`/docente/curso`)}>
                    <div className="flex items-center gap-6">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 text-primary flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                              {course.titulo}
                            </h4>
                            <div className="flex items-center gap-3">
                              <Badge className={`${course.estCurso === 'A' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-rose-100 text-rose-700 border-rose-200'} border text-xs font-bold`}>
                                {course.estCurso === 'A' ? 'Activo' : 'Inactivo'}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {course.catNombre || 'Sin categoría'}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-black text-foreground">S/ {Number(course.precioCurso || 0).toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Video className="h-4 w-4" />
                              <span>{courseMaterials[course.idCurso]?.videos ?? 0} videos</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{courseMaterials[course.idCurso]?.views ?? 0} vistas</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-primary">
                            <span className="text-xs font-medium">Ver detalles</span>
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {courses.length > 3 && (
                  <div className="pt-4 border-t border-border/50">
                    <Button variant="outline" className="w-full h-12 rounded-2xl font-bold" onClick={() => router.push("/docente/curso")}>
                      Ver todos los cursos ({courses.length - 3} más)
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar Section */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-0 shadow-xl rounded-3xl overflow-hidden text-white p-8 relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <LayoutGrid className="h-8 w-18" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight">Acciones Rápidas</h3>
                <p className="text-slate-400 text-sm font-medium">Gestiona tu enseñanza hoy</p>
              </div>
              <div className="grid gap-3 mt-8">
                <Button className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300 gap-3 justify-start px-2 group border border-white/10" onClick={() => router.push("/docente/curso")}>
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-lg block">Gestionar Cursos</span>
                    <span className="text-xs text-slate-400">Crear y editar</span>
                  </div>
                </Button>
                <Button className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300 gap-3 justify-start px-2 group border border-white/10" onClick={() => router.push("/docente/pago")}>
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-lg block">Mis Pagos</span>
                    <span className="text-xs text-slate-400">Ver historial</span>
                  </div>
                </Button>
                <Button className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300 gap-3 justify-start px-2 group border border-white/10" onClick={() => router.push("/docente/configuracion")}>
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Settings className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-lg block">Configuración</span>
                    <span className="text-xs text-slate-400">Ajustes de cuenta</span>
                  </div>
                </Button>
              </div>
            </div>
          </Card>

          {/* Recent Activity - Real Data Based */}
          <Card className="border-0 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="px-6 py-4 border-b border-slate-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-extrabold tracking-tight text-foreground">Resumen de Actividad</CardTitle>
                <Activity className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Video className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">Total de Videos</span>
                  </div>
                  <span className="text-sm font-bold">{stats.totalVideos}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Eye className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">Visualizaciones</span>
                  </div>
                  <span className="text-sm font-bold">{stats.totalViews}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">Ganancias</span>
                  </div>
                  <span className="text-sm font-bold">S/ {stats.totalEarnings.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Card - Real Data Based */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 rounded-3xl p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Métricas Principales</h3>
                  <p className="text-sm text-muted-foreground">Basado en tus datos</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Promedio de videos por curso</span>
                  <span className="font-bold text-foreground">
                    {stats.totalCourses > 0 ? (stats.totalVideos / stats.totalCourses).toFixed(1) : '0'}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ 
                    width: `${Math.min(100, (stats.totalVideos / Math.max(1, stats.totalCourses)) * 10)}%` 
                  }} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total de cursos activos</span>
                  <span className="font-bold text-foreground">{stats.totalCourses}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ 
                    width: `${Math.min(100, stats.totalCourses * 20)}%` 
                  }} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
