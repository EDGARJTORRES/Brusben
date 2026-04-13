"use client"

import { 
  Clock, 
  CheckCircle2, 
  X, 
  AlertCircle,
  Plus, 
  Download,
  DollarSign,
  CreditCard, 
  Filter,
  Calendar,
  GraduationCap,
  ChevronDown,
  Search,
  MoreVertical
} from "lucide-react"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
export default function PagosPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    idUsuario: "",
    idCurso: "",
    monto: "",
    metodoPago: "TRANSFERENCIA",
    nroOperacion: ""
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [payRes, stuRes, curRes] = await Promise.all([
        fetch("http://localhost:8081/api/pagos"),
        fetch("http://localhost:8081/api/usuarios"),
        fetch("http://localhost:8081/api/cursos")
      ])
      setPayments(await payRes.json())
      
      const allUsers = await stuRes.json()
      // Filtrar por rol Estudiante Y que estén ACTIVOS
      const onlyStudents = allUsers.filter((u: any) => {
        const rol = (u.nombreRol || "").toLowerCase()
        return rol === "estudiante" && u.activo === true
      })
      setStudents(onlyStudents)
      
      const allCourses = await curRes.json()
      // Filtrar solo cursos ACTIVOS ('A')
      setCourses(allCourses.filter((c: any) => c.estCurso === "A"))
    } catch (e) {
      toast.error("Error al conectar con la base de datos")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!formData.idUsuario || !formData.idCurso || !formData.monto) {
      toast.warning("Por favor completa los campos obligatorios")
      return
    }

    try {
      const res = await fetch("http://localhost:8081/api/pagos/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      
      if(res.ok) {
        toast.success("¡Pago registrado e inscripción realizada!")
        setIsModalOpen(false)
        setFormData({ idUsuario: "", idCurso: "", monto: "", metodoPago: "TRANSFERENCIA", nroOperacion: "" })
        fetchData()
      } else {
        const error = await res.json()
        toast.error(error.error || "Error al procesar el pago")
      }
    } catch {
      toast.error("Error de conexión con el servidor")
    }
  }

  // --- Cálculos Dinámicos ---
  const totalRecaudado = payments.reduce((acc, p) => {
    const validAmount = typeof p.amount === 'string' ? parseFloat(p.amount.replace(/[^\d.-]/g, "")) : 0
    return acc + (isNaN(validAmount) ? 0 : validAmount)
  }, 0)

  const totalPendientes = payments
    .filter(p => p.status === "PENDIENTE")
    .reduce((acc, p) => {
      const validAmount = typeof p.amount === 'string' ? parseFloat(p.amount.replace(/[^\d.-]/g, "")) : 0
      return acc + (isNaN(validAmount) ? 0 : validAmount)
    }, 0)

  const matriculasMes = payments.length // Simplificado: Total histórico por ahora
  const nuevosAbonos = payments.length > 0 ? 1 : 0 // Placeholder: Podría ser los de hoy

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
             <DollarSign className="h-8 w-8 text-primary" />
             Control de Pagos
          </h1>
          <p className="text-muted-foreground mt-1 font-medium text-sm">Gestiona y monitorea todos los ingresos financieros de la plataforma.</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="rounded-xl h-11 px-6 font-bold border-border gap-2">
             <Download className="h-4 w-4 text-muted-foreground" />
             Exportar
           </Button>
           
           <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
             <DialogTrigger asChild>
               <Button className="rounded-xl h-11 bg-primary hover:bg-primary/90 gap-2 font-black text-primary-foreground shadow-lg shadow-primary/20 transition-all">
                 <Plus className="h-5 w-5" />
                 Registrar Pago
               </Button>
             </DialogTrigger>
             <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
               <div className="p-6 border-b border-border">
                 <DialogTitle className="text-2xl font-black text-foreground">Nueva Inscripción</DialogTitle>
                 <p className="text-sm text-muted-foreground font-medium mt-1">Registra el abono del estudiante para habilitar su acceso al curso.</p>
               </div>
               
               <form onSubmit={handleRegisterPayment} className="p-6 space-y-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Seleccionar Estudiante</label>
                   <Select onValueChange={(val) => setFormData({...formData, idUsuario: val})} value={formData.idUsuario}>
                     <SelectTrigger className="h-12 rounded-xl bg-muted/40 border-0 focus:ring-primary font-bold">
                       <SelectValue placeholder="Busca al alumno..." />
                     </SelectTrigger>
                     <SelectContent className="rounded-xl">
                       {students.map(s => (
                         <SelectItem key={s.idUsuario} value={s.idUsuario.toString()} className="font-medium">
                           {s.nombres}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>

                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Seleccionar Curso</label>
                   <Select onValueChange={(val) => {
                     const curso = courses.find(c => c.idCurso.toString() === val)
                     setFormData({...formData, idCurso: val, monto: curso?.precioCurso?.toString() || ""})
                   }} value={formData.idCurso}>
                     <SelectTrigger className="h-12 rounded-xl bg-muted/40 border-0 focus:ring-primary font-bold">
                       <SelectValue placeholder="Elige el curso..." />
                     </SelectTrigger>
                     <SelectContent className="rounded-xl">
                       {courses.map(c => (
                         <SelectItem key={c.idCurso} value={c.idCurso.toString()} className="font-medium">
                           {c.titulo} - S/ {c.precioCurso}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Monto Pagado</label>
                     <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">S/</span>
                       <Input 
                         type="number"
                         className="h-12 rounded-xl bg-muted/40 border-0 pl-10 focus:ring-primary font-black text-lg" 
                         value={formData.monto}
                         onChange={(e) => setFormData({...formData, monto: e.target.value})}
                       />
                     </div>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Método</label>
                     <Select onValueChange={(val) => setFormData({...formData, metodoPago: val})} value={formData.metodoPago}>
                       <SelectTrigger className="h-12 rounded-xl bg-muted/40 border-0 focus:ring-primary font-bold">
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="TRANSFERENCIA">Transferencia</SelectItem>
                         <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                         <SelectItem value="VISA">VISA / Mastercard</SelectItem>
                         <SelectItem value="YAPE/PLIN">Yape / Plin</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                 </div>

                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nro. de Operación (Opcional)</label>
                   <Input 
                     placeholder="Ej: 9283401"
                     className="h-12 rounded-xl bg-muted/40 border-0 focus:ring-primary font-mono"
                     value={formData.nroOperacion}
                     onChange={(e) => setFormData({...formData, nroOperacion: e.target.value})}
                   />
                 </div>

                 <Button type="submit" className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-black shadow-xl shadow-primary/20">
                   Confirmar e Inscribir
                 </Button>
               </form>
             </DialogContent>
           </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { title: "RECAUDACIÓN TOTAL", value: `S/ ${totalRecaudado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "text-blue-600", bg: "bg-blue-400/10" },
           { title: "PENDIENTES", value: `S/ ${totalPendientes.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, icon: Clock, color: "text-amber-600", bg: "bg-amber-400/10" },
           { title: "MATRÍCULAS MES", value: matriculasMes.toString(), icon: GraduationCap, color: "text-rose-600", bg: "bg-rose-400/10" },
           { title: "NUEVOS ABONOS", value: payments.length > 0 ? "RECIENTE" : "0", icon: Plus, color: "text-emerald-600", bg: "bg-emerald-400/10" },
         ].map((stat) => (
           <Card key={stat.title} className="border-none shadow-sm bg-secondary/30">
              <CardContent className="pt-6">
                 <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.title}: </p>
                      <p className="text-2xl font-black mt-1">{stat.value}</p>
                    </div>
                    <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                 </div>
              </CardContent>
           </Card>
         ))}
      </div>

      <div className="rounded-2xl shadow-sm bg-card border border-border/50 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/50 bg-muted/20 px-6 py-4">
          <h2 className="text-lg font-bold text-foreground">Listado de Pagos</h2>
          <div className="flex items-center gap-4 flex-1 max-w-xl justify-end">
            <div className="relative w-full md:w-80 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Buscar pagos, alumnos..." 
                  className="pl-10 h-10 rounded-xl bg-background border-border/50 focus:ring-primary/20 font-medium text-sm"
                />
            </div>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-b border-border/50 hover:bg-transparent">
              <TableHead className="py-4 px-6 font-bold text-xs uppercase tracking-wider">ID</TableHead>
              <TableHead className="font-bold text-xs">Estudiante / Curso</TableHead>
              <TableHead className="font-bold text-xs">Monto</TableHead>
              <TableHead className="font-bold text-xs">Estado</TableHead>
              <TableHead className="font-bold text-xs">Método</TableHead>
              <TableHead className="text-right font-bold pr-8 text-xs">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-20 text-center font-bold text-muted-foreground animate-pulse">
                  Cargando transacciones bancarias...
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-20 text-center">
                  <div className="flex flex-col items-center opacity-30">
                      <AlertCircle className="h-12 w-12 mb-2" />
                      <p className="font-bold">No hay abonos registrados todavía</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : payments.map((p: any) => (
              <TableRow key={p.idPago} className="border-b border-border hover:bg-muted/70 transition-colors group">
                <TableCell className="px-6 py-4">
                  <span className="font-mono text-sm font-bold text-muted-foreground">#{p.idPago}</span>
                </TableCell>
                <TableCell className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-foreground leading-none">{p.student}</span>
                      <span className="text-xs font-bold text-primary mt-1 opacity-70 leading-none">{p.course}</span>
                    </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-sm font-black text-foreground">{p.amount}</span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge className={cn(
                    "text-[10px] font-black rounded-full px-4 py-1 border-0 shadow-sm",
                    p.status === "COMPLETADO" && "bg-emerald-500/10 text-emerald-600",
                    p.status === "PENDIENTE" && "bg-amber-500/10 text-amber-600",
                    p.status === "ANULADO" && "bg-rose-500/10 text-rose-600",
                  )}>
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 items-center gap-2 flex">
                  <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">{p.method}</span>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <Button variant="ghost" size="icon" className="h-10 w-10 border border-transparent hover:border-border hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-all">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-border/40 bg-muted/10">
           <p className="text-xs text-muted-foreground font-medium">
             Mostrando {" "}
             <span className="font-bold text-foreground">{payments.length}</span> de {" "}
             <span className="font-bold text-foreground">{payments.length}</span> pagos
           </p>
           <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-9 rounded-xl border-border/50 font-bold px-4">Anterior</Button>
              <Button variant="outline" size="sm" className="h-9 rounded-xl border-border/50 font-bold px-4 bg-background shadow-sm ring-1 ring-primary/5 text-primary transition-none">1</Button>
              <Button variant="outline" size="sm" className="h-9 rounded-xl border-border/50 font-bold px-4 hover:bg-background">Siguiente</Button>
           </div>
        </div>
      </div>
    </div>
  )
}
