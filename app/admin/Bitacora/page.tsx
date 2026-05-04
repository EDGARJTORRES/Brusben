"use client"

import React, { useState, useEffect } from "react"
import { Search, History, Clock, Activity, FileText } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface LogEntry {
  id: number
  usuario: string
  accion: string
  modulo: string
  detalle: string
  fecha: string
}

const mockLogs: LogEntry[] = [
  { id: 1, usuario: "Edgar Junior Torres", accion: "Creación", modulo: "Usuarios", detalle: "Nuevo usuario DNI: 76543210", fecha: new Date().toISOString() },
  { id: 2, usuario: "Maria Lopez", accion: "Registro", modulo: "Pagos", detalle: "Monto: S/ 150.00", fecha: new Date(Date.now() - 3600000).toISOString() },
  { id: 3, usuario: "Sistema", accion: "Actualización", modulo: "Sistema", detalle: "Sincronización de matrículas completada", fecha: new Date(Date.now() - 7200000).toISOString() },
  { id: 4, usuario: "Admin", accion: "Eliminación", modulo: "Cursos", detalle: "Curso ID: 45 eliminado", fecha: new Date(Date.now() - 86400000).toISOString() },
  { id: 5, usuario: "Edgar Junior Torres", accion: "Edición", modulo: "Configuración", detalle: "Cambio de roles guardado", fecha: new Date(Date.now() - 172800000).toISOString() },
]

export default function BitacoraPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [moduloFilter, setModuloFilter] = useState("TODOS")

  useEffect(() => {
    // Simulación de fetch a una API. Reemplazar con endpoint real cuando exista:
    // fetch("http://localhost:8081/api/bitacora").then(...)
    const fetchLogs = async () => {
      setIsLoading(true)
      try {
        // Simulando delay de red
        await new Promise((resolve) => setTimeout(resolve, 800))
        setLogs(mockLogs)
      } catch (error) {
        console.error("Error fetching bitacora:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLogs()
  }, [])

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.usuario.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.detalle.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesModulo = moduloFilter === "TODOS" || log.modulo === moduloFilter

    return matchesSearch && matchesModulo
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h4 className="text-2xl font-black flex items-center gap-3 tracking-tight">
            <History className="h-6 w-6 text-primary" />
            Bitácora del Sistema
          </h4>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            Registro de actividades, auditoría y eventos importantes.
          </p>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="rounded-2xl bg-card backdrop-blur-sm overflow-hidden border border-border/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 px-6 py-4">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            Historial de Actividad
          </h2>
          <div className="flex items-center gap-2">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                placeholder="Buscar por usuario o acción..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 h-10 bg-muted/40 border-0 rounded-xl text-sm font-bold focus:ring-1 focus:ring-primary/20 transition-all outline-none w-64 md:w-80"
              />
            </div>
            <Select value={moduloFilter} onValueChange={setModuloFilter}>
              <SelectTrigger className="w-[150px] bg-muted/40 border-0 rounded-xl text-sm font-bold h-10">
                <SelectValue placeholder="Módulo" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/50 shadow-xl">
                <SelectItem value="TODOS" className="font-bold cursor-pointer">Todos los Módulos</SelectItem>
                <SelectItem value="Usuarios" className="font-bold cursor-pointer">Usuarios</SelectItem>
                <SelectItem value="Pagos" className="font-bold cursor-pointer">Pagos / Egresos</SelectItem>
                <SelectItem value="Matrículas" className="font-bold cursor-pointer">Matrículas</SelectItem>
                <SelectItem value="Cursos" className="font-bold cursor-pointer">Cursos</SelectItem>
                <SelectItem value="Sistema" className="font-bold cursor-pointer">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-b border-border/40 hover:bg-transparent">
                <TableHead className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground w-[180px]">Fecha y Hora</TableHead>
                <TableHead className="py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Usuario</TableHead>
                <TableHead className="py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Módulo</TableHead>
                <TableHead className="py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Acción</TableHead>
                <TableHead className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Detalle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5} className="h-16 animate-pulse bg-muted/20" />
                  </TableRow>
                ))
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center text-muted-foreground font-bold italic">
                    {logs.length === 0 
                      ? "No hay registros en la bitácora." 
                      : "Ningún registro coincide con los filtros."}
                  </TableCell>
                </TableRow>
              ) : filteredLogs.map((log) => (
                <TableRow key={log.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors group">
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-foreground">
                          {format(new Date(log.fecha), "dd MMM yyyy", { locale: es })}
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground">
                          {format(new Date(log.fecha), "HH:mm:ss a")}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 font-bold text-sm text-foreground">
                    {log.usuario}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider border-0 bg-primary/10 text-primary hover:bg-primary/20">
                      {log.modulo}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 font-black text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Activity className="h-3.5 w-3.5 opacity-70" />
                      {log.accion}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 opacity-50" />
                      {log.detalle}
                    </div>
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
