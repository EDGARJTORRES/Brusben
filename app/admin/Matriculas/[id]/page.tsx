"use client"

import { useEffect, useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import React from "react"
import {
  ArrowLeft,
  BookOpen,
  Users,
  Search,
  Mail,
  CreditCard,
  Calendar,
  User,
  DollarSign,
  BadgeCheck,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
      day: "2-digit", month: "short", year: "numeric",
    })
  } catch { return fecha }
}

function getInitials(nombre: string) {
  const parts = nombre.trim().split(" ")
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase()
}

function getImageUrl(img: string | null) {
  if (!img) return null
  if (img.startsWith("http")) return img
  return `/cursos/${img.replace(/^.*[/\\]/, "")}`
}

const METODO_LABELS: Record<string, string> = {
  TRANSFERENCIA: "Transferencia",
  EFECTIVO: "Efectivo",
  VISA: "VISA / MC",
  "YAPE/PLIN": "Yape / Plin",
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function MatriculaDetallePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [curso, setCurso] = useState<CursoMatricula | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 8

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await fetch("http://localhost:8081/api/matriculas/por-curso")
        if (!res.ok) throw new Error()
        const all: CursoMatricula[] = await res.json()
        const found = all.find((c) => c.idCurso === Number(id))
        if (!found) {
          toast.error("Curso no encontrado")
          router.replace("/admin/matriculas")
          return
        }
        setCurso(found)
      } catch {
        toast.error("Error al cargar los datos")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  const estudiantesFiltrados = useMemo(() => {
    if (!curso) return []
    const q = search.toLowerCase()
    return curso.estudiantes.filter(
      (e) =>
        e.nombre.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        (e.dni || "").includes(q)
    )
  }, [curso, search])

  const totalPages = Math.ceil(estudiantesFiltrados.length / ITEMS_PER_PAGE)
  const paginatedEstudiantes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return estudiantesFiltrados.slice(start, start + ITEMS_PER_PAGE)
  }, [estudiantesFiltrados, currentPage])

  const handleSearch = (val: string) => { setSearch(val); setCurrentPage(1) }

  const totalRecaudado = useMemo(
    () => curso?.estudiantes.reduce((acc, e) => acc + Number(e.monto || 0), 0) ?? 0,
    [curso]
  )

  const imgUrl = getImageUrl(curso?.imgCurso ?? null)

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-muted rounded-xl" />
        <div className="h-48 bg-muted rounded-3xl" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-muted rounded-2xl" />)}
        </div>
        {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-16 bg-muted rounded-xl" />)}
      </div>
    )
  }

  if (!curso) return null

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* BANNER DEL CURSO con botón de regreso integrado */}
      <div className="relative h-45 rounded-3xl overflow-hidden bg-muted shadow-md">
        {imgUrl ? (
          <img src={imgUrl} alt={curso.titulo} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/5">
            <BookOpen className="h-16 w-16 text-primary/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

        {/* Botón regresar — esquina superior izquierda */}
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/matriculas")}
            className="h-9 px-3 rounded-xl bg-white/15  text-white border border-white/20 backdrop-blur-sm gap-2 font-bold text-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            Regresar
          </Button>
        </div>

        {/* Info del curso — parte inferior */}
        <div className="absolute inset-0 flex flex-col justify-end px-8 pb-6">
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white w-fit mb-2"
            style={{ backgroundColor: curso.categoriaColor || "#6366f1" }}
          >
            {curso.categoria}
          </span>
          <h2 className="text-white font-black text-xl leading-snug drop-shadow max-w-2xl">
            {curso.titulo}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <User className="h-3.5 w-3.5 text-white/60" />
            <span className="text-white/70 text-sm font-medium">{curso.docente || "Sin docente"}</span>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Matriculados",
            value: curso.totalEstudiantes,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-500/10",
          },
          {
            label: "Total Recaudado",
            value: `S/ ${totalRecaudado.toFixed(2)}`,
            icon: DollarSign,
            color: "text-emerald-600",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Precio por Curso",
            value: `S/ ${Number(curso.precioCurso || 0).toFixed(2)}`,
            icon: BadgeCheck,
            color: "text-violet-600",
            bg: "bg-violet-500/10",
          },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
                  <p className="text-2xl font-black mt-1">{kpi.value}</p>
                </div>
                <div className={cn("h-11 w-11 rounded-2xl flex items-center justify-center", kpi.bg, kpi.color)}>
                  <kpi.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* BUSCADOR */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="text-lg font-black">
          Estudiantes matriculados
          <span className="ml-2 text-sm font-bold text-muted-foreground">
            ({curso.totalEstudiantes})
          </span>
        </h2>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email o DNI..."
            className="pl-10 rounded-xl h-10"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLA DE ESTUDIANTES */}
      <div className="border-none shadow-sm rounded-2xl overflow-hidden">
        {/* Cabecera */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-muted/50 border-b border-border text-[11px] font-black uppercase tracking-widest text-muted-foreground">
          <div className="col-span-5">Estudiante</div>
          <div className="col-span-1">DNI</div>
          <div className="col-span-2">Fecha Pago</div>
          <div className="col-span-2">Método</div>
          <div className="col-span-2 text-right">Monto</div>
        </div>

        <div className="divide-y divide-border">
          {curso.totalEstudiantes === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-muted-foreground/30" />
              </div>
              <p className="font-bold text-muted-foreground">Sin estudiantes matriculados</p>
              <p className="text-xs text-muted-foreground mt-1">Aún no hay pagos confirmados para este curso.</p>
            </div>
          ) : estudiantesFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="h-8 w-8 text-muted-foreground/30 mb-3" />
              <p className="font-bold text-muted-foreground">Sin resultados para "{search}"</p>
            </div>
          ) : (
            paginatedEstudiantes.map((est) => (
              <div
                key={est.idPago}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-muted/30 transition-colors group"
              >
                {/* Nombre */}
                <div className="col-span-5 flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs flex-shrink-0">
                    {getInitials(est.nombre)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{est.nombre}</p>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-[9px] font-black rounded-full px-2 mt-0.5">
                      PAGADO
                    </Badge>
                  </div>
                </div>

                {/* DNI */}
                <div className="col-span-1">
                  <span className="text-xs font-mono text-muted-foreground">{est.dni || "—"}</span>
                </div>

                {/* Fecha */}
                <div className="col-span-2 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs font-medium">{formatFecha(est.fechaPago)}</span>
                </div>

                {/* Método */}
                <div className="col-span-2 flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs font-medium">
                    {METODO_LABELS[est.metodoPago] ?? est.metodoPago ?? "—"}
                  </span>
                </div>

                {/* Monto */}
                <div className="col-span-2 text-right">
                  <span className="text-sm font-black text-foreground">
                    S/ {Number(est.monto || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-muted-foreground font-medium">
            Mostrando{" "}
            <span className="font-bold text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>
            {" "}–{" "}
            <span className="font-bold text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, estudiantesFiltrados.length)}</span>
            {" "}de{" "}
            <span className="font-bold text-foreground">{estudiantesFiltrados.length}</span> estudiantes
          </p>
          <div className="flex items-center gap-2">
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
                    ? "bg-primary text-white border-primary shadow-sm"
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
