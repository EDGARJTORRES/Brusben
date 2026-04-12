"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { 
  Plus, Search, MoreVertical, BookOpen, LayoutGrid,
  Edit, Trash, ChevronLeft, ChevronRight, FileText
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
    if(!confirm("¿Estás seguro de eliminar este curso?")) return
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
          <TabsList className="bg-slate-100 p-1 rounded-xl h-12">
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
              className="h-12 rounded-xl border px-4 bg-white"
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

                        <DropdownMenuItem 
                          onClick={() => toggleStatus(course)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition cursor-pointer"
                        >
                          <LayoutGrid className="h-4 w-4" />
                          {(course.estCurso === "A" || course.estCurso === true) ? "Desactivar" : "Reactivar"}
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          onClick={() => deleteCurso(course.idCurso)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                        >
                          <Trash className="h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
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
                    className="bg-slate-900 text-white rounded-2xl h-10 w-10 hover:scale-110 transition-transform"
                  >
                    <Plus className="h-5 w-5" />
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
                    <h2 className="text-2xl font-black tracking-tight">{isEditing ? "Edición Maestra" : "Nueva Publicación"}</h2>
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
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">Información General</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-sm font-black text-slate-500 uppercase tracking-widest ml-1">Nombre del Curso</label>
                        <div className="relative group">
                           <Input 
                            name="titulo" 
                            placeholder="Ej. Arquitectura Frontend Pro" 
                            className="h-14 rounded-2xl bg-slate-50 border-0 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-semibold px-4"
                            value={formData.titulo}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-black text-slate-500 uppercase tracking-widest ml-1">Costo (S/.)</label>
                        <div className="relative group">
                          <Input 
                            name="precioCurso" 
                            type="number" 
                            step="0.01" 
                            placeholder="0.00" 
                            className="h-14 rounded-2xl bg-slate-50 border-0 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-bold px-4 text-lg"
                            value={formData.precioCurso}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-black text-slate-500 uppercase tracking-widest ml-1">Descripción del Programa</label>
                      <textarea 
                        name="descripcion" 
                        placeholder="Define los objetivos, temario y beneficios..." 
                        className="w-full h-32 p-5 rounded-2xl bg-slate-50 border-0 focus:ring-2 ring-primary/20 outline-none resize-none transition-all focus:bg-white font-medium leading-relaxed shadow-inner"
                        value={formData.descripcion}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* SECCIÓN 2: ACADÉMICO */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <LayoutGrid className="h-4 w-4 text-amber-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">Categorización y Docencia</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-sm font-black text-slate-500 uppercase tracking-widest ml-1">Categoría Académica</label>
                        <select
                          name="catId"
                          className="w-full h-14 rounded-2xl bg-slate-50 border-0 px-6 focus:ring-2 ring-primary/20 outline-none font-bold text-slate-600 appearance-none cursor-pointer hover:bg-slate-100 transition-colors"
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
                        <label className="text-sm font-black text-slate-500 uppercase tracking-widest ml-1">Especialista / Docente</label>
                        <select
                          name="idDocente"
                          className="w-full h-14 rounded-2xl bg-slate-50 border-0 px-6 focus:ring-2 ring-primary/20 outline-none font-bold text-slate-600 appearance-none cursor-pointer hover:bg-slate-100 transition-colors"
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
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <LayoutGrid className="h-4 w-4 text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">Identidad Visual</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                      <div className="space-y-4">
                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] p-8 text-center hover:border-primary/40 hover:bg-primary/5 transition-all group relative">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          />
                          <div className="space-y-3">
                            <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                              <Plus className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-700">Subir Portada</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">PNG, JPG hasta 5MB</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative group h-48 rounded-[32px] overflow-hidden border-4 border-white bg-slate-100 flex items-center justify-center">
                        {formData.imgCurso ? (
                          <img 
                            src={getImageUrl(formData.imgCurso)} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-slate-300">
                             <BookOpen className="h-12 w-12 opacity-20" />
                             <p className="text-[10px] font-black uppercase tracking-[0.2em]">Vista previa</p>
                          </div>
                        )}
                        {formData.imgCurso && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
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
                      className="h-16 rounded-2xl font-bold px-10 border-2 hover:bg-slate-50"
                      onClick={() => { resetForm(); setActiveTab("listado"); }}
                    >
                      Descartar
                    </Button>
                    <Button 
                      type="submit" 
                      className="h-16 rounded-2xl font-bold px-10 bg-slate-900 text-white hover:bg-slate-800 shadow-2xl shadow-slate-200 flex-1 text-lg group"
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