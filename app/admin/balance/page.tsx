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
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="px-4 py-2 rounded-xl border-dashed font-bold text-xs">
             Última actualización: {new Date().toLocaleDateString()}
           </Badge>
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
      <div className="border-none shadow-sm rounded-3xl overflow-hidden bg-card">
        <div className="border-b border-border/50 bg-muted/20 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="text-xl font-black">Análisis por Curso</div>
            <div className="flex items-center gap-2">
              <div className="relative group">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  placeholder="Filtrar curso..." 
                  className="pl-10 pr-4 py-2 bg-muted/40 border-0 rounded-xl text-sm font-bold focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-b border-border/40 hover:bg-transparent">
                <TableHead className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Curso</TableHead>
                <TableHead className="py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-center">Alumnos</TableHead>
                <TableHead className="py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Precio</TableHead>
                <TableHead className="py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Ingresos</TableHead>
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
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-40 text-center text-muted-foreground font-bold italic">
                    No se encontraron datos financieros disponibles.
                  </TableCell>
                </TableRow>
              ) : data.map((curso) => (
                <TableRow key={curso.idCurso} className="border-b border-border/30 hover:bg-muted/30 transition-colors group">
                  <TableCell className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-sm group-hover:text-primary transition-colors">{curso.titulo}</p>
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
                    S/ {curso.precioCurso.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-black text-sm text-emerald-600">
                    S/ {curso.ingresos.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-black text-sm text-rose-600">
                    - S/ {curso.egresos.toLocaleString()}
                  </TableCell>
                  <TableCell className={cn(
                    "text-right font-black text-sm",
                    curso.balance >= 0 ? "text-primary" : "text-rose-600"
                  )}>
                    S/ {curso.balance.toLocaleString()}
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
      </div>
    </div>
  )
}

function KPICard({ title, value, icon: Icon, description, trend, trendUp, color, bg }: any) {
  return (
    <Card className=" rounded-3xl bg-card transition-all hover:shadow-md hover:translate-y-[-2px]">
      <CardContent className="px-6 py-2">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-3 rounded-2xl", bg, color)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className={cn(
            "flex items-center gap-1 text-xs font-black px-2 py-1 rounded-lg",
            trendUp ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
          )}>
            {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-black mt-1 tracking-tight text-foreground">{value}</h3>
          <p className="text-xs font-medium text-muted-foreground mt-2">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
