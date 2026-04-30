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

  const maxTopCount = topCursos[0]?.count ?? 1

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
      chart: { type: "areaspline", backgroundColor: "transparent", height: 220, margin: [10, 10, 30, 50] },
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
          marker: { radius: 4, fillColor: "#6366f1", lineWidth: 2, lineColor: "#fff" },
        },
      },
      series: [
        {
          type: "areaspline",
          name: "Ingresos",
          data: valores,
          color: "#6366f1",
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, "rgba(99,102,241,0.3)"],
              [1, "rgba(99,102,241,0)"],
            ],
          },
        },
      ],
    }
  }, [pagados])

  // ── Actividad reciente ──────────────────────────────────────────────────────

  const recentPayments = useMemo(() => payments.slice(0, 6), [payments])

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
        <KpiCard
          title="Cursos Activos"
          value={isLoading ? "—" : cursosActivos.length}
          sub={`${courses.length} cursos en total`}
          icon={BookOpen}
          trend="neutral"
          color="violet"
        />
        <KpiCard
          title="Pagos de Hoy"
          value={isLoading ? "—" : pagosHoy.length}
          sub={`${pendientes.length} pendientes`}
          icon={CreditCard}
          trend={pendientes.length > 0 ? "down" : "up"}
          color="amber"
        />
      </div>

      {/* ── ESTADO DE PAGOS ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pagados", count: pagados.length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-500/10" },
          { label: "Pendientes", count: pendientes.length, icon: Clock, color: "text-amber-600", bg: "bg-amber-500/10" },
          { label: "Anulados", count: anulados.length, icon: XCircle, color: "text-rose-600", bg: "bg-rose-500/10" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-card border border-border rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm"
          >
            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0", s.bg, s.color)}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-black">{isLoading ? "—" : s.count}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Gráfico ingresos */}
        <Card className="lg:col-span-8 border border-border shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="px-6 pt-5 pb-3 border-b border-border/50">
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
                    <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
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
          <CardHeader className="px-6 pt-5 pb-3 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Top Cursos</CardTitle>
                <p className="text-xs text-muted-foreground">Por número de matrículas pagadas</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-6 py-4 space-y-4">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-muted animate-pulse rounded-xl" />
              ))
            ) : topCursos.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Sin datos aún</p>
            ) : (
              topCursos.map((c, i) => (
                <div key={c.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[11px] font-black text-muted-foreground w-5 flex-shrink-0">
                        {i + 1}°
                      </span>
                      <span className="text-sm font-bold truncate capitalize">
                        {c.name.toLowerCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      <span className="text-xs font-bold text-muted-foreground">
                        {c.count} alum.
                      </span>
                      <span className="text-xs font-black text-emerald-600">
                        {formatCurrency(c.monto)}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(c.count / maxTopCount) * 100}%`,
                        background: `hsl(${220 + i * 25}, 80%, 60%)`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Actividad reciente */}
        <Card className="lg:col-span-7 border border-border shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="px-6 pt-5 pb-3 border-b border-border/50">
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
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", c.bg, c.text)}>
            <Icon className="h-5 w-5" />
          </div>
          {trend !== "neutral" && (
            <div
              className={cn(
                "flex items-center gap-1 text-[10px] font-bold rounded-full px-2 py-1",
                trend === "up"
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-rose-500/10 text-rose-600"
              )}
            >
              {trend === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
            </div>
          )}
        </div>
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
          {title}
        </p>
        <p className="text-2xl font-black text-foreground leading-none">{value}</p>
        <p className="text-[11px] text-muted-foreground mt-1.5 font-medium">{sub}</p>
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
