"use client"

import { useEffect, useState, useMemo } from "react"
import React from "react"
import {
  BookOpen,
  Users,
  ChevronDown,
  Search,
  GraduationCap,
  Mail,
  CreditCard,
  Calendar,
  BadgeCheck,
  Layers,
  User,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Estudiante {
  idUsuario: number
  nombre: string
  email: string
  dni: string
  fechaPago: string | null
  metodoPago: string
  monto: number
  idPago: number
}

interface CursoMatricula {
  idCurso: number
  titulo: string
  imgCurso: string | null
  precioCurso: number
  categoria: string
  categoriaColor: string
  docente: string
  totalEstudiantes: number
  estudiantes: Estudiante[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatFecha(fecha: string | null) {
  if (!fecha) return "—"
  try {
    return new Date(fecha).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  } catch {
    return fecha
  }
}

function getInitials(nombre: string) {
  const parts = nombre.trim().split(" ")
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")
}

const METODO_LABELS: Record<string, string> = {
  TRANSFERENCIA: "Transferencia",
  EFECTIVO: "Efectivo",
  VISA: "VISA / MC",
  "YAPE/PLIN": "Yape / Plin",
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function MatriculasPage() {
  const [data, setData] = useState<CursoMatricula[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [openCursoId, setOpenCursoId] = useState<number | null>(null)
  const [search, setSearch] = useState("")
  const [filtroEstudiantes, setFiltroEstudiantes] = useState<Record<number, string>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 6

  // ── Carga de datos ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchMatriculas = async () => {
      setIsLoading(true)
      try {
        const res = await fetch("http://localhost:8081/api/matriculas/por-curso")
        if (!res.ok) throw new Error("Error al obtener matrículas")
        const json: CursoMatricula[] = await res.json()
        setData(json)
      } catch {
        toast.error("No se pudo conectar con el servidor")
      } finally {
        setIsLoading(false)
      }
    }
    fetchMatriculas()
  }, [])

  // ── Filtros ─────────────────────────────────────────────────────────────────
  const filteredData = useMemo(
    () =>
      data.filter((c) =>
        c.titulo.toLowerCase().includes(search.toLowerCase())
      ),
    [data, search]
  )

  // Reset página al buscar
  const handleSearch = (val: string) => {
    setSearch(val)
    setCurrentPage(1)
    setOpenCursoId(null)
  }

  // ── Paginación ──────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredData.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredData, currentPage, ITEMS_PER_PAGE])

  // ── KPIs ────────────────────────────────────────────────────────────────────
  const totalCursos = data.length
  const totalEstudiantes = data.reduce((acc, c) => acc + c.totalEstudiantes, 0)
  const cursosConAlumnos = data.filter((c) => c.totalEstudiantes > 0).length

  const toggleCurso = (id: number) =>
    setOpenCursoId((prev) => (prev === id ? null : id))

  const setFiltroEst = (idCurso: number, val: string) =>
    setFiltroEstudiantes((prev) => ({ ...prev, [idCurso]: val }))

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            Gestión de Matrículas
          </h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            Estudiantes matriculados por curso — solo con pago confirmado.
          </p>
        </div>

        {/* BUSCADOR */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar curso..."
            className="pl-10 rounded-xl h-11"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Cursos",
            value: totalCursos,
            icon: BookOpen,
            color: "text-blue-600",
            bg: "bg-blue-500/10",
          },
          {
            label: "Estudiantes Matriculados",
            value: totalEstudiantes,
            icon: Users,
            color: "text-emerald-600",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Cursos con Alumnos",
            value: cursosConAlumnos,
            icon: BadgeCheck,
            color: "text-violet-600",
            bg: "bg-violet-500/10",
          },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-none shadow-sm bg-secondary/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {kpi.label}
                  </p>
                  <p className="text-3xl font-black mt-1">{kpi.value}</p>
                </div>
                <div
                  className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center",
                    kpi.bg,
                    kpi.color
                  )}
                >
                  <kpi.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* LISTADO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 bg-card animate-pulse rounded-2xl border"
              />
            ))}
          </>
        ) : filteredData.length === 0 ? (
          <div className="col-span-2">
            <EmptyState onClear={() => handleSearch("")} hasSearch={search.length > 0} />
          </div>
        ) : (
          paginatedData.map((curso) => (
            <CursoCard
              key={curso.idCurso}
              curso={curso}
              isOpen={openCursoId === curso.idCurso}
              onToggle={() => toggleCurso(curso.idCurso)}
              filtro={filtroEstudiantes[curso.idCurso] ?? ""}
              onFiltroChange={(val) => setFiltroEst(curso.idCurso, val)}
            />
          ))
        )}
      </div>

      {/* PAGINACIÓN */}
      {!isLoading && filteredData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-muted-foreground font-medium">
            Mostrando{" "}
            <span className="font-bold text-foreground">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            a{" "}
            <span className="font-bold text-foreground">
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}
            </span>{" "}
            de{" "}
            <span className="font-bold text-foreground">{filteredData.length}</span>{" "}
            cursos
          </p>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="h-9 px-4 rounded-xl border border-border/50 text-sm font-bold disabled:opacity-40 hover:bg-muted transition-all"
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "h-9 w-9 rounded-xl border text-sm font-bold transition-all",
                  currentPage === page
                    ? "bg-primary text-white border-primary shadow-sm shadow-primary/20"
                    : "border-border/50 hover:bg-muted"
                )}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-9 px-4 rounded-xl border border-border/50 text-sm font-bold disabled:opacity-40 hover:bg-muted transition-all"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── CursoCard ────────────────────────────────────────────────────────────────

