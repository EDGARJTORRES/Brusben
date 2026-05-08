"use client"

import { useState } from "react"
import {
  Image as ImageIcon,
  TrendingUp,
  Eye,
  Download,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Share2,
  Calendar,
  BarChart3,
  Users,
  Heart,
  MessageCircle,
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

const infographicsData = [
  {
    id: "INF-001",
    title: "Marketing Digital: Tendencias 2024",
    category: "Marketing",
    views: 1245,
    downloads: 89,
    likes: 156,
    comments: 23,
    status: "published",
    date: "2024-01-15",
    author: "Carlos Mendoza",
    size: "2.4 MB",
    format: "PNG",
  },
  {
    id: "INF-002",
    title: "Guía de Gestión de Proyectos",
    category: "Gestión",
    views: 892,
    downloads: 67,
    likes: 98,
    comments: 12,
    status: "published",
    date: "2024-01-14",
    author: "Ana Rodríguez",
    size: "1.8 MB",
    format: "JPG",
  },
  {
    id: "INF-003",
    title: "Excel: Fórmulas Avanzadas",
    category: "Finanzas",
    views: 2341,
    downloads: 234,
    likes: 312,
    comments: 45,
    status: "published",
    date: "2024-01-13",
    author: "Juan Pérez",
    size: "3.1 MB",
    format: "PDF",
  },
  {
    id: "INF-004",
    title: "Desarrollo Web: Roadmap 2024",
    category: "Tecnología",
    views: 567,
    downloads: 34,
    likes: 67,
    comments: 8,
    status: "draft",
    date: "2024-01-12",
    author: "María García",
    size: "1.2 MB",
    format: "PNG",
  },
  {
    id: "INF-005",
    title: "Finanzas Personales: Tips",
    category: "Finanzas",
    views: 1890,
    downloads: 156,
    likes: 234,
    comments: 34,
    status: "archived",
    date: "2024-01-10",
    author: "Pedro López",
    size: "2.7 MB",
    format: "JPG",
  },
]

const statsCards = [
  {
    title: "Total Infografías",
    value: "5",
    badge: "Creadas",
    icon: ImageIcon,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-100/50",
    trend: "+2 este mes",
  },
  {
    title: "Vistas Totales",
    value: "6,935",
    badge: "Acumuladas",
    icon: Eye,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    iconBg: "bg-emerald-100/50",
    trend: "+1,234 esta semana",
  },
  {
    title: "Descargas",
    value: "580",
    badge: "Total",
    icon: Download,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    iconBg: "bg-purple-100/50",
    trend: "+89 esta semana",
  },
  {
    title: "Interacciones",
    value: "867",
    badge: "Likes + Comentarios",
    icon: Heart,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    iconBg: "bg-rose-100/50",
    trend: "+156 esta semana",
  },
]

export default function InfografiaPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("todos")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Publicado</Badge>
      case "draft":
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Borrador</Badge>
      case "archived":
        return <Badge className="bg-slate-100 text-slate-700 border-slate-200">Archivado</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  const filteredInfographics = infographicsData.filter(infographic => {
    const matchesSearch = infographic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         infographic.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         infographic.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         infographic.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || infographic.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getTabInfographics = (tab: string) => {
    switch (tab) {
      case "publicadas":
        return filteredInfographics.filter(infographic => infographic.status === "published")
      case "borradores":
        return filteredInfographics.filter(infographic => infographic.status === "draft")
      case "archivadas":
        return filteredInfographics.filter(infographic => infographic.status === "archived")
      default:
        return filteredInfographics
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
            <ImageIcon className="h-8 w-8 text-primary" />
            Gestión de Infografías
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Administra y monitorea todas las infografías educativas de la plataforma
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Ver Estadísticas
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Infografía
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
                Biblioteca de Infografías
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Todas las infografías disponibles en la plataforma
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar infografías..."
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
                  <DropdownMenuItem onClick={() => setFilterStatus("published")}>
                    Publicadas
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("draft")}>
                    Borradores
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("archived")}>
                    Archivadas
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
                  Todas
                </TabsTrigger>
                <TabsTrigger value="publicadas" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Publicadas
                </TabsTrigger>
                <TabsTrigger value="borradores" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Borradores
                </TabsTrigger>
                <TabsTrigger value="archivadas" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Archivadas
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-100">
                    <TableHead className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Infografía
                    </TableHead>
                    <TableHead className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Categoría
                    </TableHead>
                    <TableHead className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Autor
                    </TableHead>
                    <TableHead className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Estadísticas
                    </TableHead>
                    <TableHead className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Formato
                    </TableHead>
                    <TableHead className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Fecha
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
                  {getTabInfographics(activeTab).map((infographic) => (
                    <TableRow key={infographic.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <TableCell className="px-8 py-4">
                        <div className="space-y-1">
                          <div className="font-bold text-slate-800">{infographic.title}</div>
                          <div className="text-xs text-slate-500 font-mono">{infographic.id}</div>
                          <div className="text-xs text-slate-400">{infographic.size}</div>
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-4">
                        <Badge variant="outline" className="bg-slate-50 border-slate-200">
                          {infographic.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-8 py-4">
                        <div className="font-medium text-slate-700">{infographic.author}</div>
                      </TableCell>
                      <TableCell className="px-8 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3 text-slate-400" />
                              <span className="font-medium">{infographic.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Download className="h-3 w-3 text-slate-400" />
                              <span className="font-medium">{infographic.downloads}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3 text-rose-400" />
                              <span className="font-medium">{infographic.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3 text-slate-400" />
                              <span className="font-medium">{infographic.comments}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-4">
                        <Badge variant="secondary" className="text-xs">
                          {infographic.format}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-8 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="h-4 w-4" />
                          {infographic.date}
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-4">
                        {getStatusBadge(infographic.status)}
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
                              Vista previa
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Edit className="h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Share2 className="h-4 w-4" />
                              Compartir
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2">
                              <Download className="h-4 w-4" />
                              Descargar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <BarChart3 className="h-4 w-4" />
                              Ver estadísticas
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {infographic.status === "draft" && (
                              <DropdownMenuItem className="gap-2 text-emerald-600">
                                <Eye className="h-4 w-4" />
                                Publicar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="gap-2 text-rose-600">
                              <Trash2 className="h-4 w-4" />
                              Eliminar
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