"use client"

import {
  CreditCard,
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  ArrowUpRight,
  ChevronDown,
  DollarSign,
  Calendar,
  User,
  GraduationCap,
  Clock,
} from "lucide-react"

import { cn } from "@/lib/utils"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const payments = [
  { id: "PAY-001", student: "María Garcia", course: "Marketing Digital", amount: "S/ 450.00", date: "04 Apr, 2026", status: "Completado", method: "Tarjeta de Crédito" },
  { id: "PAY-002", student: "Juan Pérez", course: "Gestión de Proyectos", amount: "S/ 1,200.00", date: "03 Apr, 2026", status: "Pendiente", method: "Transferencia" },
  { id: "PAY-003", student: "Ana Martínez", course: "Excel Avanzado", amount: "S/ 380.00", date: "03 Apr, 2026", status: "Completado", method: "Efectivo" },
  { id: "PAY-004", student: "Carlos Ruiz", course: "Ciberseguridad", amount: "S/ 950.00", date: "02 Apr, 2026", status: "Completado", method: "PayPal" },
  { id: "PAY-005", student: "Lucía Fernández", course: "UX/UI Design", amount: "S/ 620.00", date: "01 Apr, 2026", status: "Anulado", method: "Transferencia" },
  { id: "PAY-006", student: "Roberto Gomez", course: "Python Masterclass", amount: "S/ 800.00", date: "01 Apr, 2026", status: "Completado", method: "Tarjeta de Débito" },
]

export default function PagosPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Control de Pagos
          </h1>
          <p className="text-muted-foreground font-medium">Gestiona y monitorea todos los ingresos financieros de la plataforma.</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="rounded-2xl h-12 gap-2 font-bold border-border">
             <Download className="h-5 w-5 text-muted-foreground" />
             Exportar
           </Button>
           <Button className="rounded-2xl h-12 bg-primary hover:bg-primary/90 gap-2 font-black shadow-lg shadow-primary/20 text-primary-foreground">
             <Plus className="h-5 w-5" />
             Registrar Pago
           </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
         {[
           { title: "RECAUDACIÓN TOTAL", value: "S/ 124,560", icon: DollarSign, color: "text-blue-600", bg: "bg-blue-500/10" },
           { title: "PENDIENTES", value: "S/ 12,400", icon: Clock, color: "text-amber-600", bg: "bg-amber-500/10" },
           { title: "MATRÍCULAS MES", value: "148", icon: GraduationCap, color: "text-rose-600", bg: "bg-rose-500/10" },
           { title: "NUEVOS ABONOS", value: "24", icon: Plus, color: "text-emerald-600", bg: "bg-emerald-500/10" },
         ].map((stat) => (
           <Card key={stat.title} className="border-0 shadow-sm rounded-3xl overflow-hidden p-6 relative group hover:shadow-md transition-all">
              <div className="flex flex-col gap-4">
                 <div className={`${stat.bg} ${stat.color} h-12 w-12 rounded-2xl flex items-center justify-center ring-1 ring-${stat.color.split('-')[1]}/10`}>
                   <stat.icon className="h-6 w-6" />
                 </div>
                 <div className="space-y-0.5">
                   <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase leading-none">{stat.title}</p>
                   <p className="text-2xl font-black text-foreground leading-none">{stat.value}</p>
                 </div>
              </div>
           </Card>
         ))}
      </div>

      <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-card">
        <CardHeader className="p-8 border-b border-border space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
            <div className="relative flex-1 max-w-md group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
               <Input 
                 placeholder="Buscar pagos, alumnos, código..." 
                 className="pl-12 h-14 bg-muted/50 border-border rounded-2xl focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary/20 transition-all font-medium text-sm"
               />
            </div>
            <div className="flex items-center gap-4 flex-wrap">
               <Button variant="outline" className="h-14 rounded-2xl font-bold border-border bg-background gap-2 px-6">
                  <Filter className="h-5 w-5 text-muted-foreground" />
                  Filtrar por Estado
                  <ChevronDown className="h-4 w-4 text-muted-foreground ml-2" />
               </Button>
               <Button variant="outline" className="h-14 rounded-2xl font-bold border-border bg-background gap-2 px-6">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  Fecha
                  <ChevronDown className="h-4 w-4 text-muted-foreground ml-2" />
               </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="py-6 px-8 text-[11px] font-black uppercase text-muted-foreground tracking-widest">ID TRANSACCIÓN</TableHead>
                <TableHead className="py-6 px-8 text-[11px] font-black uppercase text-muted-foreground tracking-widest">ESTUDIANTE / CURSO</TableHead>
                <TableHead className="py-6 px-8 text-[11px] font-black uppercase text-muted-foreground tracking-widest">MONTO</TableHead>
                <TableHead className="py-6 px-8 text-[11px] font-black uppercase text-muted-foreground tracking-widest">ESTADO</TableHead>
                <TableHead className="py-6 px-8 text-[11px] font-black uppercase text-muted-foreground tracking-widest">MÉTODO</TableHead>
                <TableHead className="py-6 px-8 text-[11px] font-black uppercase text-muted-foreground tracking-widest text-right">ACCIONES</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id} className="border-b border-border hover:bg-muted/70 transition-colors group">
                  <TableCell className="px-8 py-5">
                    <span className="font-mono text-sm font-bold text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity">{p.id}</span>
                  </TableCell>
                  <TableCell className="px-8 py-5">
                     <div className="flex flex-col">
                        <span className="text-sm font-black text-foreground leading-none">{p.student}</span>
                        <span className="text-xs font-bold text-primary mt-1 opacity-70 leading-none">{p.course}</span>
                     </div>
                  </TableCell>
                  <TableCell className="px-8 py-5">
                    <span className="text-sm font-black text-foreground">{p.amount}</span>
                  </TableCell>
                  <TableCell className="px-8 py-5">
                    <Badge className={cn(
                      "text-[10px] font-black rounded-full px-4 py-1 border-0 shadow-sm",
                      p.status === "Completado" && "bg-emerald-500/10 text-emerald-600",
                      p.status === "Pendiente" && "bg-amber-500/10 text-amber-600",
                      p.status === "Anulado" && "bg-rose-500/10 text-rose-600",
                    )}>
                      {p.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-8 py-5 items-center gap-2 flex">
                    <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center">
                       <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">{p.method}</span>
                  </TableCell>
                  <TableCell className="px-8 py-5 text-right">
                    <Button variant="ghost" size="icon" className="h-10 w-10 border border-transparent hover:border-border hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-all">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="p-8 bg-muted/30 flex items-center justify-between border-t border-border">
           <span className="text-sm font-bold text-muted-foreground uppercase tracking-tighter">MOSTRANDO 6 DE 124 REGISTROS</span>
           <div className="flex gap-2">
              <Button variant="outline" className="h-10 px-6 rounded-xl font-bold border-border bg-background">Anterior</Button>
              <Button variant="outline" className="h-10 px-6 rounded-xl font-bold border-border bg-background shadow-sm ring-1 ring-primary/5">Siguiente</Button>
           </div>
        </div>
      </Card>
    </div>
  )
}

