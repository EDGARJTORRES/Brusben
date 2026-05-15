"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  const [cursosMatriculados, setCursosMatriculados] = useState<Set<number>>(new Set())
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

  // Cuando ya tenemos cursos y usuario, traemos los pagados
  useEffect(() => {
    if (user?.id) fetchCursosMatriculados(user.id)
  }, [user])

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

  const fetchCursosMatriculados = async (idUsuario: number) => {
    try {
      const res = await fetch(`http://localhost:8081/api/pagos/usuario/${idUsuario}`)
      if (!res.ok) return
      const data = await res.json()
      // El endpoint devuelve objetos con idCurso
      const ids = new Set<number>(data.map((p: any) => Number(p.idCurso)))
      setCursosMatriculados(ids)
    } catch {
      // silencioso — si falla simplemente no filtra
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
        // Refrescar cursos matriculados para ocultar este curso del catálogo
        if (user?.id) fetchCursosMatriculados(user.id)
      } else {
        const error = await res.json()
        toast.error(error.error || "Error al registrar la solicitud de inscripción.")
      }
    } catch {
      toast.error("Error de conexión al enviar inscripción.")
    }
  }

  const filteredCourses = courses.filter(c =>
    !cursosMatriculados.has(c.idCurso) &&
    (c.titulo || "").toLowerCase().includes(search.toLowerCase()) &&
    (categoriaFilter === "all" || c.catNombre === categoriaFilter)
  )

  // Stats sobre cursos disponibles (sin los ya matriculados)
  const cursosDisponibles = courses.filter(c => !cursosMatriculados.has(c.idCurso))

  const totalCursos = cursosDisponibles.length
  const totalCategorias = [...new Set(cursosDisponibles.map(c => c.catNombre))].length
  const precioPromedio = cursosDisponibles.length > 0
    ? (cursosDisponibles.reduce((acc, c) => acc + Number(c.precioCurso || 0), 0) / cursosDisponibles.length)
    : 0

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* HEADER — sin cambios */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl  font-black tracking-tight text-foreground flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-primary" />
            Catálogo de Cursos
          </h1>
          <p className="text-muted-foreground font-medium text-sm">
            Explora todos los cursos disponibles e inscribe estudiantes.
          </p>
        </div>
      </div>

      {/* FILTROS */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Buscar cursos por nombre..."
            className="pl-11 h-12 rounded-2xl bg-card border-border/50 font-bold text-sm focus-visible:ring-1 focus-visible:ring-primary/30 shadow-sm transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
          <SelectTrigger className="h-14 pl-11 rounded-2xl border-border/50 px-5 bg-card text-sm font-bold shadow-sm w-full sm:w-[220px] focus:ring-1 focus:ring-primary/30">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-border/50 shadow-xl">
            <SelectItem value="all" className="font-bold cursor-pointer">Todas las categorías</SelectItem>
            {categorias.map(cat => (
              <SelectItem key={cat.catId} value={cat.catNombre} className="font-bold cursor-pointer">
                {cat.catNombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
              className="p-0 border border-border/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group rounded-[2rem] bg-card h-full flex flex-col justify-between cursor-pointer overflow-hidden"
              onClick={() => { setSelectedCourse(course); setIsDetailOpen(true) }}
            >
              <div className="relative h-36 overflow-hidden bg-muted">
                <img
                  src={getImageUrl(course.imgCurso)}
                  alt={course.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />
                <div className="absolute top-4 left-4">
                  <Badge
                    style={{ backgroundColor: course.catColor || "#6366f1" }}
                    className="text-white text-[10px] font-black border-0 px-3 py-1.5 shadow-md uppercase tracking-wider"
                  >
                    {course.catNombre || "General"}
                  </Badge>
                </div>
              </div>
              <CardHeader className="py-5 px-6 pb-0">
                <CardTitle className="text-lg font-black line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {course.titulo || "Sin título"}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm min-h-[20px] mt-2 font-medium">
                  {course.descripcion || "Sin descripción"}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 py-2">
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
              </CardContent>
              <CardFooter
                className="px-6 pb-6 pt-0 flex justify-between items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Inversión</p>
                  <p className="text-2xl font-black text-foreground tracking-tight leading-none">
                    <span className="text-sm text-muted-foreground mr-1">S/</span>
                    {Number(course.precioCurso || 0).toFixed(2)}
                  </p>
                </div>
                <Button
                  className="rounded-2xl h-11 px-6 font-black bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 text-sm gap-2 active:scale-95 transition-all"
                  onClick={(e) => { e.stopPropagation(); handleInscribir(course) }}
                >
                  <UserCheck className="h-4 w-4" />
                  Inscribirme
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

      {/* NUEVO: MODAL DE CONFIRMACIÓN DE ÉXITO */}
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