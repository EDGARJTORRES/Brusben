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

const courses = [
  {
    id: "CUR-001",
    title: "Diplomado en Marketing Digital",
    category: "Marketing",
    progress: 75,
    lessons: "8/12 Lecc.",
    duration: "120 horas",
    status: "En Progreso",
    image: "https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=400&h=250&auto=format&fit=crop",
  },
  {
    id: "CUR-002",
    title: "Gestión de Proyectos con PMP",
    category: "Gestión",
    progress: 40,
    lessons: "4/10 Lecc.",
    duration: "80 horas",
    status: "En Progreso",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=400&h=250&auto=format&fit=crop",
  },
  {
    id: "CUR-006",
    title: "Introducción a la Inteligencia Artificial",
    category: "Tecnología",
    progress: 100,
    lessons: "15/15 Lecc.",
    duration: "60 horas",
    status: "Completado",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=400&h=250&auto=format&fit=crop",
  },
  {
    id: "CUR-004",
    title: "Liderazgo y Habilidades Blandas",
    category: "Habilidades",
    progress: 0,
    lessons: "0/8 Lecc.",
    duration: "30 horas",
    status: "Sin Iniciar",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=400&h=250&auto=format&fit=crop",
  },
]

export default function StudentCoursesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Mis Cursos</h1>
          <p className="text-muted-foreground font-medium">Continúa tu aprendizaje y desarrolla nuevas habilidades estratégicas.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 h-11 px-6 rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200 font-bold">
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
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden border-0 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group rounded-3xl bg-card ring-1 ring-slate-100">
            <div className="relative h-56 overflow-hidden">
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute top-4 left-4">
                <Badge 
                  className={`rounded-full px-4 py-1.5 border-0 font-bold tracking-tight text-[10px] shadow-lg flex items-center gap-1.5 ${
                    course.status === "En Progreso" 
                      ? "bg-blue-500 text-white" 
                      : course.status === "Completado"
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-500 text-white"
                  }`}
                >
                  {course.status === "Completado" && <CheckCircle2 className="h-3 w-3" />}
                  {course.status.toUpperCase()}
                </Badge>
              </div>

              <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg">
                    <MonitorPlay className="h-3 w-3" />
                    Video
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg">
                    <FileText className="h-3 w-3" />
                    Guía
                  </div>
                </div>
              </div>
            </div>

            <CardHeader className="p-6 pb-2">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="rounded-lg text-[10px] font-bold bg-violet-50 text-violet-600 ring-1 ring-violet-100 border-0 h-6 px-2">
                  {course.category.toUpperCase()}
                </Badge>
              </div>
              <CardTitle className="text-1xl font-extrabold tracking-tight text-foreground">
                {course.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="px-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-600 truncate">{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                   <MonitorPlay className="h-4 w-4 text-slate-400" />
                   <span className="text-xs font-bold text-slate-600">{course.lessons}</span>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PROGRESO DEL CURSO</span>
                  <span className="text-[10px] font-bold text-slate-900">{course.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      course.progress === 100 ? "bg-emerald-500" : "bg-primary"
                    )}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="px-6 py-6 pt-2">
              <Button className={cn(
                "w-full rounded-xl h-12 font-bold shadow-xl transition-all duration-200 gap-2 flex items-center justify-center",
                course.status === "Completado" 
                  ? "bg-slate-100 text-slate-900 hover:bg-slate-200" 
                  : "bg-primary text-white hover:bg-primary/90"
              )}>
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
