"use client"

import React, { useState, useEffect } from "react"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BookOpen, 
  Users, 
  Wallet,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CursoFinanzas {
  idCurso: number
  titulo: string
  precioCurso: number
  totalEstudiantes: number
  ingresos: number
  egresos: number
  balance: number
}

export default function BalancePage() {
  const [data, setData] = useState<CursoFinanzas[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("TODOS")

  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [matriculasRes, egresosRes] = await Promise.all([
          fetch("http://localhost:8081/api/matriculas/por-curso"),
          fetch("http://localhost:8081/api/egresos-docentes")
        ])

        const matriculas = await matriculasRes.json()
        const egresos = await egresosRes.json()

        // Procesar datos para cruzarlos por curso
        const finanzas = matriculas.map((m: any) => {
          const egresoCurso = egresos
            .filter((e: any) => e.curso === m.titulo)
            .reduce((acc: number, e: any) => acc + Number(e.monto), 0)
          
          const ingresos = m.totalEstudiantes * m.precioCurso

          return {
            idCurso: m.idCurso,
            titulo: m.titulo,
            precioCurso: m.precioCurso,
            totalEstudiantes: m.totalEstudiantes,
            ingresos: ingresos,
            egresos: egresoCurso,
            balance: ingresos - egresoCurso
          }
        })

        setData(finanzas)
      } catch (error) {
        console.error("Error fetching financial data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const totalIngresos = data.reduce((acc, c) => acc + c.ingresos, 0)
  const totalEgresos = data.reduce((acc, c) => acc + c.egresos, 0)
  const balanceTotal = totalIngresos - totalEgresos
  const margenPromedio = totalIngresos > 0 ? (balanceTotal / totalIngresos) * 100 : 0

  const filteredData = data.filter((curso) => {
    const matchesSearch = curso.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesStatus = true
    if (statusFilter === "RENTABLE") matchesStatus = curso.balance > 0
    else if (statusFilter === "PERDIDA") matchesStatus = curso.balance < 0
    else if (statusFilter === "EQUILIBRADO") matchesStatus = curso.balance === 0
    
    return matchesSearch && matchesStatus
  })

  // Lógica de paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = filteredData.slice(startIndex, endIndex)

  // Resetear página al filtrar
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h4 className="text-2xl font-black flex items-center gap-3 tracking-tight">
            <BarChart3 className="h-6 w-6 text-primary" />
            Balance del Negocio
          </h4>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            Análisis detallado de rentabilidad por curso y rendimiento global.
          </p>
        </div>
        <div className="flex items-center gap-4">
           <Badge variant="outline" className="py-2 rounded-xl border-dashed font-bold text-xs">
             Última actualización: {new Date().toLocaleDateString()}
           </Badge>
           <Button variant="outline" className="rounded-xl h-11 px-6 font-bold border-border gap-2 bg-card">
              <Download className="h-4 w-4 " />
              Exportar a PDF
            </Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Ingresos Totales" 
          value={`S/ ${totalIngresos.toLocaleString()}`} 
          icon={TrendingUp}
          description="Recaudación bruta por cursos"
          trend="+12%"
          trendUp={true}
          color="text-emerald-600"
          bg="bg-emerald-500/10"
        />
        <KPICard 
          title="Inversión Docente" 
          value={`S/ ${totalEgresos.toLocaleString()}`} 
          icon={TrendingDown}
          description="Pagos realizados a docentes"
          trend="-5%"
          trendUp={false}
          color="text-rose-600"
          bg="bg-rose-500/10"
        />
        <KPICard 
          title="Ganancia Neta" 
          value={`S/ ${balanceTotal.toLocaleString()}`} 
          icon={Wallet}
          description="Utilidad real del negocio"
          trend="+8.5%"
          trendUp={true}
          color="text-blue-600"
          bg="bg-blue-500/10"
        />
        <KPICard 
          title="Margen de Ganancia" 
          value={`${margenPromedio.toFixed(1)}%`} 
          icon={ArrowUpRight}
          description="Rentabilidad sobre ingresos"
          trend="+2%"
          trendUp={true}
          color="text-violet-600"
          bg="bg-violet-500/10"
        />
      </div>

      {/* TABLE SECTION */}
      <div className="rounded-2xl overflow-hidden bg-card shadow-md dark:border border-0">
        <div className="border-b border-border/50  px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="text-xl font-black">Análisis por Curso</div>
            <div className="flex items-center gap-2">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground  transition-colors" />
                <input 
                  placeholder="Filtrar curso..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 h-10 bg-muted/40 border-0 rounded-xl text-sm font-bold transition-all outline-none w-48 lg:w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] bg-muted/40 border-0 rounded-xl text-sm font-bold h-10">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50 shadow-xl">
                  <SelectItem value="TODOS" className="font-bold cursor-pointer">Todos</SelectItem>
                  <SelectItem value="RENTABLE" className="font-bold cursor-pointer text-emerald-600">Rentable</SelectItem>
                  <SelectItem value="PERDIDA" className="font-bold cursor-pointer text-rose-600">En Pérdida</SelectItem>
                  <SelectItem value="EQUILIBRADO" className="font-bold cursor-pointer text-muted-foreground">Equilibrado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-b border-border/40 hover:bg-transparent">
                <TableHead className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Curso</TableHead>
                <TableHead className="py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-center">Alumnos</TableHead>
                <TableHead className="py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-center">Precio</TableHead>
                <TableHead className="py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-center">Ingresos</TableHead>
                <TableHead className="py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Inversión (Pago)</TableHead>
                <TableHead className="py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Balance Neto</TableHead>
                <TableHead className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-center">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7} className="h-16 animate-pulse bg-muted/20" />
                  </TableRow>
                ))
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-40 text-center text-muted-foreground font-bold italic">
                    {data.length === 0 
                      ? "No se encontraron datos financieros disponibles." 
                      : "Ningún curso coincide con los filtros aplicados."}
                  </TableCell>
                </TableRow>
              ) : paginatedData.map((curso) => (
                <TableRow key={curso.idCurso} className="border-b border-border/30 hover:bg-muted/30 transition-colors group">
                  <TableCell className="px-8 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-sm group-hover:text-primary transition-colors max-w-[240px] truncate">{curso.titulo}</p>
                        <p className="text-[11px] font-medium text-muted-foreground">ID: #{curso.idCurso}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-bold text-sm">
                    <div className="flex items-center justify-center gap-2">
                       <Users className="h-3.5 w-3.5 text-muted-foreground" />
                       {curso.totalEstudiantes}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-black text-sm text-muted-foreground">
                    S/ {curso.precioCurso.toLocaleString('es-PE', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </TableCell>

                  <TableCell className="text-right font-black text-sm text-emerald-600">
                    S/ {curso.ingresos.toLocaleString('es-PE', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </TableCell>

                  <TableCell className="text-center font-black text-sm text-rose-600">
                    - S/ {curso.egresos.toLocaleString('es-PE', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </TableCell>

                  <TableCell
                    className={cn(
                      "text-center font-black text-sm",
                      curso.balance >= 0 ? "text-chart-4" : "text-rose-600"
                    )}
                  >
                    S/ {curso.balance.toLocaleString('es-PE', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </TableCell>
                  <TableCell className="px-8 text-center">
                    <Badge className={cn(
                      "rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-wider border-0",
                      curso.balance > 0 
                        ? "bg-emerald-500/10 text-emerald-600" 
                        : curso.balance < 0 
                          ? "bg-rose-500/10 text-rose-600" 
                          : "bg-muted text-muted-foreground"
                    )}>
                      {curso.balance > 0 ? "Rentable" : curso.balance < 0 ? "En Pérdida" : "Equilibrado"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Controles de Paginación */}
        {!isLoading && filteredData.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-6 border-t border-border/30">
            <div className="text-sm text-muted-foreground font-medium">
              Mostrando{" "}
              <span className="font-bold text-foreground">{startIndex + 1}</span>
              {" "}–{" "}
              <span className="font-bold text-foreground">{Math.min(endIndex, filteredData.length)}</span>
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
                          ? "bg-primary text-white shadow-md border-primary" 
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

function KPICard({ title, value, icon: Icon, description, trend, trendUp, color, bg }: any) {
  return (
    <Card className="rounded-2xl bg-card shadow-md dark:border border-0 transition-all">
      <CardContent className="px-6 py-0 flex flex-col items-center">
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{title}</p>
        </div>
        <div className="flex items-center justify-between my-2">
          <div className={cn("p-3 rounded-full", bg, color)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-2xl font-black mt-1 tracking-tight text-foreground">{value}</h3>
          <p className="text-xs font-medium text-muted-foreground mt-2">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
