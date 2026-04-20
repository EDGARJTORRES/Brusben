"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import "material-symbols/outlined.css";
import {
  BookOpen,
  Search,
  GraduationCap,
  Users,
  Star,
  DollarSign,
  UserCheck,
  Filter,
  CheckCircle2,        // NUEVO
  Clock,               // NUEVO
  Send                 // NUEVO
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"

import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

interface Curso {
  idCurso: number
  titulo: string
  imgCurso: string
  descripcion: string
  estCurso: any
  idDocente: number
  docenteNombre: string
  catNombre: string
  catColor: string
  precioCurso: number
}

export default function EstudiantesPage() {
  const [courses, setCourses] = useState<Curso[]>([])
  const [categorias, setCategorias] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categoriaFilter, setCategoriaFilter] = useState("all")
  const [selectedCourse, setSelectedCourse] = useState<Curso | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // NUEVO: estado para el modal de éxito
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [enrolledCourse, setEnrolledCourse] = useState<Curso | null>(null)

  const { user } = useAuth()

  useEffect(() => {
    fetchCourses()
    fetchCategorias()
  }, [])

  const fetchCourses = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("http://localhost:8081/api/cursos")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setCourses(data.filter((c: Curso) => c.estCurso === "A" || c.estCurso === true))
    } catch {
      toast.error("Error al cargar el catálogo de cursos")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategorias = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/categorias")
      const data = await res.json()
      setCategorias(data.filter((c: any) => c.catEstado === "A" || c.catEstado === true))
    } catch {
      console.error("Error fetching categorias")
    }
  }

  const getImageUrl = (img?: string) => {
    if (!img || img === "") return "/images/course-finance.jpg"
    if (img.startsWith("http") || img.startsWith("data:")) return img
    let cleanPath = img.replace(/^public\//, "").replace(/^\/public\//, "")
    const fileName = cleanPath.replace(/^\//, "").replace(/^cursos\//, "")
    return `/cursos/${fileName}`
  }

  const handleInscribir = async (course: Curso) => {
    if (!user) {
      toast.error("Debes iniciar sesión para inscribirte.")
      return
    }

    const payload = {
      idUsuario: user.id.toString(),
      idCurso: course.idCurso.toString(),
      monto: course.precioCurso,
      metodoPago: "TRANSFERENCIA",
      nroOperacion: "",
      estado: "PENDIENTE"
    }

    try {
      const res = await fetch("http://localhost:8081/api/pagos/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        // NUEVO: cerrar el detalle y abrir el modal de éxito
        setIsDetailOpen(false)
        setEnrolledCourse(course)
        setIsSuccessOpen(true)
      } else {
        const error = await res.json()
        toast.error(error.error || "Error al registrar la solicitud de inscripción.")
      }
    } catch {
      toast.error("Error de conexión al enviar inscripción.")
    }
  }

  const filteredCourses = courses.filter(c =>
    (c.titulo || "").toLowerCase().includes(search.toLowerCase()) &&
    (categoriaFilter === "all" || c.catNombre === categoriaFilter)
  )

  const totalCursos = courses.length
  const totalCategorias = [...new Set(courses.map(c => c.catNombre))].length
  const precioPromedio = courses.length > 0
    ? (courses.reduce((acc, c) => acc + Number(c.precioCurso || 0), 0) / courses.length)
    : 0

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* HEADER — sin cambios */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            Catálogo de Cursos
          </h1>
          <p className="text-muted-foreground font-medium text-sm">
            Explora todos los cursos disponibles e inscribe estudiantes.
          </p>
        </div>
      </div>

      {/* STATS — sin cambios */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="border-0 shadow-sm bg-primary/10 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 bg-primary/10 h-20 w-20 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">Cursos Disponibles</p>
          <p className="text-3xl font-black text-primary">{totalCursos}</p>
        </Card>
        <Card className="border-0 shadow-sm bg-emerald-500/10 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 bg-emerald-500/10 h-20 w-20 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <p className="text-emerald-700 text-xs font-bold uppercase tracking-widest mb-1">Categorías</p>
          <p className="text-3xl font-black text-emerald-700">{totalCategorias}</p>
        </Card>
        <Card className="border-0 shadow-sm bg-amber-500/10 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 bg-amber-500/10 h-20 w-20 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <p className="text-amber-700 text-xs font-bold uppercase tracking-widest mb-1">Precio Promedio</p>
          <p className="text-3xl font-black text-amber-700">S/ {precioPromedio.toFixed(2)}</p>
        </Card>
      </div>

      {/* FILTROS — sin cambios */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Buscar cursos por nombre..."
            className="pl-10 h-11 rounded-xl bg-background border-border/50 font-medium text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-11 rounded-xl border border-border/50 px-4 bg-background text-sm font-medium text-foreground"
          value={categoriaFilter}
          onChange={(e) => setCategoriaFilter(e.target.value)}
        >
          <option value="all">Todas las categorías</option>
          {categorias.map(cat => (
            <option key={cat.catId} value={cat.catNombre}>{cat.catNombre}</option>
          ))}
        </select>
      </div>

      {/* GRID — sin cambios */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-72 rounded-3xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="py-28 text-center opacity-30">
          <BookOpen className="h-14 w-14 mx-auto mb-3" />
          <p className="font-bold text-lg">No hay cursos disponibles</p>
          <p className="text-sm mt-1">Intenta cambiar los filtros de búsqueda</p>
        </div>
      ) : (
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 pb-10">
          {filteredCourses.map((course) => (
            <Card
              key={course.idCurso}
              className="p-0 border-0 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group rounded-3xl bg-card ring-1 ring-slate-100 dark:ring-slate-800 h-full flex flex-col justify-between cursor-pointer"
              onClick={() => { setSelectedCourse(course); setIsDetailOpen(true) }}
            >
              <div className="relative h-40 overflow-hidden rounded-t-3xl bg-slate-100">
                <img
                  src={getImageUrl(course.imgCurso)}
                  alt={course.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <Badge
                    style={{ backgroundColor: course.catColor || "#6366f1" }}
                    className="text-white text-[10px] font-bold border-0 px-3 py-1 shadow-md"
                  >
                    {course.catNombre || "General"}
                  </Badge>
                </div>
              </div>
              <CardHeader className="py-3 px-5 pb-0">
                <CardTitle className="text-base font-bold line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                  {course.titulo || "Sin título"}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm min-h-[40px] mt-1">
                  {course.descripcion || "Sin descripción"}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 py-3">
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-muted/30 rounded-xl">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-primary">
                      {course.docenteNombre?.substring(0, 1) || "D"}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Docente</p>
                    <p className="text-xs font-bold text-foreground">{course.docenteNombre || "No asignado"}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter
                className="px-5 pb-5 pt-0 flex justify-between items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Precio</p>
                  <p className="text-xl font-black text-foreground">
                    S/ {Number(course.precioCurso || 0).toFixed(2)}
                  </p>
                </div>
                <Button
                  className="rounded-2xl h-10 px-5 font-black bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 text-sm gap-2"
                  onClick={(e) => { e.stopPropagation(); handleInscribir(course) }}
                >
                  <UserCheck className="h-4 w-4" />
                  Inscribirse
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* MODAL DETALLE — sin cambios */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
          <VisuallyHidden.Root>
            <DialogTitle>{selectedCourse?.titulo || "Detalle del curso"}</DialogTitle>
          </VisuallyHidden.Root>
          {selectedCourse && (
            <>
              <div className="relative h-48 overflow-hidden rounded-t-3xl">
                <img
                  src={getImageUrl(selectedCourse.imgCurso)}
                  alt={selectedCourse.titulo}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <Badge
                    style={{ backgroundColor: selectedCourse.catColor || "#6366f1" }}
                    className="text-white text-[10px] font-bold border-0 mb-2 shadow"
                  >
                    {selectedCourse.catNombre || "General"}
                  </Badge>
                  <h2 className="text-xl font-black text-white leading-snug">
                    {selectedCourse.titulo}
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Descripción</p>
                  <p className="text-sm text-foreground leading-relaxed font-medium">
                    {selectedCourse.descripcion || "Sin descripción disponible."}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/30 rounded-2xl p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Docente</p>
                    <p className="text-sm font-bold text-foreground">{selectedCourse.docenteNombre || "No asignado"}</p>
                  </div>
                  <div className="bg-muted/30 rounded-2xl p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Categoría</p>
                    <p className="text-sm font-bold" style={{ color: selectedCourse.catColor || "#6366f1" }}>
                      {selectedCourse.catNombre || "General"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-slate-50 dark:bg-muted/40 rounded-2xl px-5 py-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Inversión</p>
                    <p className="text-3xl font-black text-foreground">S/ {Number(selectedCourse.precioCurso || 0).toFixed(2)}</p>
                  </div>
                  <Button
                    className="rounded-2xl h-12 px-7 font-black bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 text-base gap-2"
                    onClick={() => handleInscribir(selectedCourse)}
                  >
                    <UserCheck className="h-5 w-5" />
                    Inscribirse Ahora
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ✅ NUEVO: MODAL DE CONFIRMACIÓN DE ÉXITO */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
          {enrolledCourse && (
            <div className="flex flex-col items-center text-center p-8 gap-5">
              
              {/* Ícono animado */}
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center animate-in zoom-in duration-500">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                {/* Anillo pulsante */}
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-ping" />
              </div>

              {/* Título */}
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-foreground">¡Solicitud Enviada!</h2>
                <p className="text-sm text-muted-foreground font-medium">
                  Tu inscripción fue registrada exitosamente
                </p>
              </div>

              {/* Info del curso */}
              <div className="w-full bg-muted/40 rounded-2xl p-4 text-left space-y-3">
                <div className="flex items-start gap-3">
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: (enrolledCourse.catColor || "#6366f1") + "20" }}
                  >
                    <BookOpen className="h-4 w-4" style={{ color: enrolledCourse.catColor || "#6366f1" }} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Curso</p>
                    <p className="text-sm font-bold text-foreground leading-snug">{enrolledCourse.titulo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                    <DollarSign className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Monto a pagar</p>
                    <p className="text-sm font-bold text-foreground">S/ {Number(enrolledCourse.precioCurso || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Aviso de estado pendiente */}
              <div className="w-full flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-left">
                <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-amber-700 uppercase tracking-wider mb-0.5">Pago Pendiente</p>
                  <p className="text-xs text-amber-700/80 font-medium leading-relaxed">
                    El administrador revisará tu solicitud y habilitará tu acceso una vez confirmado el pago.
                  </p>
                </div>
              </div>

              {/* Botón cerrar */}
              <Button
                className="w-full h-12 rounded-2xl font-black bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                onClick={() => setIsSuccessOpen(false)}
              >
                Entendido
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}