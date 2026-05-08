"use client"

import { useState } from "react"
import {
  BookOpen,
  Users,
  Clock,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  PlayCircle,
  FileText,
  Award,
  Calendar,
  BarChart3,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const coursesData = [
  {
    id: "CUR-001",
    title: "Diplomado en Marketing Digital",
    instructor: "Dr. Carlos Mendoza",
    students: 45,
    duration: "12 semanas",
    progress: 75,
    status: "active",
    revenue: "S/. 20,250",
    rating: 4.8,
    nextClass: "2024-01-20",
    category: "Marketing",
  },
  {
    id: "CUR-002",
    title: "Gestión de Proyectos con PMP",
    instructor: "Mg. Ana Rodríguez",
    students: 32,
    duration: "10 semanas",
    progress: 40,
    status: "active",
    revenue: "S/. 12,160",
    rating: 4.6,
    nextClass: "2024-01-18",
    category: "Gestión",
  },
  {
    id: "CUR-003",
    title: "Excel Avanzado para Finanzas",
    instructor: "Lic. Juan Pérez",
    students: 28,
    duration: "8 semanas",
    progress: 90,
    status: "completed",
    revenue: "S/. 7,840",
    rating: 4.9,
    nextClass: "Finalizado",
    category: "Finanzas",
  },
  {
    id: "CUR-004",
    title: "Desarrollo Web Full Stack",
    instructor: "Ing. María García",
    students: 38,
    duration: "16 semanas",
    progress: 15,
    status: "draft",
    revenue: "S/. 0",
    rating: 0,
    nextClass: "Por definir",
    category: "Tecnología",
  },
]

const statsCards = [
  {
    title: "Total Cursos",
    value: "4",
    badge: "Activos",
    icon: BookOpen,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-100/50",
    trend: "+2 este mes",
  },
  {
    title: "Estudiantes Totales",
    value: "143",
    badge: "Inscritos",
    icon: Users,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    iconBg: "bg-emerald-100/50",
    trend: "+15 este mes",
  },
  {
    title: "Ingresos Generados",
    value: "S/. 40,250",
    badge: "Total",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    iconBg: "bg-purple-100/50",
    trend: "+18.5%",
  },
  {
    title: "Promedio Rating",
    value: "4.8",
    badge: "Excelente",
    icon: Award,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    iconBg: "bg-amber-100/50",
    trend: "+0.2",
  },
]

export default function CursosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("todos")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Activo</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Completado</Badge>
      case "draft":
        return <Badge className="bg-slate-100 text-slate-700 border-slate-200">Borrador</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || course.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getTabCourses = (tab: string) => {
    switch (tab) {
      case "activos":
        return filteredCourses.filter(course => course.status === "active")
      case "completados":
        return filteredCourses.filter(course => course.status === "completed")
      case "borradores":
        return filteredCourses.filter(course => course.status === "draft")
      default:
        return filteredCourses
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            Gestión de Cursos
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Administra y monitorea todos los cursos disponibles en la plataforma
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Ver Estadísticas
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Curso
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="border border-border shadow-sm rounded-2xl overflow-hidden relative group">
            <CardContent className="py-4 px-6">
              <div className="flex items-start justify-between">
                <div className={`${stat.iconBg} ${stat.color} p-2 rounded-2xl mb-3`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-tight">
                  {stat.badge}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
                <p className="text-xl font-black text-slate-800">{stat.value}</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-emerald-600" />
                  <span className="text-[10px] font-bold text-emerald-600">{stat.trend}</span>
                </div>
              </div>
              <div className={`absolute top-0 right-0 h-24 w-24 ${stat.bgColor} rounded-full -mr-12 -mt-12 opacity-50 z-0`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Card className="border-0 shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="px-8 py-6 border-b border-slate-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-extrabold tracking-tight text-foreground">
                Lista de Cursos
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Todos los cursos disponibles en la plataforma
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 w-64 bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary/20"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filtrar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                    Todos los estados
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                    Activos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("completed")}>
                    Completados
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("draft")}>
                    Borradores
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-8 pt-6">
              <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1 rounded-xl">
                <TabsTrigger value="todos" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Todos
                </TabsTrigger>
                <TabsTrigger value="activos" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Activos
                </TabsTrigger>
                <TabsTrigger value="completados" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Completados
                </TabsTrigger>
                <TabsTrigger value="borradores" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Borradores
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-100">
                    <TableHead className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Curso
                    </TableHead>
                    <TableHead className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Instructor
                    </TableHead>
                    <TableHead className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Estudiantes
                    </TableHead>
                    <TableHead className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Duración
                    </TableHead>
                    <TableHead className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Progreso
                    </TableHead>
                    <TableHead className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Ingresos
                    </TableHead>
                    <TableHead className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Rating
                    </TableHead>
                    <TableHead className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Estado
                    </TableHead>
                    <TableHead className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-right">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getTabCourses(activeTab).map((course) => (
                    <TableRow key={course.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <TableCell className="px-8 py-4">
                        <div className="space-y-1">
                          <div className="font-bold text-slate-800">{course.title}</div>
                          <div className="text-xs text-slate-500 font-mono">{course.id}</div>
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-4">
                        <div className="font-medium text-slate-700">{course.instructor}</div>
                      </TableCell>
                      <TableCell className="px-8 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-slate-400" />
                          <span className="font-medium text-slate-700">{course.students}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">{course.duration}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700">{course.progress}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full transition-all duration-500"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-4">
                        <div className="font-black text-slate-900">{course.revenue}</div>
                      </TableCell>
                      <TableCell className="px-8 py-4">
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-amber-400" />
                          <span className="font-medium text-slate-700">{course.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-4">
                        {getStatusBadge(course.status)}
                      </TableCell>
                      <TableCell className="px-8 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem className="gap-2">
                              <Eye className="h-4 w-4" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Edit className="h-4 w-4" />
                              Editar curso
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Users className="h-4 w-4" />
                              Ver estudiantes
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2">
                              <PlayCircle className="h-4 w-4" />
                              Gestionar clases
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <FileText className="h-4 w-4" />
                              Ver reporte
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 text-rose-600">
                              <Trash2 className="h-4 w-4" />
                              Eliminar curso
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}