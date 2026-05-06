"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  BookOpen,
  GraduationCap,
  Plus,
  FileText,
  UserPlus,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
  BarChart3,
  Layers,
  Sparkles,
  CalendarDays,
  CreditCard,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaymentRaw {
  idPago: number
  student: string
  course: string
  amount: string
  date: string
  status: string
  method: string
}

interface CourseRaw {
  idCurso: number
  titulo: string
  estCurso: string
  precioCurso: number
  catNombre?: string
  catColor?: string
}

interface UserRaw {
  idUsuario: number
  idRol: number
  nombreRol: string
  activo: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseMonto(amount: string | number): number {
  if (typeof amount === "number") return amount
  const n = parseFloat(String(amount).replace(/[^\d.-]/g, ""))
  return isNaN(n) ? 0 : n
}

function formatCurrency(n: number) {
  return `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  } catch {
    return dateStr
  }
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Buenos días"
  if (h < 18) return "Buenas tardes"
  return "Buenas noches"
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  const [payments, setPayments] = useState<PaymentRaw[]>([])
  const [courses, setCourses] = useState<CourseRaw[]>([])
  const [users, setUsers] = useState<UserRaw[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const [pRes, cRes, uRes] = await Promise.all([
          fetch("http://localhost:8081/api/pagos"),
          fetch("http://localhost:8081/api/cursos"),
          fetch("http://localhost:8081/api/usuarios"),
        ])
        setPayments(await pRes.json())
        setCourses(await cRes.json())
        setUsers(await uRes.json())
      } catch {
        // silencioso — los valores quedan en []
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  // ── KPI calculations ────────────────────────────────────────────────────────

  const pagados = useMemo(() => payments.filter((p) => p.status === "PAGADO"), [payments])
  const pendientes = useMemo(() => payments.filter((p) => p.status === "PENDIENTE"), [payments])
  const anulados = useMemo(() => payments.filter((p) => p.status === "ANULADO"), [payments])

  const totalIngresos = useMemo(
    () => pagados.reduce((acc, p) => acc + parseMonto(p.amount), 0),
    [pagados]
  )

  const cursosActivos = useMemo(() => courses.filter((c) => c.estCurso === "A"), [courses])

  const estudiantesActivos = useMemo(
    () => users.filter((u) => u.nombreRol?.toLowerCase() === "estudiante" && u.activo),
    [users]
  )

  // Pagos de hoy
  const today = new Date().toISOString().split("T")[0]
  const pagosHoy = useMemo(
    () =>
      pagados.filter((p) => {
        try {
          return new Date(p.date).toISOString().split("T")[0] === today
        } catch {
          return false
        }
      }),
    [pagados, today]
  )

  const ingresosHoy = useMemo(
    () => pagosHoy.reduce((acc, p) => acc + parseMonto(p.amount), 0),
    [pagosHoy]
  )

  // ── Top cursos ──────────────────────────────────────────────────────────────

  const topCursos = useMemo(() => {
    const agrupado: Record<string, { count: number; monto: number }> = {}
    pagados.forEach((p) => {
      if (!agrupado[p.course]) agrupado[p.course] = { count: 0, monto: 0 }
      agrupado[p.course].count += 1
      agrupado[p.course].monto += parseMonto(p.amount)
    })
    return Object.entries(agrupado)
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [pagados])

  // ── Gráfico Top Cursos ──────────────────────────────────────────────────────

  const topCursosChartOptions = useMemo(() => {
    const sorted = [...topCursos].reverse() // menor → mayor (Highcharts bar invierte el eje)
    return {
      chart: {
        type: "bar",
        backgroundColor: "transparent",
        height: 260,
        margin: [10, 20, 10, 10],
      },
      title: { text: "" },
      credits: { enabled: false },
      xAxis: {
        categories: sorted.map((c) => c.name.toLowerCase()),
        labels: {
          style: { fontSize: "11px", color: "#94a3b8", fontWeight: "700", textTransform: "capitalize" },
          formatter: function (this: any) {
            const v: string = this.value
            return v.length > 22 ? v.slice(0, 22) + "…" : v
          },
        },
        lineColor: "transparent",
        tickColor: "transparent",
      },
      yAxis: {
        title: { text: "" },
        labels: {
          style: { fontSize: "10px", color: "#94a3b8" },
          formatter: function (this: any) {
            return `${this.value}`
          },
        },
        gridLineColor: "#f1f5f9",
        allowDecimals: false,
      },
      legend: { enabled: false },
      tooltip: {
        useHTML: true,
        formatter: function (this: any): string {
          const idx = this.point.index
          const curso = sorted[idx]
          return `
            <div style="font-family:inherit;padding:4px 2px">
              <div style="font-weight:900;font-size:12px;margin-bottom:4px;text-transform:capitalize">${curso.name.toLowerCase()}</div>
              <div style="color:#636444;font-weight:700">${curso.count} matrícula${curso.count !== 1 ? "s" : ""}</div>
              <div style="color:#10b981;font-weight:700">${formatCurrency(curso.monto)}</div>
            </div>`
        },
        backgroundColor: "#fff",
        borderColor: "#e2e8f0",
        borderRadius: 12,
        shadow: true,
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          dataLabels: {
            enabled: true,
            formatter: function (this: any) {
              return `${this.y} alum.`
            },
            style: { fontSize: "10px", fontWeight: "700", color: "#64748b", textOutline: "none" },
          },
          colorByPoint: true,
          colors: [
            "#fa9494",
            "#f76767",
            "#f53b3bff",
            "#f01616",
            "#e60000",
          ],
        },
      },
      series: [
        {
          type: "bar",
          name: "Matrículas",
          data: sorted.map((c) => c.count),
        },
      ],
    }
  }, [topCursos])

  // ── Gráfico ingresos por mes ────────────────────────────────────────────────

  const chartOptions = useMemo(() => {
    const porMes: Record<string, number> = {}
    pagados.forEach((p) => {
      try {
        const d = new Date(p.date)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
        porMes[key] = (porMes[key] ?? 0) + parseMonto(p.amount)
      } catch {}
    })
    const meses = Object.keys(porMes).sort().slice(-6)
    const valores = meses.map((m) => porMes[m])
    const labels = meses.map((m) => {
      const [y, mo] = m.split("-")
      return new Date(Number(y), Number(mo) - 1).toLocaleDateString("es-PE", {
        month: "short",
        year: "2-digit",
      })
    })

    return {
      chart: { type: "areaspline", backgroundColor: "transparent", height: 260, margin: [10, 10, 30, 50] },
      title: { text: "" },
      credits: { enabled: false },
      xAxis: {
        categories: labels,
        labels: { style: { fontSize: "11px", color: "#94a3b8" } },
        lineColor: "transparent",
        tickColor: "transparent",
      },
      yAxis: {
        title: { text: "" },
        labels: {
          style: { fontSize: "11px", color: "#94a3b8" },
          formatter: function (this: any) {
            return `S/${(this.value / 1000).toFixed(0)}k`
          },
        },
        gridLineColor: "#f1f5f9",
      },
      legend: { enabled: false },
      tooltip: {
        formatter: function (this: any): string {
          return `<b>${this.x}</b><br/>Ingresos: <b>${formatCurrency(this.y)}</b>`
        },
      },
      plotOptions: {
        areaspline: {
          fillOpacity: 0.15,
          marker: { radius: 4, fillColor: "#bd0b0bff", lineWidth: 2, lineColor: "#fff" },
        },
      },
      series: [
        {
          type: "areaspline",
          name: "Ingresos",
          data: valores,
          color: "#c40f0fff",
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, "rgba(247, 23, 23, 0.3)"],
              [1, "rgba(250, 73, 73, 0)"],
            ],
          },
        },
      ],
    }
  }, [pagados])
  
  const recentPayments = useMemo(() => payments.slice(0, 6), [payments])

  // ── Estadísticas de docentes ────────────────────────────────────────────────

  const docentesActivos = useMemo(
    () => users.filter((u) => u.nombreRol?.toLowerCase() === "docente" && u.activo),
    [users]
  )

  // ── Distribución de pagos ───────────────────────────────────────────────────

  const pagoDistribution = useMemo(() => ({
    pagados: pagados.length,
    pendientes: pendientes.length,
    anulados: anulados.length,
  }), [pagados, pendientes, anulados])

  const pagoDistributionChartOptions = useMemo(() => ({
    chart: { type: "pie", backgroundColor: "transparent", height: 240 },
    title: { text: "" },
    credits: { enabled: false },
    tooltip: {
      pointFormat: "<b>{point.name}</b><br/>{point.y} ({point.percentage:.1f}%)",
      backgroundColor: "#fff",
      borderColor: "#e2e8f0",
      borderRadius: 12,
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        innerSize: "0%",
        dataLabels: {
          enabled: true,
          distance: -25,
          formatter: function (this: any) {
            return `${this.point.y}`
          },
          style: { fontSize: "12px", fontWeight: "900", color: "#fff", textOutline: "none" },
        },
        colors: ["#f16363ff", "#f59999ff", "#ffe5e5ff"]

      },
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      itemStyle: { fontSize: "12px", fontWeight: "700", color: "#64748b" },
    },
    series: [
      {
        name: "Pagos",
        type: "pie",
        data: [
          { name: "Pagados", y: pagoDistribution.pagados },
          { name: "Pendientes", y: pagoDistribution.pendientes },
          { name: "Anulados", y: pagoDistribution.anulados },
        ],
      },
    ],
  }), [pagoDistribution])

  // ── Análisis por curso (pie chart) ───────────────────────────────────────────

  const cursosByStatus = useMemo(() => ({
    activos: cursosActivos.length,
    inactivos: courses.length - cursosActivos.length,
  }), [cursosActivos, courses])

  const cursoStatusChartOptions = useMemo(() => ({
    chart: { type: "pie", backgroundColor: "transparent", height: 240 },
    title: { text: "" },
    credits: { enabled: false },
    tooltip: {
      pointFormat: "<b>{point.name}</b><br/>{point.y} cursos ({point.percentage:.1f}%)",
      backgroundColor: "#fff",
      borderColor: "#e2e8f0",
      borderRadius: 12,
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        innerSize: 75,
        dataLabels: {
          enabled: true,
          distance: -25,
          formatter: function (this: any) {
            return `${this.point.y}`
          },
          style: { fontSize: "12px", fontWeight: "900", color: "#fff", textOutline: "none" },
        },
       colors: ["#e54646ff", "#f7cfcfff"]
      },
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      itemStyle: { fontSize: "12px", fontWeight: "700", color: "#64748b" },
    },
    series: [
      {
        name: "Cursos",
        type: "pie",
        data: [
          { name: "Activos", y: cursosByStatus.activos },
          { name: "Inactivos", y: cursosByStatus.inactivos },
        ],
      },
    ],
  }), [cursosByStatus])

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-7 animate-in fade-in slide-in-from-bottom-3 duration-500">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-2xl font-black text-foreground flex items-center gap-2 flex-wrap">
            <Sparkles className="h-6 w-6 text-primary flex-shrink-0" />
            {getGreeting()}, {user?.nombre ?? "Admin"} 👋
          </h4>
          <p className="text-muted-foreground text-sm mt-1">
            Aquí está el resumen de{" "}
            <span className="font-bold text-foreground">Brusben E.I.R.L</span> al día de hoy.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-5 py-3 shadow-sm self-start sm:self-auto">
          <CalendarDays className="h-5 w-5 text-primary" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Hoy</p>
            <p className="text-sm font-bold text-foreground">
              {new Date().toLocaleDateString("es-PE", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Ingresos Totales"
          value={isLoading ? "—" : formatCurrency(totalIngresos)}
          sub={isLoading ? "" : `+${formatCurrency(ingresosHoy)} hoy`}
          icon={DollarSign}
          trend="up"
          color="emerald"
        />
        <KpiCard
          title="Estudiantes Activos"
          value={isLoading ? "—" : estudiantesActivos.length}
          sub="Con acceso activo"
          icon={Users}
          trend="up"
          color="blue"
        />
        <MetricCard
          title="Promedio por Curso"
          value={isLoading ? "—" : cursosActivos.length > 0 ? formatCurrency(totalIngresos / cursosActivos.length) : "S/ 0"}
          sub="Ingreso promedio"
          icon={BarChart3}
          color="sky"
          trend="neutral"
        />
        <MetricCard
          title="Tasa de Conversión"
          value={isLoading ? "—" : payments.length > 0 ? `${((pagados.length / payments.length) * 100).toFixed(0)}%` : "0%"}
          sub="Pagos completados"
          icon={CheckCircle2}
          color="teal"
          trend="up"
        />
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Gráfico ingresos */}
        <Card className="lg:col-span-8 border border-border shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="px-5 py-0 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Ingresos por Mes</CardTitle>
                  <p className="text-xs text-muted-foreground">Últimos 6 meses — pagos confirmados</p>
                </div>
              </div>
              <Badge className="bg-violet-500/10 text-violet-600 border-0 text-[10px] font-black rounded-full px-3">
                PAGADOS
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="px-4 pt-4 pb-2">
            {isLoading ? (
              <div className="h-[220px] bg-muted animate-pulse rounded-xl" />
            ) : pagados.length === 0 ? (
              <EmptyChart />
            ) : (
              <HighchartsReact highcharts={Highcharts} options={chartOptions} />
            )}
          </CardContent>
        </Card>

        {/* Acciones rápidas */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-2xl p-5 shadow-sm flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <h3 className="font-black text-base">Acciones rápidas</h3>
            </div>
            <p className="text-slate-400 text-xs mb-5">Atajos de gestión del sistema</p>

            <div className="space-y-2">
              {[
                { icon: DollarSign, label: "Registrar Pago", href: "/admin/Pagos", color: "text-emerald-400" },
                { icon: UserPlus, label: "Nuevo Usuario", href: "/admin/Usuarios", color: "text-blue-400" },
                { icon: Plus, label: "Agregar Curso", href: "/admin/Cursos", color: "text-violet-400" },
                { icon: GraduationCap, label: "Ver Matrículas", href: "/admin/Matriculas", color: "text-amber-400" },
                { icon: FileText, label: "Ver Reportes", href: "/admin/Reportes", color: "text-rose-400" },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={() => router.push(a.href)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <a.icon className={cn("h-4 w-4", a.color)} />
                    </div>
                    <span className="text-sm font-semibold">{a.label}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Top cursos */}
        <Card className="lg:col-span-5 border border-border shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="px-5 py-0 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Top Cursos</CardTitle>
                  <p className="text-xs text-muted-foreground">Por número de matrículas pagadas</p>
                </div>
              </div>
              <Badge className="bg-indigo-500/10 text-indigo-600 border-0 text-[10px] font-black rounded-full px-3">
                TOP 5
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="px-4 pt-3 pb-2">
            {isLoading ? (
              <div className="h-[260px] bg-muted animate-pulse rounded-xl" />
            ) : topCursos.length === 0 ? (
              <div className="h-[260px] flex flex-col items-center justify-center text-muted-foreground gap-2">
                <Layers className="h-10 w-10 opacity-20" />
                <p className="text-sm font-bold">Sin datos de matrículas aún</p>
              </div>
            ) : (
              <>
                <HighchartsReact highcharts={Highcharts} options={topCursosChartOptions} />
                {/* Leyenda de montos debajo del gráfico */}
                <div className="mt-1 space-y-1 px-2 pb-1">
                  {[...topCursos].reverse().map((c, i) => (
                    <div key={c.name} className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className="h-2 w-2 rounded-full flex-shrink-0"
                          style={{ background: ["#fc6a6aff","#fa4747ff","#f53b3bff","#f01616ff","#e60000ff"][i] }}
                        />
                        <span className="truncate font-semibold text-muted-foreground capitalize">
                          {c.name.toLowerCase()}
                        </span>
                      </div>
                      <span className="font-black text-emerald-600 flex-shrink-0 ml-2">
                        {formatCurrency(c.monto)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Actividad reciente */}
        <Card className="lg:col-span-7 border border-border shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="px-5 py-0 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Actividad Reciente</CardTitle>
                  <p className="text-xs text-muted-foreground">Últimos pagos registrados</p>
                </div>
              </div>
              <button
                onClick={() => router.push("/admin/Pagos")}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                Ver todos <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="px-0 py-0">
            {isLoading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-muted animate-pulse rounded-xl" />
                ))}
              </div>
            ) : recentPayments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">Sin pagos registrados</p>
            ) : (
              <div className="divide-y divide-border/50">
                {recentPayments.map((p) => (
                  <div
                    key={p.idPago}
                    className="flex items-center justify-between px-6 py-3 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-xs flex-shrink-0 uppercase">
                        {p.student?.charAt(0) ?? "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate leading-tight">{p.student}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{p.course}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      <span className="text-sm font-black text-foreground hidden sm:block">
                        {p.amount}
                      </span>
                      <StatusBadge status={p.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>


      {/* ── CHARTS GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">

        {/* Distribución de pagos */}
        <Card className="lg:col-span-6 border border-border shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="px-5 py-0 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Distribución de Pagos</CardTitle>
                  <p className="text-xs text-muted-foreground">Estado de todos los pagos</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pt-4 pb-2 flex justify-center items-center">
            {isLoading ? (
              <div className="h-[240px] w-full bg-muted animate-pulse rounded-xl " />
            ) : (
              <>
              <HighchartsReact highcharts={Highcharts} options={pagoDistributionChartOptions} />
              {/* Leyenda de montos debajo del gráfico */}
                <div className="mt-1 space-y-1 pb-1">
                 {[
                    { name: "Pagados", value: pagoDistribution.pagados, color: "#10b981" },
                    { name: "Pendientes", value: pagoDistribution.pendientes, color: "#fbbf24" },
                    { name: "Anulados", value: pagoDistribution.anulados, color: "#f87171" },
                  ].map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between text-[11px]">
                      
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className="h-2 w-2 rounded-full flex-shrink-0"
                          style={{ background: item.color }}
                        />
                        <span className="truncate font-semibold text-muted-foreground">
                          {item.name}
                        </span>
                      </div>

                      <span className="font-black text-foreground flex-shrink-0 ml-2">
                        {item.value}
                      </span>

                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Estados de cursos */}
        <Card className="lg:col-span-6 border border-border shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="px-5 py-0 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Estado de Cursos</CardTitle>
                  <p className="text-xs text-muted-foreground">Cursos activos e inactivos</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pt-4 pb-2 flex justify-center">
            {isLoading ? (
              <div className="h-[240px] w-full bg-muted animate-pulse rounded-xl" />
            ) : (
              <>
              <HighchartsReact highcharts={Highcharts} options={cursoStatusChartOptions} />
                <div className="mt-1 space-y-1 pb-1">
                  {[
                    { name: "Activos", value:cursosByStatus.activos, color: "#0c0174ff" },
                    { name: "Inactivos", value: cursosByStatus.inactivos, color: "#5e0808ff" }
                    
                  ].map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between text-[11px]">
                      
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className="h-2 w-2 rounded-full flex-shrink-0"
                          style={{ background: item.color }}
                        />
                        <span className="truncate font-semibold text-muted-foreground">
                          {item.name}
                        </span>
                      </div>

                      <span className="font-black text-foreground flex-shrink-0 ml-2">
                        {item.value}
                      </span>

                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({
  title,
  value,
  sub,
  icon: Icon,
  trend,
  color,
}: {
  title: string
  value: string | number
  sub: string
  icon: React.ElementType
  trend: "up" | "down" | "neutral"
  color: "emerald" | "blue" | "violet" | "amber"
}) {
  const colors = {
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-600" },
    blue: { bg: "bg-blue-500/10", text: "text-blue-600" },
    violet: { bg: "bg-violet-500/10", text: "text-violet-600" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-600" },
  }
  const c = colors[color]

  return (
    <Card className="border border-border shadow-sm rounded-2xl overflow-hidden">
      <CardContent className="px-4 py-1">
        <div className="flex items-center justify-between gap-3">
          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0", c.bg, c.text)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-2">
              {title}
            </p>
            <p className="text-xl font-black text-foreground leading-none mb-2">{value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium truncate">{sub}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PAGADO: "bg-emerald-500/10 text-emerald-600",
    PENDIENTE: "bg-amber-500/10 text-amber-600",
    ANULADO: "bg-rose-500/10 text-rose-600",
  }
  return (
    <Badge
      className={cn(
        "border-0 text-[10px] font-black rounded-full px-3",
        map[status] ?? "bg-muted text-muted-foreground"
      )}
    >
      {status}
    </Badge>
  )
}

function EmptyChart() {
  return (
    <div className="h-[220px] flex flex-col items-center justify-center text-muted-foreground gap-2">
      <BarChart3 className="h-10 w-10 opacity-20" />
      <p className="text-sm font-bold">Sin datos de ingresos aún</p>
    </div>
  )
}

function MetricCard({
  title,
  value,
  sub,
  icon: Icon,
  color,
  trend,
}: {
  title: string
  value: string | number
  sub: string
  icon: React.ElementType
  color: "rose" | "sky" | "teal" | "indigo"
  trend: "up" | "down" | "neutral"
}) {
  const colors = {
    rose: { bg: "bg-rose-500/10", text: "text-rose-600" },
    sky: { bg: "bg-sky-500/10", text: "text-sky-600" },
    teal: { bg: "bg-teal-500/10", text: "text-teal-600" },
    indigo: { bg: "bg-indigo-500/10", text: "text-indigo-600" },
  }
  const c = colors[color]

  return (
    <Card className="border border-border shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="px-4 py-1">
        <div className="flex items-center justify-between gap-3">
          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0", c.bg, c.text)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-2">
              {title}
            </p>
            <p className="text-lg font-black text-foreground leading-none mb-2">{value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 font-medium truncate">{sub}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
