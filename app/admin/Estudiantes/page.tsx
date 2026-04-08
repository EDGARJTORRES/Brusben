"use client"

import { useState } from "react"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Calendar,
  Filter,
  Download,
  UserCheck,
  UserX,
  Clock,
  ArrowUpDown,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react"

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const students = [
  {
    id: "EST-001",
    name: "María García",
    email: "maria.garcia@email.com",
    phone: "+51 987 654 321",
    joinDate: "2024-01-15",
    status: "Activo",
    courses: 3,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    lastLogin: "2 min ago"
  },
  {
    id: "EST-002",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@email.com",
    phone: "+51 912 345 678",
    joinDate: "2024-01-14",
    status: "Inactivo",
    courses: 1,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    lastLogin: "3 days ago"
  },
  {
    id: "EST-003",
    name: "Ana Rodríguez",
    email: "ana.rodriguez@email.com",
    phone: "+51 999 888 777",
    joinDate: "2024-01-14",
    status: "Activo",
    courses: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    lastLogin: "Online"
  },
  {
    id: "EST-004",
    name: "Luis Fernández",
    email: "luis.fernandez@email.com",
    phone: "+51 944 555 666",
    joinDate: "2024-01-13",
    status: "Activo",
    courses: 2,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luis",
    lastLogin: "5 hours ago"
  },
  {
    id: "EST-005",
    name: "Patricia Sánchez",
    email: "patricia.sanchez@email.com",
    phone: "+51 922 333 444",
    joinDate: "2024-01-12",
    status: "Pendiente",
    courses: 0,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Patricia",
    lastLogin: "Never"
  },
]

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight">Gestión de Estudiantes</h1>
          <p className="text-muted-foreground font-medium">Control centralizado de matrículas y perfiles de alumnos.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 h-11 px-6 rounded-xl border-border font-bold text-muted-foreground hover:bg-muted transition-all">
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
          <Button className="gap-2 h-11 px-6 rounded-xl bg-primary transition-all duration-200 font-bold">
            <Plus className="h-4 w-4" />
            Nuevo Estudiante
          </Button>
        </div>
      </div>

      {/* Quick Summary Cards (Modern Mini Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm bg-blue-600 p-6 rounded-2xl text-white relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 bg-white/10 h-24 w-24 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Total Alumnos</p>
          <p className="text-3xl font-bold">1,280</p>
        </Card>
        <Card className="border-0 shadow-sm bg-emerald-600 p-6 rounded-2xl text-white relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 bg-white/10 h-24 w-24 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Activos Ahora</p>
          <p className="text-3xl font-bold">45</p>
        </Card>
        <Card className="border-0 shadow-sm bg-slate-900 p-6 rounded-2xl text-white relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 bg-white/10 h-24 w-24 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Tasa Retención</p>
          <p className="text-3xl font-bold">92%</p>
        </Card>
      </div>

      <Card className="border border-border shadow-sm rounded-2xl overflow-hidden bg-background">
        <CardHeader className="p-8 border-b border-border">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Buscar por nombre, ID o correo..."
                className="pl-12 h-12 w-full bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/10 transition-all rounded-xl text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="h-12 w-12 rounded-xl border border-border text-muted-foreground hover:text-primary transition-all">
                <Filter className="h-5 w-5" />
              </Button>
              <div className="h-8 w-[1px] bg-border mx-2" />
              <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                VER POR
                <Button variant="ghost" className="h-10 text-primary font-bold hover:bg-transparent">RECIENTES</Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-b border-border h-14">
                <TableHead className="px-10 font-bold text-muted-foreground text-[11px] uppercase tracking-widest">Estudiante</TableHead>
                <TableHead className="font-bold text-muted-foreground text-[11px] uppercase tracking-widest">Identificador</TableHead>
                <TableHead className="font-bold text-muted-foreground text-[11px] uppercase tracking-widest">Rendimiento</TableHead>
                <TableHead className="font-bold text-muted-foreground text-[11px] uppercase tracking-widest">Actividad</TableHead>
                <TableHead className="font-bold text-muted-foreground text-[11px] uppercase tracking-widest">Estado</TableHead>
                <TableHead className="text-right px-10 font-bold text-muted-foreground text-[11px] uppercase tracking-widest">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id} className="group hover:bg-muted/50 transition-colors border-b border-border last:border-0 h-20">
                  <TableCell className="px-10">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12 rounded-full ring-2 ring-background shadow-md ring-offset-2 transition-transform group-hover:scale-105">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback className="bg-muted text-muted-foreground font-bold text-sm">
                            {student.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        {student.lastLogin === "Online" && (
                          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-background ring-1 ring-emerald-200" />
                        )}
                      </div>
                      <div className="flex flex-col space-y-0.5">
                        <span className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{student.name}</span>
                        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                          <Mail className="h-3 w-3" />
                          {student.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2.5 py-1 bg-muted rounded-lg font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                      {student.id}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between w-32">
                        <span className="text-[10px] font-bold text-muted-foreground">{student.courses} cursos</span>
                        <span className="text-[10px] font-bold text-foreground">{student.courses > 3 ? '85%' : '42%'}</span>
                      </div>
                      <div className="h-1.5 w-32 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${student.courses > 3 ? 'bg-violet-500 w-[85%]' : 'bg-blue-500 w-[42%]'}`}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <Clock className="h-3.5 w-3.5" />
                      {student.lastLogin}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {student.status === "Activo" ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full ring-1 ring-emerald-100 text-[11px] font-bold shadow-sm">
                          <CheckCircle2 className="h-3 w-3" />
                          {student.status.toUpperCase()}
                        </div>
                      ) : student.status === "Inactivo" ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-full ring-1 ring-rose-100 text-[11px] font-bold shadow-sm">
                          <XCircle className="h-3 w-3" />
                          {student.status.toUpperCase()}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full ring-1 ring-amber-100 text-[11px] font-bold shadow-sm">
                          <AlertCircle className="h-3 w-3" />
                          {student.status.toUpperCase()}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-10 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
                          <MoreVertical className="h-5 w-5" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[180px] p-2 rounded-xl shadow-xl border-border">
                        <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground px-3 pb-2">Opciones Estudiante</DropdownMenuLabel>
                        <DropdownMenuItem className="rounded-lg h-10 px-3 cursor-pointer font-medium hover:bg-muted">
                          <UserCheck className="mr-2 h-4 w-4 text-emerald-500" /> Ver Perfil Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg h-10 px-3 cursor-pointer font-medium hover:bg-muted">
                          <Mail className="mr-2 h-4 w-4 text-blue-500" /> Enviar Correo
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-2 bg-border" />
                        <DropdownMenuItem className="rounded-lg h-10 px-3 cursor-pointer font-bold text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-500/10">
                          <UserX className="mr-2 h-4 w-4" /> Suspender
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="p-8 bg-muted/50 border-t border-border flex items-center justify-between">
          <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Página 1 de 64</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 rounded-lg border-border font-bold px-4" disabled>Anterior</Button>
            <Button variant="outline" size="sm" className="h-9 rounded-lg border-border font-bold px-4 bg-background shadow-sm ring-1 ring-primary/20 text-primary hover:bg-background transition-none">1</Button>
            <Button variant="outline" size="sm" className="h-9 rounded-lg border-border font-bold px-4 hover:bg-background">2</Button>
            <Button variant="outline" size="sm" className="h-9 rounded-lg border-border font-bold px-4">Siguiente</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