function CursoCard({
  curso,
  isOpen,
  onToggle,
  filtro,
  onFiltroChange,
}: {
  curso: CursoMatricula
  isOpen: boolean
  onToggle: () => void
  filtro: string
  onFiltroChange: (val: string) => void
}) {
  const estudiantesFiltrados = useMemo(
    () =>
      curso.estudiantes.filter(
        (e) =>
          e.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
          e.email.toLowerCase().includes(filtro.toLowerCase()) ||
          e.dni.includes(filtro)
      ),
    [curso.estudiantes, filtro]
  )

  return (
    <Card className="rounded-2xl border bg-background overflow-hidden transition-all hover:shadow-md">
      {/* Header del curso */}
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer select-none"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4 min-w-0">
          {/* Ícono / imagen */}
          <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 overflow-hidden">
            {curso.imgCurso ? (
              <img
                src={`/cursos/${curso.imgCurso}`}
                alt={curso.titulo}
                className="h-full w-full object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = "none"
                }}
              />
            ) : (
              <BookOpen className="h-5 w-5" />
            )}
          </div>

          {/* Info */}
          <div className="min-w-0">
            <h3 className="font-bold text-sm leading-tight truncate">
              {curso.titulo}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${curso.categoriaColor}20`,
                  color: curso.categoriaColor,
                }}
              >
                {curso.categoria}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <User className="h-3 w-3" />
                {curso.docente}
              </span>
            </div>
          </div>
        </div>

        {/* Derecha: contador + chevron */}
        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold",
                curso.totalEstudiantes > 0
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Users className="h-3.5 w-3.5" />
              {curso.totalEstudiantes}{" "}
              {curso.totalEstudiantes === 1 ? "alumno" : "alumnos"}
            </div>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </div>

      {/* Contenido expandible */}
      {isOpen && (
        <CardContent className="px-5 pb-5 pt-0 border-t border-border/50 bg-muted/20">
          {curso.totalEstudiantes === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
                <Users className="h-7 w-7 text-muted-foreground opacity-40" />
              </div>
              <p className="text-sm font-bold text-muted-foreground">
                Sin estudiantes matriculados
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Aún no hay pagos confirmados para este curso.
              </p>
            </div>
          ) : (
            <div className="space-y-3 pt-4">
              {/* Buscador interno */}
              {curso.totalEstudiantes > 4 && (
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Filtrar estudiantes..."
                    className="pl-9 h-9 rounded-xl text-sm bg-background"
                    value={filtro}
                    onChange={(e) => onFiltroChange(e.target.value)}
                  />
                </div>
              )}

              {/* Lista de estudiantes */}
              {estudiantesFiltrados.length === 0 ? (
                <p className="text-center text-xs text-muted-foreground py-4">
                  No hay coincidencias para "{filtro}"
                </p>
              ) : (
                estudiantesFiltrados.map((est) => (
                  <EstudianteRow key={est.idPago} est={est} />
                ))
              )}

              {/* Resumen */}
              {filtro === "" && (
                <p className="text-[11px] text-muted-foreground font-medium text-right pt-1">
                  {curso.totalEstudiantes}{" "}
                  {curso.totalEstudiantes === 1
                    ? "estudiante matriculado"
                    : "estudiantes matriculados"}
                </p>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}

// ─── EstudianteRow ────────────────────────────────────────────────────────────

function EstudianteRow({ est }: { est: Estudiante }) {
  return (
    <div className="bg-background rounded-xl border border-border/60 hover:border-primary/20 hover:shadow-sm transition-all overflow-hidden">
      {/* Franja superior: avatar + nombre + badge */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs flex-shrink-0 uppercase">
            {getInitials(est.nombre)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight truncate">{est.nombre}</p>
            <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
              DNI: {est.dni || "—"}
            </p>
          </div>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-[10px] font-black rounded-full px-3 flex-shrink-0">
          PAGADO
        </Badge>
      </div>

      {/* Separador */}
      <div className="mx-4 border-t border-dashed border-border/50" />

      {/* Fila inferior: email · fecha · método · monto */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-2 px-4 py-3">
        <DataCell icon={<Mail className="h-3 w-3" />} label="Email" value={est.email} className="col-span-2 sm:col-span-2" />
        <DataCell icon={<Calendar className="h-3 w-3" />} label="Fecha pago" value={formatFecha(est.fechaPago)} />
        <DataCell icon={<CreditCard className="h-3 w-3" />} label="Método" value={METODO_LABELS[est.metodoPago] ?? est.metodoPago ?? "—"} />
      </div>
    </div>
  )
}

function DataCell({
  icon,
  label,
  value,
  className,
}: {
  icon: React.ReactNode
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="text-xs font-semibold text-foreground truncate">{value || "—"}</span>
    </div>
  )
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

function EmptyState({
  onClear,
  hasSearch,
}: {
  onClear: () => void
  hasSearch: boolean
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center mb-6 shadow-inner">
        {hasSearch ? (
          <Search className="h-10 w-10 text-muted-foreground opacity-60" />
        ) : (
          <Layers className="h-10 w-10 text-muted-foreground opacity-60" />
        )}
      </div>
      <h3 className="text-xl font-black text-foreground">
        {hasSearch ? "Sin resultados" : "No hay cursos activos"}
      </h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm">
        {hasSearch
          ? "No hay cursos que coincidan con tu búsqueda."
          : "No se encontraron cursos activos en el sistema."}
      </p>
      {hasSearch && (
        <button
          onClick={onClear}
          className="mt-6 px-6 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all shadow-md"
        >
          Limpiar búsqueda
        </button>
      )}
    </div>
  )
}
