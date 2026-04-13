"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { 
  Plus, Search, MoreVertical, BookOpen, LayoutGrid,
  Edit, Trash, ChevronLeft, ChevronRight, FileText,
  GripVertical, Paperclip, MessageSquare, PlusCircle, Trash2,
  Video, Link as LinkIcon, File, ArrowLeft
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

interface Curso {
  idCurso?: number
  titulo: string
  imgCurso: string
  descripcion: string
  estCurso: any // Puede venir como string "A"/"I" o booleano
  idDocente: number
  docenteNombre: string
  catId?: number
  catNombre: string
  catColor: string
  precioCurso: number
  precio?: number // Opcional por compatibilidad
}

export default function CoursesPage() {

  const [courses, setCourses] = useState<Curso[]>([])
  const [docentes, setDocentes] = useState<any[]>([])
  const [categorias, setCategorias] = useState<any[]>([])
  
  const [search, setSearch] = useState("")
  const [categoriaFilter, setCategoriaFilter] = useState("all")
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("listado")

  const [formData, setFormData] = useState<Curso>({
    titulo: "",
    descripcion: "",
    idDocente: 0,
    docenteNombre: "",
    catNombre: "",
    imgCurso: "",
    catColor: "",
    precioCurso: 0,
    estCurso: true,
    catId: 0
  })

  // --- CONTENT MANAGEMENT STATES ---
  const [selectedCourseContent, setSelectedCourseContent] = useState<Curso | null>(null)
  const [contentModules, setContentModules] = useState<any[]>([])
  const [contentForos, setContentForos] = useState<any[]>([])
  const [isLoadingContent, setIsLoadingContent] = useState(false)
  const [newModuleName, setNewModuleName] = useState("")
  const [newForo, setNewForo] = useState({ titulo: "", temaDiscusion: "", descripcion: "" })
  const [isEditingForo, setIsEditingForo] = useState(false)
  const [currentForoId, setCurrentForoId] = useState<number | null>(null)
  const [contentTab, setContentTab] = useState("curricula")

  // --- APORTES STATE ---
  const [aportes, setAportes] = useState<any[]>([])
  const [isAportesOpen, setIsAportesOpen] = useState(false)
  const [activeForoId, setActiveForoId] = useState<number | null>(null)
  const [newAporte, setNewAporte] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  useEffect(() => {
    fetchCourses()
    fetchDocentes()
    fetchCategorias()
  }, [])

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [search, categoriaFilter])

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/cursos")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setCourses(data)
    } catch {
      toast.error("Error al cargar cursos")
    }
  }

  const fetchDocentes = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/cursos/docentes")
      const data = await res.json()
      setDocentes(data)
    } catch (e) {
      console.error("Error fetching docentes", e)
    }
  }

  const fetchCategorias = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/categorias")
      const data = await res.json()
      setCategorias(data)
    } catch (e) {
      console.error("Error fetching categorias", e)
    }
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formDataUpload = new FormData()
    formDataUpload.append("file", file)

    try {
      const res = await fetch("http://localhost:8081/api/cursos/upload", {
        method: "POST",
        body: formDataUpload
      })
      const data = await res.json()
      if (data.path) {
        setFormData(prev => ({ ...prev, imgCurso: data.path }))
        toast.success("Imagen subida correctamente")
      }
    } catch (error) {
      toast.error("Error al subir imagen")
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const body = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      imgCurso: formData.imgCurso,
      precioCurso: Number(formData.precioCurso),
      catId: Number(formData.catId),
      idDocente: Number(formData.idDocente),
      estCurso: formData.estCurso === true || formData.estCurso === "A" ? "A" : "I"
    }

    try {
      const url = isEditing 
        ? `http://localhost:8081/api/cursos/${formData.idCurso}`
        : "http://localhost:8081/api/cursos"
      
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })

      if (res.ok) {
        toast.success(isEditing ? "Curso actualizado 🔥" : "Curso registrado 🔥")
        resetForm()
        fetchCourses()
        setActiveTab("listado")
      } else {
        const error = await res.json()
        toast.error(error.error || "Error al guardar")
      }
    } catch {
      toast.error("Error al conectar con el servidor")
    }
  }

  const resetForm = () => {
    setFormData({
      titulo: "",
      descripcion: "",
      idDocente: 0,
      docenteNombre: "",
      catNombre: "",
      imgCurso: "",
      catColor: "",
      precioCurso: 0,
      estCurso: true,
      catId: 0
    })
    setIsEditing(false)
  }

  const openEditDialog = (course: Curso) => {
    setFormData({
      ...course,
      catId: course.catId || categorias.find(c => c.catNombre === course.catNombre)?.catId,
      estCurso: course.estCurso === "A" || course.estCurso === true
    })
    setIsEditing(true)
    setActiveTab("nuevo")
  }

  const toggleStatus = async (course: any) => {
    try {
      const res = await fetch(`http://localhost:8081/api/cursos/${course.idCurso}/toggle-estado`, {
        method: "PUT"
      })
      if (res.ok) {
        toast.success("Estado actualizado")
        fetchCourses()
      }
    } catch {
      toast.error("Error al cambiar estado")
    }
  }

  const deleteCurso = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8081/api/cursos/${id}`, {
        method: "DELETE"
      })
      if (res.ok) {
        toast.success("Curso eliminado")
        fetchCourses()
      }
    } catch {
      toast.error("Error al eliminar")
    }
  }

  const filteredCourses = (courses || []).filter(c =>
    (c.titulo || "").toLowerCase().includes(search.toLowerCase()) &&
    (categoriaFilter === "all" || c.catNombre === categoriaFilter)
  )

  const getImageUrl = (img?: string) => {
    if (!img || img === "") return "/images/course-finance.jpg"
    if (img.startsWith("http") || img.startsWith("data:")) return img
    let cleanPath = img.replace(/^public\//, "").replace(/^\/public\//, "")
    const fileName = cleanPath.replace(/^\//, "").replace(/^cursos\//, "")
    return `/cursos/${fileName}`
  }

  // Paginación
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage)
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // --- CONTENT FETCHING ---
  const [viewMode, setViewMode] = useState<"list" | "content">("list")

  const openContentManager = async (course: Curso) => {
    setSelectedCourseContent(course)
    setViewMode("content")
    setContentTab("curricula") // Forzar pestaña por defecto
    setIsLoadingContent(true)
    try {
      const [modRes, foroRes] = await Promise.all([
        fetch(`http://localhost:8081/api/cursos-contenido/${course.idCurso}/modulos`),
        fetch(`http://localhost:8081/api/cursos-contenido/${course.idCurso}/foros`)
      ])
      setContentModules(await modRes.json())
      setContentForos(await foroRes.json())
    } catch {
      toast.error("Error al cargar contenido")
    } finally {
      setIsLoadingContent(false)
    }
  }

  const addModule = async () => {
    if (!newModuleName.trim()) return
    try {
      const res = await fetch(`http://localhost:8081/api/cursos-contenido/${selectedCourseContent?.idCurso}/modulos`, {
        method: "POST",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({ nombre: newModuleName })
      })
      if (res.ok) {
        setNewModuleName("")
        openContentManager(selectedCourseContent!)
        toast.success("Módulo añadido")
      }
    } catch {
      toast.error("Error al añadir módulo")
    }
  }

  const deleteModulo = async (id: number) => {
     try {
       await fetch(`http://localhost:8081/api/cursos-contenido/modulos/${id}`, { method: "DELETE" })
       openContentManager(selectedCourseContent!)
       toast.success("Módulo eliminado")
     } catch { toast.error("Error al eliminar") }
  }

  const addMaterial = async (idModulo: number) => {
    const titulo = prompt("Título del material:")
    if (!titulo) return
    const url = prompt("URL del material (o nombre de archivo):")
    if (!url) return
    const tipo = prompt("Tipo (VIDEO, PDF, LINK):", "VIDEO") || "VIDEO"

    try {
      const res = await fetch(`http://localhost:8081/api/cursos-contenido/modulos/${idModulo}/materiales`, {
        method: "POST",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({ titulo, urlMaterial: url, tipoMaterial: tipo })
      })
      if (res.ok) {
        openContentManager(selectedCourseContent!)
        toast.success("Material añadido")
      }
    } catch { toast.error("Error al añadir") }
  }

  const deleteMaterial = async (id: number) => {
    try {
      await fetch(`http://localhost:8081/api/cursos-contenido/materiales/${id}`, { method: "DELETE" })
      openContentManager(selectedCourseContent!)
      toast.success("Material eliminado")
    } catch { toast.error("Error al eliminar") }
  }

  const addForo = async () => {
    if (!newForo.titulo.trim() || !newForo.temaDiscusion.trim()) {
       toast.warning("Título y Tema son obligatorios")
       return
    }
    try {
      const url = isEditingForo 
        ? `http://localhost:8081/api/cursos-contenido/foros/${currentForoId}`
        : `http://localhost:8081/api/cursos-contenido/${selectedCourseContent?.idCurso}/foros`
      
      const res = await fetch(url, {
        method: isEditingForo ? "PUT" : "POST",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify(newForo)
      })
      if (res.ok) {
        setNewForo({ titulo: "", temaDiscusion: "", descripcion: "" })
        setIsEditingForo(false)
        setCurrentForoId(null)
        openContentManager(selectedCourseContent!)
        toast.success(isEditingForo ? "Foro actualizado" : "Foro creado")
      }
    } catch { toast.error("Error en la operación") }
  }

  const startEditForo = (foro: any) => {
    setNewForo({
      titulo: foro.titulo,
      temaDiscusion: foro.temaDiscusion,
      descripcion: foro.descripcion
    })
    setIsEditingForo(true)
    setCurrentForoId(foro.idForo)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteForo = async (id: number) => {
    try {
      await fetch(`http://localhost:8081/api/cursos-contenido/foros/${id}`, { method: "DELETE" })
      openContentManager(selectedCourseContent!)
      toast.success("Foro desactivado")
    } catch { toast.error("Error al eliminar") }
  }

  const openAportes = async (foro: any) => {
    setActiveForoId(foro.idForo)
    setIsAportesOpen(true)
    fetchAportes(foro.idForo)
  }

  const fetchAportes = async (idForo: number) => {
    try {
      const res = await fetch(`http://localhost:8081/api/cursos-contenido/foros/${idForo}/aportes`)
      if (res.ok) {
         setAportes(await res.json())
      } else {
         setAportes([])
      }
    } catch {
      setAportes([])
    }
  }

  const handleAddAporte = async () => {
    if(!newAporte.trim() || !activeForoId) return
    try {
      // Usaremos idUsuario 1 por defecto al simular que somos el admin
      const res = await fetch(`http://localhost:8081/api/cursos-contenido/foros/${activeForoId}/aportes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: newAporte, usuario: { idUsuario: 1 } })
      })
      if(res.ok) {
        setNewAporte("")
        fetchAportes(activeForoId)
        toast.success("Aporte publicado")
      } else {
        toast.error("Error al publicar")
      }
    } catch {
      toast.error("Error de conexión")
    }
  }
  
  const handleDeleteAporte = async (idAporte: number) => {
     try {
        const res = await fetch(`http://localhost:8081/api/cursos-contenido/aportes/${idAporte}`, { method: "DELETE" })
        if(res.ok && activeForoId) {
           fetchAportes(activeForoId)
           toast.success("Aporte eliminado")
        }
     } catch {
        toast.error("Error al eliminar")
     }
  }

  if (viewMode === "content" && selectedCourseContent) {
    return (
      <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
        
        {/* HEADER DE GESTIÓN */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 px-4 py-3 rounded-2xl  text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
           <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full -ml-24 -mb-24 blur-2xl opacity-30" />
           
           <div className="relative z-10 flex items-center gap-6">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-14 w-14 rounded-2xl bg-white/10 hover:bg-white hover:text-slate-900 transition-all border border-white/10"
                onClick={() => { setViewMode("list"); setSelectedCourseContent(null); }}
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <div>
                <div className="flex items-center gap-3 mb-1">
                   <Badge className="bg-primary text-white border-0 font-bold uppercase tracking-widest text-[10px] px-3">Gestión de Contenido</Badge>
                   <span className="text-slate-400 text-xs font-bold ring-1 ring-slate-700 px-2 py-0.5 rounded-full">ID: {selectedCourseContent.idCurso}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight">{selectedCourseContent.titulo}</h2>
              </div>
           </div>

           <div className="relative z-10 hidden lg:flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                 <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="pr-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-primary">Docente</p>
                 <p className="font-bold text-sm">{selectedCourseContent.docenteNombre}</p>
              </div>
           </div>
        </div>

        <Tabs value={contentTab} onValueChange={setContentTab} className="w-full">
           <div className="flex items-center justify-between mb-8">
              <TabsList className="bg-card/50 p-1.5 rounded-2xl h-14 border border-border shadow-inner">
                <TabsTrigger value="curricula" className="px-8 font-black data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all">
                  Plan de Estudios
                </TabsTrigger>
                <TabsTrigger value="foros" className="px-8 font-black data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all">
                  Foros Académicos
                </TabsTrigger>
              </TabsList>
           </div>

           <TabsContent value="curricula" className="space-y-10 mt-0 animate-in slide-in-from-bottom-4 duration-500">
              
              <div className="grid lg:grid-cols-12 gap-10">
                 
                 {/* Lado Izquierdo: Lista de Módulos (Scrollable) */}
                 <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between mb-2 pl-2">
                       <h3 className="text-xl font-black text-foreground flex items-center gap-3">
                          <LayoutGrid className="h-5 w-5 text-primary" />
                          Módulos Estructurados
                       </h3>
                       <Badge variant="outline" className="font-bold">{contentModules.length} Secciones</Badge>
                    </div>

                    {isLoadingContent ? (
                      <div className="grid gap-6">
                         {[1,2].map(i => <div key={i} className="h-32 bg-card animate-pulse rounded-[32px] border" />)}
                      </div>
                    ) : (
                      <div className="grid gap-6">
                        {contentModules.map((modulo: any) => (
                           <Card key={modulo.idModulo} className="border-border/40 shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden group hover:ring-2 ring-primary/20 transition-all">
                              <div className="bg-card p-6 flex items-center justify-between border-b border-border/40">
                                 <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center cursor-grab active:cursor-grabbing text-muted-foreground group-hover:text-primary transition-colors">
                                       <GripVertical className="h-5 w-5" />
                                    </div>
                                    <h4 className="text-lg font-black text-foreground">{modulo.nombre}</h4>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" className="rounded-xl border-primary/20 hover:bg-primary/5 text-primary h-10 px-4 font-bold gap-2" onClick={() => addMaterial(modulo.idModulo)}>
                                       <PlusCircle className="h-4 w-4" /> Clase
                                    </Button>

                                    <AlertDialog>
                                       <AlertDialogTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-10 w-10 text-rose-500 hover:bg-rose-50 rounded-xl">
                                             <Trash2 className="h-4 w-4" />
                                          </Button>
                                       </AlertDialogTrigger>
                                       <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                                          <AlertDialogHeader>
                                             <AlertDialogTitle className="text-2xl font-black">Eliminar Módulo</AlertDialogTitle>
                                             <AlertDialogDescription className="text-slate-500 font-medium">
                                                ¿Seguro que deseas eliminar <b>"{modulo.nombre}"</b>? Se borrarán todos los materiales contenidos en él.
                                             </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                             <AlertDialogCancel className="rounded-2xl font-bold">Cancelar</AlertDialogCancel>
                                             <AlertDialogAction onClick={() => deleteModulo(modulo.idModulo)} className="rounded-2xl font-black bg-rose-500 hover:bg-rose-600">Eliminar Módulo</AlertDialogAction>
                                          </AlertDialogFooter>
                                       </AlertDialogContent>
                                    </AlertDialog>

                                 </div>
                              </div>
                              <CardContent className="p-6 bg-muted/10">
                                 {modulo.materiales?.length > 0 ? (
                                   <div className="grid gap-3">
                                      {modulo.materiales.map((mat: any) => (
                                        <div key={mat.idMaterial} className="flex items-center justify-between p-4 bg-background rounded-2xl group/mat border border-border/40 hover:shadow-md transition-all">
                                           <div className="flex items-center gap-4">
                                              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${mat.tipoMaterial === 'VIDEO' ? 'bg-blue-500/10 text-blue-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                                                 {mat.tipoMaterial === 'VIDEO' ? <Video className="h-5 w-5" /> : <File className="h-5 w-5" />}
                                              </div>
                                              <div>
                                                 <p className="font-bold text-sm text-foreground">{mat.titulo}</p>
                                                 <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{mat.tipoMaterial}</p>
                                              </div>
                                           </div>
                                           <div className="flex items-center gap-2">
                                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary rounded-lg" onClick={() => window.open(mat.urlMaterial, '_blank')}>
                                                 <LinkIcon className="h-4 w-4" />
                                              </Button>
                                              
                                              <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                   <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-300 hover:text-rose-600 rounded-lg group-hover/mat:opacity-100 transition-opacity">
                                                      <Trash2 className="h-4 w-4" />
                                                   </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="rounded-3xl">
                                                   <AlertDialogHeader>
                                                      <AlertDialogTitle className="font-black">Borrar Recurso</AlertDialogTitle>
                                                      <AlertDialogDescription>¿Deseas quitar <b>{mat.titulo}</b> de este curso?</AlertDialogDescription>
                                                   </AlertDialogHeader>
                                                   <AlertDialogFooter>
                                                      <AlertDialogCancel className="rounded-xl">Mejor no</AlertDialogCancel>
                                                      <AlertDialogAction onClick={() => deleteMaterial(mat.idMaterial)} className="rounded-xl bg-destructive font-bold">Sí, borrar</AlertDialogAction>
                                                   </AlertDialogFooter>
                                                </AlertDialogContent>
                                              </AlertDialog>

                                           </div>
                                        </div>
                                      ))}
                                   </div>
                                 ) : (
                                   <div className="text-center py-6 border-2 border-dashed border-border/50 rounded-2xl bg-background/50">
                                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Aún no hay materiales en este módulo</p>
                                   </div>
                                 )}
                              </CardContent>
                           </Card>
                        ))}

                        {contentModules.length === 0 && (
                          <div className="bg-card rounded-[40px] p-20 text-center border-2 border-dashed border-border shadow-inner">
                             <div className="h-24 w-24 bg-muted rounded-[32px] flex items-center justify-center mx-auto mb-6">
                                <PlusCircle className="h-10 w-10 text-muted-foreground" />
                             </div>
                             <h4 className="text-xl font-bold text-foreground mb-2">Comienza tu currícula</h4>
                             <p className="text-muted-foreground max-w-sm mx-auto">Añade tu primer módulo a la derecha para empezar a organizar el contenido del curso.</p>
                          </div>
                        )}
                      </div>
                    )}
                 </div>

                 {/* Lado Derecho: Acciones y Sidebar */}
                 <div className="lg:col-span-4 space-y-8">
                    <Card className="border-0 shadow-2xl rounded-[32px] overflow-hidden bg-slate-900 text-white p-8 relative">
                       <div className="absolute top-0 right-0 p-6 opacity-10">
                          <PlusCircle className="h-12 w-12" />
                       </div>
                       <h4 className="text-xl font-black mb-6 relative z-10 underline decoration-primary decoration-4 underline-offset-8">Nuevo Módulo</h4>
                       <div className="space-y-4 relative z-10">
                          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Nombre del Módulo</p>
                          <Input 
                            placeholder="Ej: Fundamentos Avanzados" 
                            className="bg-white/10 border-white/10 text-white placeholder:text-slate-500 h-14 rounded-2xl focus:ring-primary"
                            value={newModuleName}
                            onChange={(e) => setNewModuleName(e.target.value)}
                          />
                          <Button className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 group" onClick={addModule}>
                            Añadir Módulo
                            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </Button>
                       </div>
                    </Card>

                    <div className="bg-primary/5 rounded-[32px] p-8 border border-primary/10">
                       <h4 className="font-bold text-primary mb-4 flex items-center gap-2 uppercase tracking-tight text-sm">
                          <BookOpen className="h-4 w-4" /> Tips del Administrador
                       </h4>
                       <ul className="space-y-4">
                          <li className="flex gap-3 text-xs font-medium text-slate-600 leading-relaxed">
                             <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">1</div>
                             Organiza por orden lógico para mejorar la experiencia del estudiante.
                          </li>
                          <li className="flex gap-3 text-xs font-medium text-slate-600 leading-relaxed">
                             <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">2</div>
                             Combina videos y lecturas (PDF) para un aprendizaje interactivo.
                          </li>
                       </ul>
                    </div>
                 </div>

              </div>

           </TabsContent>

           <TabsContent value="foros" className="space-y-8 mt-0 animate-in slide-in-from-right-4 duration-500">
              <div className="grid lg:grid-cols-12 gap-10">
                 
                 <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between pl-2">
                       <h3 className="text-xl font-black text-foreground flex items-center gap-3">
                          <MessageSquare className="h-5 w-5 text-primary" />
                          Hilos de Discusión
                       </h3>
                       <Badge className="bg-emerald-500">{contentForos.length} Activos</Badge>
                    </div>

                    <div className="grid gap-6">
                       {contentForos.map((foro: any) => (
                         <Card key={foro.idForo} className="border-border/40  rounded-[32px] p-8 bg-card  transition-all group border ">
                            <div className="flex justify-between items-start mb-4">
                               <div className="space-y-1">
                                  <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{foro.titulo}</h4>
                                  <div className="flex items-center gap-3">
                                     <Badge variant="outline" className="text-primary border-primary/30 text-[9px] uppercase font-black">{foro.temaDiscusion}</Badge>
                                     <span className="text-[10px] text-muted-foreground font-bold">{new Date(foro.fechaCreacion).toLocaleDateString(undefined, { day:'2-digit', month:'long' })}</span>
                                  </div>
                               </div>
                               <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-primary rounded-xl" onClick={() => startEditForo(foro)}>
                                     <Edit className="h-5 w-5" />
                                  </Button>
                                  
                                  <AlertDialog>
                                     <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-rose-500 rounded-xl">
                                           <Trash2 className="h-5 w-5" />
                                        </Button>
                                     </AlertDialogTrigger>
                                     <AlertDialogContent className="rounded-3xl shadow-2xl border-none">
                                        <AlertDialogHeader>
                                           <AlertDialogTitle className="text-xl font-black">Cerrar Discusión</AlertDialogTitle>
                                           <AlertDialogDescription className="font-medium">
                                              ¿Estás seguro de desactivar el foro <b>"{foro.titulo}"</b>? Ya no será visible para los estudiantes.
                                           </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                           <AlertDialogCancel className="rounded-2xl font-bold">Mantener abierto</AlertDialogCancel>
                                           <AlertDialogAction onClick={() => deleteForo(foro.idForo)} className="rounded-2xl font-black bg-rose-500 hover:bg-rose-600">Desactivar Foro</AlertDialogAction>
                                        </AlertDialogFooter>
                                     </AlertDialogContent>
                                  </AlertDialog>

                               </div>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{foro.descripcion}</p>
                            <div className="flex items-center justify-between pt-6 border-t border-border/40">
                               <div className="flex items-center gap-4">
                                 <div className="flex -space-x-2">
                                    {[1,2,3].map(i => <div key={i} className="h-7 w-7 rounded-full border-2 border-background bg-muted text-[8px] flex items-center justify-center font-bold">U</div>)}
                                 </div>
                                 <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Estudiantes activos</span>
                               </div>
                               <Button variant="outline" size="sm" className="rounded-xl font-bold h-9 bg-card hover:bg-primary/10 hover:text-primary transition-colors text-xs" onClick={() => openAportes(foro)}>
                                  Ver Aportes
                               </Button>
                            </div>
                         </Card>
                       ))}

                       {contentForos.length === 0 && (
                          <div className="text-center py-20 opacity-30 italic">
                             <MessageSquare className="h-20 w-20 mx-auto mb-4 opacity-10" />
                             <p className="font-bold text-sm">Aún no hay discusiones iniciadas en este curso</p>
                          </div>
                       )}
                    </div>
                 </div>

                 <div className="lg:col-span-4">
                    <Card className="bg-card border-border/40  rounded-[40px] p-10 space-y-8 sticky top-24">
                       <div className="space-y-2">
                          <h3 className="text-2xl font-black text-foreground">
                            {isEditingForo ? "Editar Debate" : "Iniciar Debate"}
                          </h3>
                          <p className="text-muted-foreground text-sm font-medium">
                            {isEditingForo ? "Actualiza los detalles de esta discusión académica." : "Crea un espacio para resolver dudas y compartir ideas."}
                          </p>
                       </div>
                       
                       <div className="space-y-5">
                          {isEditingForo && (
                            <Button variant="outline" className="w-full rounded-xl border-dashed h-10 text-xs font-bold" onClick={() => { setIsEditingForo(false); setNewForo({titulo:"", temaDiscusion:"", descripcion:""}); }}>
                              Cancelar Edición
                            </Button>
                          )}
                          <div className="space-y-2">
                             <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-2">Título de la Discusión</label>
                             <Input 
                               placeholder="Ej. Dudas sobre responsive design" 
                               className="h-14 rounded-2xl bg-muted/30 border-0 focus:ring-primary font-bold" 
                               value={newForo.titulo}
                               onChange={(e) => setNewForo({...newForo, titulo: e.target.value})}
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-2">Tema Clave</label>
                             <Input 
                               placeholder="Ej. Mobile First" 
                               className="h-14 rounded-2xl bg-muted/30 border-0 focus:ring-primary font-bold" 
                               value={newForo.temaDiscusion}
                               onChange={(e) => setNewForo({...newForo, temaDiscusion: e.target.value})}
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-2">Contexto Extra</label>
                             <Textarea 
                               placeholder="Escribe aquí los puntos principales a debatir..." 
                               className="rounded-2xl bg-muted/30 border-0 focus:ring-primary min-h-[120px] font-medium" 
                               value={newForo.descripcion}
                               onChange={(e) => setNewForo({...newForo, descripcion: e.target.value})}
                             />
                          </div>
                          <Button className={`w-full h-15 rounded-2xl font-black text-lg shadow-xl ${isEditingForo ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/10' : 'shadow-primary/10'}`} onClick={addForo}>
                             {isEditingForo ? "Actualizar Foro" : "Publicar Foro"}
                          </Button>
                       </div>
                    </Card>
                 </div>

              </div>
           </TabsContent>

        </Tabs>

        {/* Modal de Aportes */}
        <Dialog open={isAportesOpen} onOpenChange={setIsAportesOpen}>
          <DialogContent className="sm:max-w-xl bg-card rounded-[32px] p-6 shadow-2xl border border-border/40">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-foreground">Aportes del Foro</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 my-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
               {aportes.length === 0 ? (
                 <div className="text-center py-10 opacity-50">
                    <MessageSquare className="h-10 w-10 mx-auto mb-2" />
                    <p className="text-sm font-bold">No hay aportes todavía</p>
                 </div>
               ) : (
                 aportes.map((aporte: any) => (
                   <div key={aporte.idAporte} className="flex gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 group/aporte">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                         {aporte.usuario?.nombre ? aporte.usuario.nombre.charAt(0) : "U"}
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-start">
                            <div>
                               <p className="font-bold text-sm text-foreground">{aporte.usuario?.nombre || "Usuario Desconocido"}</p>
                               <p className="text-[10px] font-semibold text-muted-foreground uppercase">{new Date(aporte.fechaAporte).toLocaleDateString()}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-rose-400 opacity-0 group-hover/aporte:opacity-100 transition-opacity rounded-md"
                              onClick={() => handleDeleteAporte(aporte.idAporte)}
                            >
                               <Trash2 className="h-3 w-3" />
                            </Button>
                         </div>
                         <p className="mt-2 text-sm text-foreground/80 leading-relaxed font-medium">
                            {aporte.mensaje}
                         </p>
                      </div>
                   </div>
                 ))
               )}
            </div>
            <div className="flex gap-3 pt-4 border-t border-border/50 mt-2">
               <Input 
                 placeholder="Escribe un aporte como administrador..."
                 className="flex-1 h-12 rounded-2xl bg-muted/40 font-medium"
                 value={newAporte}
                 onChange={(e) => setNewAporte(e.target.value)}
                 onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddAporte()
                 }}
               />
               <Button className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shrink-0" onClick={handleAddAporte}>
                  <PlusCircle className="h-5 w-5" />
               </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary"/>
          Gestión de Cursos
        </h1>
        <p className="text-muted-foreground">
          Diseña, edita y publica cursos académicos
        </p>
      </div>
      
      {/* TOOLBAR SUPERIOR */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

          {/* IZQUIERDA: TABS */}
          <TabsList className="bg-card p-1 rounded-xl h-12 border-1 border-gray-200">
            <TabsTrigger value="listado" className="px-6 font-bold" onClick={resetForm}>
              Listado
            </TabsTrigger>
            <TabsTrigger value="nuevo" className="px-6 font-bold">
              {isEditing ? "Editar Curso" : "Nuevo Curso"}
            </TabsTrigger>
          </TabsList>

          {/* DERECHA: BUSCADOR + SELECT */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

            <div className="relative w-full sm:w-120">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
              <Input
                placeholder="Buscar cursos..."
                className="pl-10 h-12 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="h-12 rounded-xl border px-4 bg-card"
              onChange={(e) => setCategoriaFilter(e.target.value)}
              value={categoriaFilter}
            >
              <option value="all">Todas las categorías</option>
              {categorias
                .filter(cat => cat.catEstado === "A" || cat.catEstado === true)
                .map(cat => (
                  <option key={cat.catId} value={cat.catNombre}>{cat.catNombre}</option>
                ))
              }
            </select>

          </div>

        </div>

        <TabsContent value="listado" className="p-0 border-none outline-none">

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 pb-10">
            {paginatedCourses.map((course: any) => (
              <Card
                key={course.idCurso}
                className="p-0 border-0 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group rounded-3xl bg-card ring-1 ring-slate-100"
              >
                {/* Imagen */}
                <div className="relative h-36 overflow-hidden rounded-t-3xl bg-slate-100">
                  <img
                    src={getImageUrl(course.imgCurso)}
                    alt={course.titulo}
                    className="w-full h-full object-cover"
                  />

                  {/* Estado */}
                  <div className="absolute top-3 left-4">
                    <Badge
                      className={`rounded-full px-4 py-1 text-[10px] font-bold ${
                        course.estCurso === "A" || course.estCurso === true
                          ? "bg-emerald-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {course.estCurso === "A" || course.estCurso === true ? "ACTIVO" : "INACTIVO"}
                    </Badge>
                  </div>

                  <div className="absolute top-3 right-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="h-8 w-8 p-0 rounded-xl bg-black/20 hover:bg-black/40 transition-all shadow-lg"
                        >
                          <MoreVertical className="h-4 w-4 text-white" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="end"
                        className="bg-white/90 backdrop-blur-md border border-border/50 shadow-xl rounded-2xl p-2 min-w-[160px]"
                      >
                        <DropdownMenuItem 
                          onClick={() => openEditDialog(course)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                          Editar
                        </DropdownMenuItem>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem 
                              onSelect={(e) => e.preventDefault()}
                              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition cursor-pointer"
                            >
                              <LayoutGrid className="h-4 w-4" />
                              {(course.estCurso === "A" || course.estCurso === true) ? "Desactivar" : "Reactivar"}
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                             <AlertDialogHeader>
                               <AlertDialogTitle className="text-2xl font-black">
                                 {course.estCurso === "A" || course.estCurso === true ? "Confirmar Desactivación" : "Confirmar Activación"}
                               </AlertDialogTitle>
                               <AlertDialogDescription className="font-medium text-slate-500">
                                 ¿Estás seguro de que deseas {(course.estCurso === "A" || course.estCurso === true) ? "desactivar" : "reactivar"} el curso <b>"{course.titulo}"</b>?
                               </AlertDialogDescription>
                             </AlertDialogHeader>
                             <AlertDialogFooter>
                               <AlertDialogCancel className="rounded-2xl font-bold">Cancelar</AlertDialogCancel>
                               <AlertDialogAction 
                                 onClick={() => toggleStatus(course)} 
                                 className="rounded-2xl font-black bg-primary"
                               >
                                 Continuar
                               </AlertDialogAction>
                             </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem 
                              onSelect={(e) => e.preventDefault()}
                              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                            >
                              <Trash className="h-4 w-4" />
                              Eliminar Curso
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-2xl font-black text-slate-900">¿Estás completamente seguro?</AlertDialogTitle>
                              <AlertDialogDescription className="text-slate-500 font-medium leading-relaxed">
                                Esta acción eliminará permanentemente el curso <b>"{course.titulo}"</b> y todo su contenido asociado (módulos, materiales y foros). Esta acción no se puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-6">
                              <AlertDialogCancel className="rounded-2xl h-12 px-6 font-bold border-2">Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => deleteCurso(course.idCurso)}
                                className="rounded-2xl h-12 px-6 font-black bg-rose-500 hover:bg-rose-600 text-white border-0 shadow-lg shadow-rose-500/20"
                              >
                                Sí, eliminar curso
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Header */}
                <CardHeader className="py-2 px-6 pb-0">
                  <div className="flex gap-2 mb-2">
                    <Badge variant="outline" className="text-[10px]">ID: {course.idCurso}</Badge>
                    <Badge
                      style={{ backgroundColor: course.catColor }}
                      className="text-white text-[10px] border-0"
                    >
                      {course.catNombre || "S/C"}
                    </Badge>
                  </div>

                  <CardTitle className="text-lg font-bold line-clamp-1">
                    {course.titulo || "Sin título"}
                  </CardTitle>

                  <CardDescription className="line-clamp-2 text-sm min-h-[40px]">
                    {course.descripcion || "Sin descripción"}
                  </CardDescription>
                </CardHeader>

                {/* Contenido */}
                <CardContent className="px-6 py-0 mb-0">
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                       <span className="text-[10px] font-bold text-primary">{course.docenteNombre?.substring(0,1) || "U"}</span>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Docente</p>
                      <p className="text-xs font-bold text-slate-700">{course.docenteNombre || "No asignado"}</p>
                    </div>
                  </div>
                </CardContent>

                {/* Footer */}
                <CardFooter className="px-6 pb-6 flex justify-between items-center bg-slate-50/50 rounded-b-3xl mt-2 pt-4">
                  <div>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Precio</p>
                    <div className="text-xl font-black text-slate-900">
                      <span>S/ {Number(course.precioCurso || 0).toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    size="icon"
                    className="bg-primary text-white rounded-2xl h-10 w-30 hover:scale-110 transition-transform "
                    onClick={() => openContentManager(course)}
                  >
                    <Plus className="h-5 w-5" /> Contenido
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination UI */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pb-10">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-xl"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className="h-10 w-10 rounded-xl font-bold"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-xl"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

        </TabsContent>

        <TabsContent value="nuevo" className="p-0 border-none outline-none">

          <div className="mx-auto py-0">
            <div className=" border-none shadow-2xl bg-card overflow-hidden">
              <div className="bg-slate-900 p-5 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-10 h-20 bg-primary/20 rounded-full -mr-10 -mt-10 blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-emerald-500/10 rounded-full -ml-10 -mb-10 blur-2xl opacity-30" />
                
                <div className="relative z-10 flex items-center gap-6">
                  <div className="h-20 w-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl">
                    <BookOpen className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">{isEditing ? "Edición Maestra" : "Nueva Publicación"}</h3>
                    <p className="text-slate-400 font-medium text-lg mt-1">
                      {isEditing ? `Modificando: ${formData.titulo}` : "Crea una experiencia educativa de alto impacto"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-10">
                <form onSubmit={handleSubmit} className="space-y-12">
                  
                  {/* SECCIÓN 1: GENERAL */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-border pb-4">
                      <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">Información General</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-sm font-black text-muted-foreground uppercase tracking-widest ml-1">Nombre del Curso</label>
                        <div className="relative group">
                           <Input 
                            name="titulo" 
                            placeholder="Ej. Arquitectura Frontend Pro" 
                            className="h-14 rounded-2xl bg-muted/40 border-0 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-semibold px-4"
                            value={formData.titulo}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-black text-muted-foreground uppercase tracking-widest ml-1">Costo (S/.)</label>
                        <div className="relative group">
                          <Input 
                            name="precioCurso" 
                            type="number" 
                            step="0.01" 
                            placeholder="0.00" 
                            className="h-14 rounded-2xl bg-muted/40 border-0 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-bold px-4 text-lg"
                            value={formData.precioCurso}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-black text-muted-foreground uppercase tracking-widest ml-1">Descripción del Programa</label>
                      <textarea 
                        name="descripcion" 
                        placeholder="Define los objetivos, temario y beneficios..." 
                        className="w-full h-32 p-5 rounded-2xl bg-muted/40 border-0 focus:ring-2 ring-primary/20 outline-none resize-none transition-all focus:bg-background font-medium leading-relaxed shadow-inner text-foreground"
                        value={formData.descripcion}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* SECCIÓN 2: ACADÉMICO */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-border pb-4">
                      <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <LayoutGrid className="h-4 w-4 text-amber-500" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">Categorización y Docencia</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-sm font-black text-muted-foreground uppercase tracking-widest ml-1">Categoría Académica</label>
                        <select
                          name="catId"
                          className="w-full h-14 rounded-2xl bg-muted/40 border-0 px-6 focus:ring-2 ring-primary/20 outline-none font-bold text-muted-foreground appearance-none cursor-pointer hover:bg-muted/60 transition-colors"
                          value={formData.catId || ""}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Seleccionar Categoría</option>
                          {categorias
                            .filter(cat => cat.catEstado === "A" || cat.catEstado === true)
                            .map(cat => (
                              <option key={cat.catId} value={cat.catId}>{cat.catNombre}</option>
                            ))
                          }
                        </select>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-black text-muted-foreground uppercase tracking-widest ml-1">Especialista / Docente</label>
                        <select
                          name="idDocente"
                          className="w-full h-14 rounded-2xl bg-muted/40 border-0 px-6 focus:ring-2 ring-primary/20 outline-none font-bold text-muted-foreground appearance-none cursor-pointer hover:bg-muted/60 transition-colors"
                          value={formData.idDocente || ""}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Asignar Docente</option>
                          {docentes
                            .filter(doc => doc.activo === true)
                            .map(doc => (
                              <option key={doc.idUsuario} value={doc.idUsuario}>{doc.nombres}</option>
                            ))
                          }
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* SECCIÓN 3: MULTIMEDIA */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-border pb-4">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <LayoutGrid className="h-4 w-4 text-emerald-500" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">Identidad Visual</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                      <div className="space-y-4">
                        <div className="bg-muted/40 border-2 border-dashed border-border rounded-[32px] p-8 text-center hover:border-primary/40 hover:bg-primary/5 transition-all group relative">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          />
                          <div className="space-y-3">
                            <div className="h-16 w-16 rounded-2xl bg-background shadow-sm flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                              <Plus className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-black text-foreground">Subir Portada</p>
                              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">PNG, JPG hasta 5MB</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative group h-48 rounded-[32px] overflow-hidden border-4 border-background bg-muted/30 flex items-center justify-center">
                        {formData.imgCurso ? (
                          <img 
                            src={getImageUrl(formData.imgCurso)} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
                             <BookOpen className="h-12 w-12 opacity-20" />
                             <p className="text-[10px] font-black uppercase tracking-[0.2em]">Vista previa</p>
                          </div>
                        )}
                        {formData.imgCurso && (
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                             <p className="text-white text-xs font-black uppercase tracking-widest">Cambiar Imagen</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button 
                      type="button" 
                      variant="outline"
                      className="h-16 rounded-2xl font-bold px-10 border-2 hover:bg-muted/50"
                      onClick={() => { resetForm(); setActiveTab("listado"); }}
                    >
                      Descartar
                    </Button>
                    <Button 
                      type="submit" 
                      className="h-16 rounded-2xl font-bold px-10 bg-primary text-primary-foreground hover:bg-primary/90 flex-1 text-lg group shadow-xl shadow-primary/10"
                    >
                      {isEditing ? "Guardar Cambios" : "Publicar Ahora"}
                      <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}