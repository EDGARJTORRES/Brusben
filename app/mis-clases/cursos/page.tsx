"use client"

import { useState } from "react"
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
import { useEffect } from "react"
import { toast } from "sonner"

export default function StudentCoursesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

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

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Mis Cursos</h1>
          <p className="text-muted-foreground font-medium">Continúa tu aprendizaje y desarrolla nuevas habilidades estratégicas.</p>
        </div>
        <div className="flex items-center gap-3">
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

      <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white/70 backdrop-blur-xl p-2 px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between py-4">
          <Tabs defaultValue="progress" className="w-full md:w-auto">
            <TabsList className="bg-slate-100/50 p-1 rounded-xl h-12">
              <TabsTrigger value="all" className="rounded-lg font-bold text-xs h-10 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all tracking-wide text-slate-400 data-[state=active]:text-primary">TODOS</TabsTrigger>
              <TabsTrigger value="progress" className="rounded-lg font-bold text-xs h-10 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all tracking-wide text-slate-400 data-[state=active]:text-primary">EN PROGRESO</TabsTrigger>
              <TabsTrigger value="completed" className="rounded-lg font-bold text-xs h-10 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all tracking-wide text-slate-400 data-[state=active]:text-primary">COMPLETADOS</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-4">
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input placeholder="Buscar entre mis clases..." className="pl-12 h-12 w-full bg-slate-100/50 border-0 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/10 transition-all rounded-xl text-sm" />
            </div>
            <div className="flex items-center bg-slate-100/50 rounded-xl p-1 h-12 ring-1 ring-slate-100">
               <Button 
                variant={viewMode === "grid" ? "secondary" : "ghost"} 
                size="icon" 
                className={`h-10 w-10 rounded-lg ${viewMode === "grid" ? 'shadow-sm bg-white' : 'text-slate-400'}`}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-5 w-5" />
              </Button>
              <Button 
                variant={viewMode === "list" ? "secondary" : "ghost"} 
                size="icon" 
                className={`h-10 w-10 rounded-lg ${viewMode === "list" ? 'shadow-sm bg-white' : 'text-slate-400'}`}
                onClick={() => setViewMode("list")}
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 pb-20">
        {isLoading ? (
           <div className="col-span-full py-20 text-center animate-pulse">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-slate-200" />
              <p className="font-bold text-slate-400">Verificando tus inscripciones...</p>
           </div>
        ) : courses.length === 0 ? (
          <div className="col-span-full py-20 text-center">
             <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-slate-300" />
             </div>
             <h3 className="text-xl font-bold text-slate-800">No tienes cursos todavía</h3>
             <p className="text-slate-500 mt-2 mb-8">Debes completar el pago de un curso para poder acceder aquí.</p>
             <Button className="rounded-2xl" onClick={() => router.push("/mis-clases/catalogo")}>
                Ir al Catálogo
             </Button>
          </div>
        ) : courses.map((course) => (
          <Card key={course.idMatricula || course.idCurso} className="overflow-hidden border-0 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group rounded-3xl bg-card ring-1 ring-slate-100">
            <div className="relative h-56 overflow-hidden">
              <img 
                src={course.imgCurso?.startsWith("http") ? course.imgCurso : "/images/course-marketing.jpg"} 
                alt={course.titulo}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute top-4 left-4">
                <Badge 
                  className={`rounded-full px-4 py-1.5 border-0 font-bold tracking-tight text-[10px] shadow-lg flex items-center gap-1.5 ${
                    course.status === "Completado"
                      ? "bg-emerald-500 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {course.status === "Completado" && <CheckCircle2 className="h-3 w-3" />}
                  {course.status?.toUpperCase() || "EN PROGRESO"}
                </Badge>
              </div>
            </div>

            <CardHeader className="p-6 pb-2">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="rounded-lg text-[10px] font-bold bg-violet-50 text-violet-600 ring-1 ring-violet-100 border-0 h-6 px-2">
                  {course.categoria?.toUpperCase() || "ACADÉMICO"}
                </Badge>
              </div>
              <CardTitle className="text-1xl font-extrabold tracking-tight text-foreground line-clamp-2 min-h-[48px]">
                {course.titulo}
              </CardTitle>
            </CardHeader>

            <CardContent className="px-6 py-4">
              <div className="mt-2 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PROGRESO DEL CURSO</span>
                  <span className="text-[10px] font-bold text-slate-900">{course.progreso || 0}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      course.progreso === 100 ? "bg-emerald-500" : "bg-primary"
                    )}
                    style={{ width: `${course.progreso || 0}%` }}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="px-6 py-6 pt-2">
              <Button 
                className={cn(
                  "w-full rounded-xl h-12 font-bold shadow-xl transition-all duration-200 gap-2 flex items-center justify-center",
                  course.status === "Completado" 
                    ? "bg-slate-100 text-slate-900 hover:bg-slate-200" 
                    : "bg-primary text-white hover:bg-primary/90"
                )}
                onClick={() => router.push(`/clase/${course.idCurso}`)}
              >
                {course.status === "Completado" ? (
                  <>Ver Certificado <Award className="h-4 w-4" /></>
                ) : (
                  <>Continuar Clase <PlayCircle className="h-4 w-4" /></>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
