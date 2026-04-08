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
  AlertCircle,
  MessageSquare,
  Users
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
    course: "Marketing Digital",
    status: "Activo",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    lastLogin: "Online"
  },
  {
    id: "EST-002",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@email.com",
    course: "Gestión PMP",
    status: "Offline",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    lastLogin: "3 days ago"
  },
  {
    id: "EST-003",
    name: "Ana Rodríguez",
    email: "ana.rodriguez@email.com",
    course: "Excel Avanzado",
    status: "Activo",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    lastLogin: "Online"
  },
  {
    id: "EST-004",
    name: "Luis Fernández",
    email: "luis.fernandez@email.com",
    course: "Marketing Digital",
    status: "Activo",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luis",
    lastLogin: "5 hours ago"
  },
]

export default function ClassmatesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 leading-tight">Compañeros de Clase</h1>
          <p className="text-slate-500 font-medium">Conéctate con otros estudiantes de tus programas académicos.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 h-11 px-6 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <MessageSquare className="h-4 w-4" />
            Ver Mis Mensajes
          </Button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm bg-primary p-6 rounded-2xl text-white relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 bg-white/10 h-24 w-24 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Compañeros Totales</p>
          <p className="text-3xl font-bold">1,280</p>
        </Card>
        <Card className="border-0 shadow-sm bg-emerald-600 p-6 rounded-2xl text-white relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 bg-white/10 h-24 w-24 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Online Ahora</p>
          <p className="text-3xl font-bold">45</p>
        </Card>
      </div>

      <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="p-8 border-b border-slate-50">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Buscar compañeros..."
                className="pl-12 h-12 w-full bg-slate-100/50 border-0 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/10 transition-all rounded-xl text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/30">
              <TableRow className="border-b border-slate-100 h-14">
                <TableHead className="px-10 font-bold text-slate-600 text-[11px] uppercase tracking-widest">Compañero</TableHead>
                <TableHead className="font-bold text-slate-600 text-[11px] uppercase tracking-widest">Curso Compartido</TableHead>
                <TableHead className="font-bold text-slate-600 text-[11px] uppercase tracking-widest">Actividad</TableHead>
                <TableHead className="font-bold text-slate-600 text-[11px] uppercase tracking-widest">Estado</TableHead>
                <TableHead className="text-right px-10 font-bold text-slate-600 text-[11px] uppercase tracking-widest">Chat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0 h-20">
                  <TableCell className="px-10">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12 rounded-full ring-2 ring-white shadow-md ring-offset-2 transition-transform group-hover:scale-105">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-sm">
                            {student.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        {student.lastLogin === "Online" && (
                          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-200" />
                        )}
                      </div>
                      <div className="flex flex-col space-y-0.5">
                        <span className="font-bold text-slate-900 text-sm group-hover:text-primary transition-colors">{student.name}</span>
                        <span className="text-xs text-slate-400 font-medium">{student.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-lg text-[10px] font-bold border-slate-100 text-slate-400 tracking-wider h-6 px-2">
                      {student.course.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <Clock className="h-3.5 w-3.5" />
                      {student.lastLogin}
                    </div>
                  </TableCell>
                  <TableCell>
                    {student.lastLogin === "Online" ? (
                      <Badge className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 border-0 text-[10px] uppercase font-bold">En Línea</Badge>
                    ) : (
                      <Badge className="bg-slate-50 text-slate-500 ring-1 ring-slate-100 border-0 text-[10px] uppercase font-bold">Desconectado</Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-10 text-right">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-slate-100 text-primary transition-all shadow-sm">
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
