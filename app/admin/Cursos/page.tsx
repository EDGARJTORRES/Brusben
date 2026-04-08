"use client"

import { useState } from "react"
import { 
  Plus, 
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
  Settings2
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

const courses = [
  {
    id: "CUR-001",
    title: "Diplomado en Marketing Digital",
    category: "Marketing",
    students: 156,
    duration: "120 horas",
    price: "S/ 850",
    status: "Activo",
    popularity: 92,
    image: "https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=400&h=250&auto=format&fit=crop",
  },
  {
    id: "CUR-002",
    title: "Gestión de Proyectos con PMP",
    category: "Gestión",
    students: 84,
    duration: "80 horas",
    price: "S/ 1,200",
    status: "Activo",
    popularity: 78,
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=400&h=250&auto=format&fit=crop",
  },
  {
    id: "CUR-004",
    title: "Liderazgo y Habilidades Blandas",
    category: "Habilidades",
    students: 65,
    duration: "30 horas",
    price: "S/ 380",
    status: "Activo",
    popularity: 65,
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=400&h=250&auto=format&fit=crop",
  },
  {
    id: "CUR-006",
    title: "Introducción a la Inteligencia Artificial",
    category: "Tecnología",
    students: 312,
    duration: "60 horas",
    price: "S/ 600",
    status: "Activo",
    popularity: 96,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=400&h=250&auto=format&fit=crop",
  },
]

export default function CoursesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 leading-tight">Gestión de Cursos</h1>
          <p className="text-slate-500 font-medium">Diseña, edita y publica programas académicos de alto impacto.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="gap-2 h-11 px-6 rounded-xl bg-primary transition-all duration-200 font-bold">
            <Plus className="h-4 w-4" />
            Nuevo Programa
          </Button>
        </div>
      </div>

      <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white/70 backdrop-blur-xl p-2 px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between py-4">
          <Tabs defaultValue="all" className="w-full md:w-auto">
            <TabsList className="bg-slate-100/50 p-1 rounded-xl h-12">
              <TabsTrigger value="all" className="rounded-lg font-bold text-xs h-10 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all tracking-wide">TODOS</TabsTrigger>
              <TabsTrigger value="active" className="rounded-lg font-bold text-xs h-10 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all tracking-wide">ACTIVOS</TabsTrigger>
              <TabsTrigger value="draft" className="rounded-lg font-bold text-xs h-10 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all tracking-wide">BORRADORES</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-4">
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input placeholder="Buscar por nombre o categoría..." className="pl-12 h-12 w-full bg-slate-100/50 border-0 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/10 transition-all rounded-xl text-sm" />
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
          <Card key={course.id} className="p-0 border-0 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group rounded-3xl bg-white ring-1 ring-slate-100">
            <div className="relative h-40 overflow-hidden rounded-t-3xl">
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute top-2 left-4">
                <Badge 
                  className={`rounded-full px-4 py-1.5 border-0 font-bold tracking-tight text-[10px] shadow-lg flex items-center gap-1.5 ${
                    course.status === "Activo" 
                      ? "bg-emerald-500 text-white" 
                      : course.status === "Borrador"
                      ? "bg-amber-500 text-white"
                      : "bg-slate-500 text-white"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
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
                    PDF
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-slate-900 shadow-xl transition-all border border-white/20">
                      <Settings2 className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="p-2 rounded-xl border-slate-100 shadow-2xl w-48">
                    <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pb-2">Configuración</DropdownMenuLabel>
                    <DropdownMenuItem className="h-10 rounded-lg cursor-pointer font-medium hover:bg-slate-50 px-3">Editar Contenido</DropdownMenuItem>
                    <DropdownMenuItem className="h-10 rounded-lg cursor-pointer font-medium hover:bg-slate-50 px-3">Estadísticas Detalle</DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2 bg-slate-50" />
                    <DropdownMenuItem className="h-10 rounded-lg cursor-pointer font-bold text-rose-600 focus:bg-rose-50 focus:text-rose-600 px-3">Retirar del Catálogo</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <CardHeader className="py-4 px-6 pb-2">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="rounded-lg text-[10px] font-bold border-slate-100 text-slate-400 tracking-wider h-6 px-2">
                  ID: {course.id}
                </Badge>
                <Badge className="rounded-lg text-[10px] font-bold bg-violet-50 text-violet-600 ring-1 ring-violet-100 border-0 h-6 px-2">
                  {course.category.toUpperCase()}
                </Badge>
              </div>
              <CardTitle className="text-lg font-bold leading-snug text-slate-900 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                {course.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="px-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-xs font-bold text-slate-700">{course.students}</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">ALUMNOS</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-xs font-bold text-slate-700">{course.duration}</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">ESTIMADO</span>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    POPULARIDAD <HelpCircle className="h-2.5 w-2.5" />
                  </span>
                  <span className="text-[10px] font-bold text-slate-900">{course.popularity}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-1000"
                    style={{ width: `${course.popularity}%` }}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="px-6 py-6 pt-2 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Precio Final</span>
                <div className="flex items-center font-black text-2xl text-slate-900">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                  <span>{course.price.replace("S/ ", "")}</span>
                </div>
              </div>
              <Button className="rounded-xl h-12 px-6 font-bold bg-slate-900 shadow-xl hover:bg-slate-800 hover:translate-x-1 group/btn transition-all duration-200">
                Gestionar <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
