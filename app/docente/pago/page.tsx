"use client"

import { useState } from "react"
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Calendar,
  Download,
  Filter,
  Search,
  Eye,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const paymentsData = [
  {
    id: "PAG-001",
    student: "Juan Pérez",
    course: "Diplomado en Marketing Digital",
    amount: "S/. 450.00",
    date: "2024-01-15",
    status: "completed",
    method: "Tarjeta de Crédito",
  },
  {
    id: "PAG-002",
    student: "María García",
    course: "Gestión de Proyectos con PMP",
    amount: "S/. 380.00",
    date: "2024-01-14",
    status: "pending",
    method: "Transferencia Bancaria",
  },
  {
    id: "PAG-003",
    student: "Carlos López",
    course: "Excel Avanzado para Finanzas",
    amount: "S/. 280.00",
    date: "2024-01-13",
    status: "completed",
    method: "Yape",
  },
  {
    id: "PAG-004",
    student: "Ana Martínez",
    course: "Diplomado en Marketing Digital",
    amount: "S/. 450.00",
    date: "2024-01-12",
    status: "failed",
    method: "Tarjeta de Débito",
  },
]

const statsCards = [
  {
    title: "Total Recaudado",
    value: "S/. 1,210.00",
    badge: "Este mes",
    icon: DollarSign,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    iconBg: "bg-emerald-100/50",
    trend: "+12.5%",
  },
  {
    title: "Pagos Pendientes",
    value: "S/. 380.00",
    badge: "2 transacciones",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    iconBg: "bg-amber-100/50",
    trend: "+1",
  },
  {
    title: "Pagos Completados",
    value: "28",
    badge: "Este mes",
    icon: CheckCircle,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-100/50",
    trend: "+8",
  },
  {
    title: "Tasa de Conversión",
    value: "93.3%",
    badge: "Éxito",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    iconBg: "bg-purple-100/50",
    trend: "+2.1%",
  },
]

export default function PagosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Completado</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Pendiente</Badge>
      case "failed":
        return <Badge className="bg-rose-100 text-rose-700 border-rose-200">Fallido</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-amber-600" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-rose-600" />
      default:
        return null
    }
  }

  const filteredPayments = paymentsData.filter(payment => {
    const matchesSearch = payment.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || payment.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-primary" />
            Gestión de Pagos
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Administra y monitorea todas las transacciones de los estudiantes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar Reporte
          </Button>
          <Button className="gap-2">
            <CreditCard className="h-4 w-4" />
            Nuevo Pago
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="border border-border shadow-sm rounded-2xl overflow-hidden relative group">
            <CardContent className="py-4 px-6">
              <div className="flex items-start justify-between">
                <div className={`${stat.iconBg} ${stat.color} p-2 rounded-2xl mb-3`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-tight">
                  {stat.badge}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
                <p className="text-xl font-black text-slate-800">{stat.value}</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-emerald-600" />
                  <span className="text-[10px] font-bold text-emerald-600">{stat.trend}</span>
                </div>
              </div>
              <div className={`absolute top-0 right-0 h-24 w-24 ${stat.bgColor} rounded-full -mr-12 -mt-12 opacity-50 z-0`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Card className="border-0 shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="px-8 py-6 border-b border-slate-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-extrabold tracking-tight text-foreground">
                Historial de Pagos
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Todas las transacciones realizadas en la plataforma
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar pagos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 w-64 bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary/20"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filtrar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                    Todos los estados
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterStatus("completed")}>
                    Completados
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                    Pendientes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("failed")}>
                    Fallidos
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-100">
                  <TableHead className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    ID Transacción
                  </TableHead>
                  <TableHead className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Estudiante
                  </TableHead>
                  <TableHead className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Curso
                  </TableHead>
                  <TableHead className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Monto
                  </TableHead>
                  <TableHead className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Método
                  </TableHead>
                  <TableHead className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Fecha
                  </TableHead>
                  <TableHead className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Estado
                  </TableHead>
                  <TableHead className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="px-8 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-slate-700">
                          {payment.id}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-4">
                      <div className="font-medium text-slate-800">{payment.student}</div>
                    </TableCell>
                    <TableCell className="px-8 py-4">
                      <div className="text-sm text-slate-600">{payment.course}</div>
                    </TableCell>
                    <TableCell className="px-8 py-4">
                      <div className="font-black text-slate-900">{payment.amount}</div>
                    </TableCell>
                    <TableCell className="px-8 py-4">
                      <div className="text-sm text-slate-600">{payment.method}</div>
                    </TableCell>
                    <TableCell className="px-8 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="h-4 w-4" />
                        {payment.date}
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payment.status)}
                        {getStatusBadge(payment.status)}
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="gap-2">
                            <Eye className="h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <FileText className="h-4 w-4" />
                            Generar recibo
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {payment.status === "pending" && (
                            <DropdownMenuItem className="gap-2 text-emerald-600">
                              <CheckCircle className="h-4 w-4" />
                              Confirmar pago
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}