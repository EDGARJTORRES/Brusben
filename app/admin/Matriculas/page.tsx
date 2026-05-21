"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  Users,
  Search,
  GraduationCap,
  BadgeCheck,
  Layers,
  User,
  ChevronRight,
  ChevronLeft,
  DollarSign,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { logSystemAction } from "@/lib/logging"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CursoMatricula {
  idCurso: number
  titulo: string
  imgCurso: string | null
  precioCurso: number
  categoria: string
  categoriaColor: string
  docente: string
  totalEstudiantes: number
  estudiantes: any[]
}

function getImageUrl(img: string | null) {
  if (!img) return null
  if (img.startsWith("http")) return img
  return `/cursos/${img.replace(/^.*[/\\]/, "")}`
}

export default function MatriculasPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<CursoMatricula[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    const fetch_ = async () => {
      setIsLoading(true)
      try {
        const res = await fetch("http://localhost:8081/api/matriculas/por-curso")
        if (!res.ok) throw new Error()
        setData(await res.json())
      } catch {
        toast.error("No se pudo conectar con el servidor")
      } finally {
        setIsLoading(false)
      }
    }
    fetch_()
  }, [])

  const filteredData = useMemo(
    () => data.filter((c) => c.titulo.toLowerCase().includes(search.toLowerCase())),
    [data, search]
  )

  const handleSearch = (val: string) => { setSearch(val); setCurrentPage(1) }

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredData.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredData, currentPage])

  const totalCursos = data.length
  const totalEstudiantes = data.reduce((acc, c) => acc + c.totalEstudiantes, 0)
  const cursosConAlumnos = data.filter((c) => c.totalEstudiantes > 0).length

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h4 className="text-2xl font-black flex items-center gap-3 tracking-tight">
            <GraduationCap className="h-6 w-6 text-primary" />
            Gestión de Matrículas
          </h4>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            Estudiantes matriculados por curso — solo con pago confirmado.
          </p>
        </div>
      </div>


      {/* TABLA / LISTA */}
      <div className="rounded-2xl bg-card shadow-md dark:border border-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50  px-6 py-4">
          {/* DERECHA: título */}
          <h2 className="text-lg font-black text-foreground text-right md:text-left flex items-center gap-2">
            Listado de Matriculas
          </h2>
          {/* IZQUIERDA: filtros */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">

            {/* Search */}
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


        </div>
        {/* Cabecera de tabla */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-3 py-2 bg-muted/50 border-b border-border text-[11px] font-black uppercase tracking-widest text-muted-foreground">
          <div className="col-span-4">Curso</div>
          <div className="col-span-2">Categoría</div>
          <div className="col-span-2">Docente</div>
          <div className="col-span-2 text-center">Precio</div>
          <div className="col-span-1 text-center">Alumnos</div>
          <div className="col-span-1"/>
        </div>

        <div className="divide-y divide-border">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-card animate-pulse mx-4 my-2 rounded-xl" />
            ))
          ) : filteredData.length === 0 ? (
            <EmptyState onClear={() => handleSearch("")} hasSearch={search.length > 0} />
          ) : (
            paginatedData.map((curso, idx) => {
              const imgUrl = getImageUrl(curso.imgCurso)
              return (
                <div
                  key={curso.idCurso}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-muted/30 transition-colors group"
                >
                  {/* Curso */}
                  <div className="col-span-4 flex items-center gap-4 min-w-0">
                    <div className="h-10 w-10 rounded-xl overflow-hidden bg-muted flex-shrink-0 ring-1 ring-border">
                      {imgUrl ? (
                        <img src={imgUrl} alt={curso.titulo} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                        {curso.titulo}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                        ID #{curso.idCurso}
                      </p>
                    </div>
                  </div>

                  {/* Categoría */}
                  <div className="col-span-2">
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: `${curso.categoriaColor || "#6366f1"}20`,
                        color: curso.categoriaColor || "#6366f1",
                      }}
                    >
                      {curso.categoria}
                    </span>
                  </div>

                  {/* Docente */}
                  <div className="col-span-2 flex items-center gap-2 min-w-0">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground truncate">
                      {curso.docente || "—"}
                    </span>
                  </div>

                  {/* Precio */}
                  <div className="col-span-2 text-center">
                    <span className="text-sm font-black text-foreground">
                      S/ {Number(curso.precioCurso || 0).toFixed(2)}
                    </span>
                  </div>

                  {/* Alumnos */}
                  <div className="col-span-1 flex justify-center">
                    <Badge
                      className={cn(
                        "rounded-full px-3 font-bold text-xs border-0",
                        curso.totalEstudiantes > 0
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {curso.totalEstudiantes}
                    </Badge>
                  </div>

                  {/* Acción */}
                  <div className="col-span-1 flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => router.push(`/admin/matriculas/${curso.idCurso}`)}
                      disabled={curso.totalEstudiantes === 0}
                      className={cn(
                        "rounded-xl h-9 px-4 font-bold text-xs gap-1.5 transition-all border-1",
                        curso.totalEstudiantes > 0
                          ? "bg-card text-card hover:bg-card text-foreground "
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      )}
                    >
                      Ver
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </div>
        
        {/* PAGINACIÓN */}
        {!isLoading && filteredData.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-6 border-t border-border/30">
            <div className="text-sm text-muted-foreground font-medium">
              Mostrando{" "}
              <span className="font-bold text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>
              {" "}–{" "}
              <span className="font-bold text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}</span>
              {" "}de{" "}
              <span className="font-bold text-foreground">{filteredData.length}</span>
              {" "}cursos
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-xl font-bold h-10 border-border/50 bg-card hover:bg-muted/50 disabled:opacity-50 transition-all"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        "w-10 h-10 rounded-xl font-bold transition-all",
                        currentPage === pageNum 
                          ? "bg-primary text-primary-foreground shadow-md border-primary" 
                          : "border-border/50 bg-card hover:bg-muted/50"
                      )}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-xl font-bold h-10 border-border/50 bg-card hover:bg-muted/50 disabled:opacity-50 transition-all"
              >
                Siguiente
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({ onClear, hasSearch }: { onClear: () => void; hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center mb-6">
        {hasSearch
          ? <Search className="h-10 w-10 text-muted-foreground opacity-60" />
          : <Layers className="h-10 w-10 text-muted-foreground opacity-60" />
        }
      </div>
      <h3 className="text-xl font-black">{hasSearch ? "Sin resultados" : "No hay cursos activos"}</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm">
        {hasSearch ? "No hay cursos que coincidan con tu búsqueda." : "No se encontraron cursos activos en el sistema."}
      </p>
      {hasSearch && (
        <button
          onClick={onClear}
          className="mt-6 px-6 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all"
        >
          Limpiar búsqueda
        </button>
      )}
    </div>
  )
}
