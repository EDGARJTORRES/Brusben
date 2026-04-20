"use client"

import {
  TrendingUp,
  DollarSign,
  Users,
  BookOpen,
  CheckCircle2,
  LayoutDashboard,
  PieChart,
  BarChart4,
  ArrowRight,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import "material-symbols/outlined.css";
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const reportStats = [
  {
    title: "Ingresos Totales",
    value: "S/ 124,560.00",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "emerald",
  },
  {
    title: "Nuevas Matrículas",
    value: "148",
    change: "+18.2%",
    trend: "up",
    icon: Users,
    color: "blue",
  },
  {
    title: "Cursos Completados",
    value: "86",
    change: "-4.1%",
    trend: "down",
    icon: CheckCircle2,
    color: "orange",
  },
  {
    title: "Tasa de Retención",
    value: "94.2%",
    change: "+2.4%",
    trend: "up",
    icon: TrendingUp,
    color: "purple",
  },
]

const recentPayments = [
  { id: "PAY-001", student: "María Garcia", amount: "S/ 450.00", date: "Hace 5 min", status: "Completado" },
  { id: "PAY-002", student: "Juan Pérez", amount: "S/ 1,200.00", date: "Hace 15 min", status: "Pendiente" },
  { id: "PAY-003", student: "Ana Martínez", amount: "S/ 380.00", date: "Hace 1 hora", status: "Completado" },
  { id: "PAY-004", student: "Carlos Ruiz", amount: "S/ 950.00", date: "Hace 2 horas", status: "Completado" },
]

export default function ReportsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
          <BarChart4 className="h-8 w-8 text-primary" />
          Módulo de Reportes
        </h1>
        <p className="text-muted-foreground font-medium">Analiza el rendimiento académico y financiero en tiempo real.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reportStats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm rounded-2xl overflow-hidden group hover:shadow-md transition-all">
            <CardContent className="py-2 px-4">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <Badge 
                  className={`bg-${stat.trend === 'up' ? 'emerald' : 'rose'}-50 text-${stat.trend === 'up' ? 'emerald' : 'rose'}-600 border-0 rounded-full`}
                >
                  {stat.change}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.title}</p>
                <p className="text-2xl font-black text-foreground">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-2xl h-14 w-full justify-start gap-2 border border-border overflow-x-auto no-scrollbar">
          <TabsTrigger 
            value="overview" 
            className="rounded-xl px-8 h-12 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-bold transition-all gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            Vista General
          </TabsTrigger>
          <TabsTrigger 
            value="payments" 
            className="rounded-xl px-8 h-12 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-bold transition-all gap-2"
          >
            <DollarSign className="h-4 w-4" />
            Pagos y Finanzas
          </TabsTrigger>
          <TabsTrigger 
            value="academic" 
            className="rounded-xl px-8 h-12 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-bold transition-all gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Control Académico
          </TabsTrigger>
          <TabsTrigger 
            value="config" 
            className="rounded-xl px-8 h-12 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-bold transition-all gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Configuraciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4 border-border rounded-3xl overflow-hidden shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Crecimiento de Matrículas</CardTitle>
                <CardDescription>Comparativa mensual de nuevos estudiantes registrados.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-muted/50 m-6 rounded-2xl border-2 border-dashed border-border">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <PieChart className="h-10 w-10 opacity-20" />
                  <span className="text-sm font-medium italic">Gráfico de barras interactivo aquí</span>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 border-border rounded-3xl overflow-hidden shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">Pagos Recientes</CardTitle>
                  <CardDescription>Últimas transacciones del día.</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-primary font-bold">Ver Todo</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted transition-colors border border-transparent hover:border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">{payment.student}</span>
                        <span className="text-xs text-muted-foreground font-medium">{payment.date}</span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="text-sm font-black text-foreground">{payment.amount}</span>
                      <Badge className={`text-[10px] h-5 rounded-md border-0 ${payment.status === 'Completado' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
           <Card className="border-border rounded-3xl overflow-hidden shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">Estado de Pagos por Curso</CardTitle>
                  <CardDescription>Control de ingresos mensuales por categoría.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl font-bold">PDF</Button>
                  <Button variant="outline" size="sm" className="rounded-xl font-bold">Excel</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { label: "Diplomados", value: 75, amount: "S/ 85,000", color: "bg-primary" },
                    { label: "Cursos Cortos", value: 45, amount: "S/ 32,560", color: "bg-emerald-500" },
                    { label: "Seminarios", value: 20, amount: "S/ 7,000", color: "bg-orange-500" },
                  ].map((row) => (
                    <div key={row.label} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-foreground">{row.label}</span>
                        <span className="font-black text-primary">{row.amount}</span>
                      </div>
                      <Progress value={row.value} className={`h-2 ${row.color}`} />
                    </div>
                  ))}
                </div>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
           <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-border rounded-3xl overflow-hidden shadow-sm p-6 text-center space-y-4">
                 <div className="h-16 w-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto ring-1 ring-blue-500/20">
                    <Users className="h-8 w-8" />
                 </div>
                 <h3 className="text-xl font-black text-foreground">Control de Estudiantes</h3>
                 <p className="text-muted-foreground text-sm">Verifica la asistencia y el progreso académico detallado.</p>
                 <Button className="w-full h-12 rounded-xl bg-primary text-primary-foreground gap-2 font-bold group">
                    Ir al Dashboard Académico
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                 </Button>
              </Card>

              <Card className="border-border rounded-3xl overflow-hidden shadow-sm p-6 text-center space-y-4">
                 <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto ring-1 ring-emerald-500/20">
                    <BookOpen className="h-8 w-8" />
                 </div>
                 <h3 className="text-xl font-black text-foreground">Reporte de Cursos</h3>
                 <p className="text-muted-foreground text-sm">Descarga los informes de finalización y promedios.</p>
                 <Button variant="outline" className="w-full h-12 rounded-xl gap-2 font-bold border-border">
                    Ver Informes en PDF
                 </Button>
              </Card>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
