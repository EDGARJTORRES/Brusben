"use client"

import {
  TrendingUp,
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  UserPlus,
  Plus,
  Hand ,
  FileText
} from "lucide-react"
import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"

/* =========================
   TYPES (IMPORTANTE TS)
========================= */

type Course = {
  estCurso: string
}

type Student = {
  idRol: number
  activo: boolean
}

type Payment = {
  fechaPago: string
  monto: number | string
}

/* =========================
   COMPONENT
========================= */

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  const [courses, setCourses] = useState<Course[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [chartData, setChartData] = useState({
    categorias: [] as string[],
    data: [] as number[]
  })
  const [topCourses, setTopCourses] = useState<any[]>([])

  const [totalPagosHoy, setTotalPagosHoy] = useState(0)
  const [totalCursosActivos, setTotalCursosActivos] = useState(0)
  const [totalEstudiantesActivos, setTotalEstudiantesActivos] = useState(0)
  const [totalIngresosMes, setTotalIngresosMes] = useState(0)
  const KpiCard = ({ title, value, icon, color }: any) => (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-5 shadow hover:scale-[1.02] transition">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-slate-500">{title}</p>
          <p className="text-2xl font-black">{value}</p>
        </div>
        <div className="p-3 rounded-2xl bg-slate-100">
          {icon}
        </div>
      </div>
    </div>
  )

  type ActionButtonProps = {
    icon: React.ReactNode;
    text: string;
    onClick: () => void;
  };

  const ActionButton = ({ icon, text, onClick }: ActionButtonProps) => {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 p-3 rounded-xl 
                  bg-white/5 transition-all duration-200 group"
      >
        {/* ICONO */}
        <div
          className="p-2 rounded-xl 
                    bg-white/10 backdrop-blur-md 
                    border border-white/10 
                    shadow-sm
                    group-hover:scale-105 transition"
        >
          <div className="text-green-500">
            {icon}
          </div>
        </div>

        {/* TEXTO */}
        <span className="text-sm font-semibold tracking-tight">
          {text}
        </span>
      </button>
    );
  };

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [coursesRes, studentsRes, paymentsRes] = await Promise.all([
        fetch("http://localhost:8081/api/cursos"),
        fetch("http://localhost:8081/api/usuarios"),
        fetch("http://localhost:8081/api/pagos")
      ])

      const coursesData: Course[] = await coursesRes.json()
      const studentsData: Student[] = await studentsRes.json()
      const paymentsData: Payment[] = await paymentsRes.json()

      setCourses(coursesData)
      setStudents(studentsData)
      setPayments(paymentsData)

      /* =========================
         CALCULOS SEGUROS
      ========================= */

      const today = new Date().toISOString().split("T")[0]

      const totalPagosHoy = paymentsData.filter((p: any) => {
        const pagoFecha = new Date(p.date).toISOString().split("T")[0]

        return pagoFecha === today && p.status === "PAGADO"
      }).length

      // Cursos activos
      const totalCursosActivos = coursesData.filter(
        (c: Course) => c.estCurso === "A"
      ).length

      // Estudiantes activos (normalizado)
      const totalEstudiantesActivos = studentsData.filter((s: Student) => {
        return Number(s.idRol) === 3 && s.activo === true
      }).length

      // Ingresos mes (seguro)
      const safePayments = Array.isArray(paymentsData) ? paymentsData : []

      const totalIngresosMes = safePayments.reduce((acc, p: Payment) => {
        const monto = Number(p?.monto ?? 0)
        return acc + (isNaN(monto) ? 0 : monto)
      }, 0)


      const pagados = paymentsData.filter(
        (p: any) => p.status === "PAGADO"
      )

      const agrupadoPorFecha: Record<string, number> = {}

      pagados.forEach((p: any) => {
        const fecha = new Date(p.date).toISOString().split("T")[0]

        agrupadoPorFecha[fecha] = (agrupadoPorFecha[fecha] || 0) + 1
      })

      const categorias = Object.keys(agrupadoPorFecha).sort()
      const dataGrafico = categorias.map(fecha => agrupadoPorFecha[fecha])

      // Agrupar por curso
      const agrupado: Record<string, number> = {}

      pagados.forEach((p: any) => {
        const curso = p.course
        agrupado[curso] = (agrupado[curso] || 0) + 1
      })

      // convertir a array
      const cursosOrdenados = Object.entries(agrupado)
        .map(([name, count], index) => ({
          rank: `${index + 1}º`,
          name,
          sales: `${count} Alum.`,
          demand: `${Math.min(100, count * 10)}%`,
          progress: Math.min(100, count * 10)
        }))
        .sort((a, b) => Number(b.sales.replace(/\D/g, "")) - Number(a.sales.replace(/\D/g, "")))
        .slice(0, 3)

      setTopCourses(cursosOrdenados)

      setChartData({
        categorias,
        data: dataGrafico
      })
      setTotalPagosHoy(totalPagosHoy)
      setTotalCursosActivos(totalCursosActivos)
      setTotalEstudiantesActivos(totalEstudiantesActivos)
      setTotalIngresosMes(totalIngresosMes)
      

    } catch (e) {
      console.error("Error al cargar datos", e)
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <Hand  className="h-8 w-8 text-primary"/>
             ¡Bienvenido, {user?.nombre || "Admin"}! 
          </h1>
          <p className="text-muted-foreground">
            Este es el resumen de lo que está pasando hoy en <span className="text-primary font-bold">Brusben</span>.
          </p>
        </div>
        {/* Date Badge */}
        <div className="flex items-center gap-4 bg-card p-3 px-5 rounded-2xl border border-border shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              FECHA DE HOY
            </span>
            <span className="text-sm font-bold text-foreground">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "MATRÍCULAS DE HOY",
            value: totalPagosHoy,
            badge: "HOY",
            icon: ShoppingCart,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            iconBg: "bg-blue-100/50"
          },
          {
            title: "CURSOS ACTIVOS",
            value: totalCursosActivos,
            badge: "Del día",
            icon: Package,
            color: "text-rose-600",
            bgColor: "bg-rose-50",
            iconBg: "bg-rose-100/50"
          },
          {
            title: "ESTUDIANTES ACTIVOS",
            value: totalEstudiantesActivos,
            badge: "Registrados",
            icon: Users,
            color: "text-slate-600",
            bgColor: "bg-slate-50",
            iconBg: "bg-slate-100/50"
          },
          {
            title: "INGRESOS DEL MES",
            value: `S/ ${totalIngresosMes}`,
            badge: "Mes",
            icon: DollarSign,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            iconBg: "bg-emerald-100/50"
          },
        ].map((stat) => (
          <Card key={stat.title} className="border-0 shadow-xl rounded-2xl overflow-hidden relative group">
            <CardContent className="py-2 px-4">
              <div className="flex items-start justify-between">
                <div className={`${stat.iconBg} ${stat.color} p-2 rounded-xl mb-4`}>
                  <stat.icon className="h-7 w-7" />
                </div>
                <Badge variant="secondary" className={`bg-muted ${stat.color} border-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-tight`}>
                  {stat.badge}
                </Badge>
              </div>
              <div className="space-y-1 relative z-10">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{stat.title}</p>
                <p className="text-2xl font-black text-foreground">{stat.value}</p>
              </div>
              {/* Background accent */}
              <div className={`absolute top-0 -right-20 h-32 w-32 ${stat.bgColor} rounded-full mr-10 mt-30 opacity-50 z-0`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* LEFT */}
        <div className="lg:col-span-8 backdrop-blur-xl rounded-3xl shadow-xl bg-card h-full">
          <Card className="h-full border-0 overflow-hidden flex flex-col"> 
            
            <CardHeader className="px-8 border-b border-border flex flex-row items-center justify-between"> 
              <CardTitle className="text-xl font-bold text-foreground">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-blue-100">
                    <Package className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">Cursos con más Alumnos</h2>
                    <p className="text-xs text-slate-500">
                      Cursos con más inscripciones
                    </p>
                  </div>
                </div>
              </CardTitle> 
            </CardHeader> 

            {/* ESTE CRECE */}
            <CardContent className="flex-1">
              {topCourses.map((course) => ( 
                <div key={course.name} className="flex items-center gap-6 group mb-4"> 
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black text-lg ring-1 ring-blue-500/20">
                    {course.rank}
                  </div> 

                  <div className="flex-1 space-y-3"> 
                    <div className="flex items-center justify-between"> 
                      <span className="font-bold text-foreground text-sm tracking-tight group-hover:text-primary transition-colors cursor-pointer capitalize">
                        {course.name.toLowerCase()}
                      </span> 

                      <div className="text-right"> 
                        <span className="text-sm font-black text-foreground">{course.sales}</span> 
                        <span className="text-[10px] block text-muted-foreground font-bold uppercase">
                          {course.demand} demanda
                        </span> 
                      </div> 
                    </div> 

                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden"> 
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out shadow-sm"
                        style={{ width: `${course.progress}%` }}
                      /> 
                    </div> 
                  </div> 
                </div> 
              ))} 
            </CardContent> 

          </Card>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-4 space-y-5 h-full flex flex-col">

          {/* ACCIONES */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex-1 flex flex-col">
            <h3 className="font-black text-xl mb-2">Acciones rápidas</h3>
            <p className="text-slate-400 text-sm mb-5">
              Gestión principal del sistema
            </p>

            <div className="space-y-3 flex-1">

              <ActionButton
                icon={<DollarSign className="w-5 h-5" />}
                text="Ver Pagos"
                onClick={() => router.push("/admin/Pagos")}
              />

              <ActionButton
                icon={<UserPlus className="w-5 h-5" />}
                text="Nuevo Estudiante"
                onClick={() => router.push("/admin/Usuarios")}
              />

              <ActionButton
                icon={<Plus className="w-5 h-5" />}
                text="Agregar Curso"
                onClick={() => router.push("/admin/Cursos")}
              />

              <ActionButton
                icon={<FileText className="w-5 h-5" />}
                text="Ver Reportes"
                onClick={() => router.push("/admin/Reportes")}
              />

            </div>
          </div>

        </div>

      </div>

      {/* CHART */}
      <div className="bg-card backdrop-blur-xl rounded-3xl  shadow-xl p-6">

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-center">

          {/* LEFT SIDE */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-start gap-6 w-full">

            <div className="flex items-center gap-3 text-center lg:text-left">
              <div className="p-3 rounded-2xl bg-blue-100">
                <Package className="text-blue-600" />
              </div>

              <div>
                <h2 className="font-bold text-lg">Pagos por día</h2>
                <p className="text-xs text-slate-500">
                  Actividad de pagos 
                </p>
              </div>
            </div>

            {/* IMAGEN */}
            <div className="flex justify-center w-full">
              <img
               src="/images/imgseguridad.png"
                alt="pagos modernos"
                className="w-40 h-40 sm:w-36 sm:h-36 lg:w-44 lg:h-44 object-contain opacity-90"
              />
            </div>

          </div>

          {/* RIGHT SIDE (CHART) */}
          <div className="lg:col-span-9 w-full">
            <div className="w-full overflow-x-auto">
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  chart: {
                    type: "column",
                    backgroundColor: "transparent",
                    height: window.innerWidth < 640 ? 300 : 400
                  },
                  title: { text: "" },
                  xAxis: {
                    categories: chartData.categorias
                  },
                  yAxis: {
                    title: { text: "" }
                  },
                  legend: { enabled: false },
                  tooltip: {
                    formatter: function (this: any): string {
                      return `<b>${this.y}</b> pagos`;
                    }
                  },
                  series: [
                    {
                      type: "column",
                      data: chartData.data,
                      color: "#3b82f6"
                    }
                  ]
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
    
  )

}
