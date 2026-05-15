"use client"

import { useState, useEffect, useMemo } from "react"
import { 
  PlayCircle, 
  Search, 
  MoreVertical, 
  BookOpen, 
  Users, 
  Clock,
  LayoutGrid,
  List,
  Filter,
  DollarSign,
  ChevronRight,
  Sparkles,
  Layers,
  Calendar,
  BarChart3,
  MonitorPlay,
  FileText,
  HelpCircle,
  Settings2,
  Award,
  CheckCircle2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

export default function StudentCoursesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState("progress")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (user?.id) {
       fetchMyCourses()
    }
  }, [user])

  const fetchMyCourses = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`http://localhost:8081/api/pagos/usuario/${user?.id}`)
      if (res.ok) {
        setCourses(await res.json())
      }
    } catch {
      toast.error("Error al cargar tus cursos")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.titulo.toLowerCase().includes(searchQuery.toLowerCase())
      
      if (activeTab === "all") return matchesSearch
      if (activeTab === "completed") return matchesSearch && course.status === "Completado"
      if (activeTab === "progress") return matchesSearch && course.status !== "Completado"
      
      return matchesSearch
    })
  }, [courses, activeTab, searchQuery])

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary" />
              Mis Cursos
          </h4>
          <p className="text-muted-foreground mt-1 font-medium text-sm">Continúa tu aprendizaje y desarrolla nuevas habilidades estratégicas.</p>
        </div>
        <div className="flex gap-4">
            <Button 
            variant="outline" 
            className="gap-2 h-11 px-6 rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200 font-bold"
            onClick={() => router.push("/mis-clases/catalogo")}
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            Explorar Catálogo
          </Button>
        </div>
      </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between py-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="bg-card p-1 rounded-xl h-12 border-1 border-gray-200">
              <TabsTrigger value="all" className="px-6 font-bold">TODOS</TabsTrigger>
              <TabsTrigger value="progress" className="px-6 font-bold">EN PROGRESO</TabsTrigger>
              <TabsTrigger value="completed" className="px-6 font-bold">COMPLETADOS</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-4">
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors bg-card" />
              <Input 
                placeholder="Buscar entre mis clases..." 
                className="pl-12 h-12 w-full bg-card border-1 border-gray-200 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/10 transition-all rounded-xl text-sm" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 pb-20">
        {isLoading ? (
           <div className="col-span-full py-20 text-center animate-pulse">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-slate-200" />
              <p className="font-bold text-slate-400">Verificando tus inscripciones...</p>
           </div>
        ) : filteredCourses.length === 0 ? (
          <div className="col-span-full py-20 text-center">
             <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-slate-300" />
             </div>
             <h3 className="text-xl font-bold text-slate-800">No hay cursos coincidentes</h3>
             <p className="text-slate-500 mt-2 mb-8">{searchQuery ? "No encontramos cursos con ese nombre." : "No tienes cursos en esta categoría."}</p>
             {courses.length === 0 && (
               <Button className="rounded-2xl" onClick={() => router.push("/mis-clases/catalogo")}>
                  Ir al Catálogo
               </Button>
             )}
          </div>
        ) : filteredCourses.map((course) => (
          <Card 
            key={course.idPago || course.idCurso} 
            className="p-0 overflow-hidden border border-border/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group rounded-[2rem] bg-card cursor-pointer flex flex-col h-full"
            onClick={() => router.push(`/mis-clases/clase/${course.idCurso}`)}
          >
            
            {/* Imagen con overlay */}
            <div className="relative h-36 overflow-hidden bg-muted">
              <img 
                src={"/cursos/" + course.imgCurso} 
                alt={course.titulo}
                className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              
              {/* Badge de estado */}
              <div className="absolute top-4 right-4">
                <Badge 
                  className={cn(
                    "rounded-full px-3 py-1.5 border-0 font-black text-[10px] shadow-lg flex items-center gap-1.5 backdrop-blur-sm tracking-wider uppercase",
                    course.status === "Completado"
                      ? "bg-emerald-500/90 text-white"
                      : "bg-blue-500/90 text-white"
                  )}
                >
                  {course.status === "Completado" && <CheckCircle2 className="h-3 w-3" />}
                  {course.status?.toUpperCase() || "EN PROGRESO"}
                </Badge>
              </div>


              {/* Título sobre la imagen */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-lg font-black text-white leading-tight line-clamp-2 drop-shadow-lg">
                  {course.titulo}
                </h3>
              </div>
            </div>

            {/* Contenido */}
            <CardContent className="px-6 py-5 flex-1 flex flex-col gap-4">
              
              {/* Badge categoría movido al contenido */}
              <div className="flex items-center">
                <Badge 
                  style={{ backgroundColor: course.catColor || "#6366f1" }}
                  className="text-white text-[10px] font-black border-0 px-3 py-1 shadow-md uppercase tracking-wider"
                >
                  {course.categoria || course.catNombre || "General"}
                </Badge>
              </div>
              
              {/* Docente igual que catálogo */}
              <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-2xl border border-border/40">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-black text-primary">
                    {course.docenteNombre?.substring(0, 1) || "D"}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-none mb-1">Docente</p>
                  <p className="text-sm font-bold text-foreground truncate leading-none">{course.docenteNombre || "No asignado"}</p>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="space-y-2 mt-auto">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Progreso</span>
                  <span className="text-xs font-black text-foreground">{course.progreso || 0}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000 ease-out",
                      course.progreso === 100 
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-400" 
                        : "bg-gradient-to-r from-primary to-blue-400"
                    )}
                    style={{ width: `${course.progreso || 0}%` }}
                  />
                </div>
              </div>
            </CardContent>

            {/* Footer con botón */}
            <CardFooter className="px-6 pb-6 pt-0">
              <Button 
                className={cn(
                  "w-full rounded-2xl h-11 font-black shadow-lg transition-all duration-300 gap-2 flex items-center justify-center group/btn active:scale-95",
                  course.status === "Completado" 
                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 shadow-emerald-100" 
                    : "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
                )}
                onClick={(e) => { e.stopPropagation(); router.push(`/mis-clases/clase/${course.idCurso}`) }}
              >
                {course.status === "Completado" ? (
                  <>Ver Certificado <Award className="h-4 w-4 group-hover/btn:rotate-12 transition-transform" /></>
                ) : (
                  <>Continuar Clase <PlayCircle className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" /></>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
