"use client"

import { useState, useEffect } from "react"
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  MoreVertical, 
  UserPlus, 
  Mail, 
  Shield, 
  CheckCircle2, 
  XCircle,
  Filter,
  User as UserIcon,
  Fingerprint
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface Usuario {
  idUsuario?: number
  dni: string
  nombres: string
  email: string
  password?: string
  activo: boolean
  idRol: number
  nombreRol?: string
}

const ROLES = [
  { id: 1, name: "admin", label: "Administradore", color: "bg-purple-500/10 text-purple-600 border-purple-200" },
  { id: 2, name: "docente", label: "Docente", color: "bg-blue-500/10 text-blue-600 border-blue-200" },
  { id: 3, name: "estudiante", label: "Estudiante", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200" },
]

export default function UsuariosPage() {
  const [users, setUsers] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<Usuario | null>(null)
  const [formData, setFormData] = useState<Usuario>({
    dni: "",
    nombres: "",
    email: "",
    password: "",
    activo: true,
    idRol: 3,
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/usuarios")
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (error) {
      toast.error("Error al cargar usuarios")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const method = editingUser ? "PUT" : "POST"
    const url = editingUser 
      ? `http://localhost:8081/api/usuarios/${editingUser.idUsuario}`
      : "http://localhost:8081/api/usuarios"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success(editingUser ? "Usuario actualizado" : "Usuario creado")
        setIsDialogOpen(false)
        fetchUsers()
        resetForm()
      } else {
        toast.error("Error al guardar usuario")
      }
    } catch (error) {
      toast.error("Error de conexión")
    }
  }

  const toggleStatus = async (user: Usuario) => {
    const action = user.activo ? "desactivar" : "reactivar"
    if (!confirm(`¿Estás seguro de ${action} este usuario?`)) return

    try {
      let res;
      if (user.activo) {
        res = await fetch(`http://localhost:8081/api/usuarios/${user.idUsuario}`, {
          method: "DELETE",
        })
      } else {
        res = await fetch(`http://localhost:8081/api/usuarios/${user.idUsuario}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...user, activo: true }),
        })
      }

      if (res.ok) {
        toast.success(user.activo ? "Usuario desactivado" : "Usuario reactivado")
        fetchUsers()
      } else {
        toast.error(`Error al ${action}`)
      }
    } catch (error) {
      toast.error(`Error al ${action}`)
    }
  }

  const resetForm = () => {
    setFormData({
      dni: "",
      nombres: "",
      email: "",
      password: "",
      activo: true,
      idRol: 3,
    })
    setEditingUser(null)
  }

  const openEditDialog = (user: Usuario) => {
    setEditingUser(user)
    setFormData({
      ...user,
      password: "", // No mostramos el password
    })
    setIsDialogOpen(true)
  }

  const filteredUsers = users.filter(u => 
    u.nombres.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.dni.includes(search)
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            Gestión de Usuarios
          </h1>
          <p className="text-muted-foreground mt-1 font-medium"> Administra los accesos de administradores, docentes y estudiantes.</p>
        </div>
        <Button 
          onClick={() => { resetForm(); setIsDialogOpen(true); }}
          className="rounded-xl h-11 px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all gap-2"
        >
          <UserPlus className="h-5 w-5" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ROLES.map((role) => (
          <Card key={role.id} className="border-none shadow-sm bg-secondary/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{role.label}s</p>
                  <p className="text-3xl font-black mt-1">
                    {users.filter(u => u.idRol === role.id).length}
                  </p>
                </div>
                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", role.color)}>
                  <UserIcon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-xl bg-background/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg font-bold">Listado de Usuarios</CardTitle>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nombre, email o DNI..." 
                className="pl-10 h-10 rounded-xl bg-background border-border/50 focus:ring-primary/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="font-bold py-4">Usuario</TableHead>
                <TableHead className="font-bold">DNI</TableHead>
                <TableHead className="font-bold">Rol</TableHead>
                <TableHead className="font-bold">Estado</TableHead>
                <TableHead className="text-right font-bold pr-8">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5} className="h-16 animate-pulse bg-muted/10" />
                  </TableRow>
                ))
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-medium">
                    No se encontraron usuarios.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.idUsuario} className="hover:bg-muted/30 transition-colors border-border/40">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase">
                          {user.nombres.substring(0, 2)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-foreground">{user.nombres}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground border border-border/50 flex items-center gap-1 w-fit">
                        <Fingerprint className="h-3 w-3" /> {user.dni}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "rounded-lg px-2.5 py-0.5 border font-bold capitalize",
                        ROLES.find(r => r.id === user.idRol)?.color
                      )}>
                        {user.nombreRol}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.activo ? (
                        <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Activo
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-rose-500 font-bold text-xs uppercase tracking-wider">
                          <XCircle className="h-3.5 w-3.5" /> Inactivo
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl shadow-xl">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-2 pb-2">Opciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEditDialog(user)} className="rounded-lg gap-2 font-bold cursor-pointer">
                            <Edit2 className="h-4 w-4 text-blue-500" /> Editar Datos
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1" />
                          <DropdownMenuItem onClick={() => toggleStatus(user)} className="rounded-lg gap-2 font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer">
                            {user.activo ? (
                              <>
                                <Trash2 className="h-4 w-4" /> Desactivar Usuario
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Reactivar Usuario
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
          <form onSubmit={handleSubmit}>
            <div className="bg-primary py-4 px-6 text-white relative">
              <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                <UserPlus className="h-6 w-6" />
                {editingUser ? "Editar Usuario" : "Crear Usuario"}
              </DialogTitle>
              
            </div>

            
            <div className="p-8 space-y-6 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-muted-foreground tracking-widest pl-1 ">Nombre Completo</label>
                  <Input 
                    placeholder="Ej. Juan Pérez" 
                    className="h-12 rounded-2xl bg-secondary/30 border-none focus:ring-2 focus:ring-primary/20 font-bold"
                    value={formData.nombres}
                    onChange={(e) => setFormData({...formData, nombres: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-muted-foreground tracking-widest pl-1">DNI / ID</label>
                  <Input 
                    placeholder="12345678" 
                    className="h-12 rounded-2xl bg-secondary/30 border-none focus:ring-2 focus:ring-primary/20 font-bold"
                    value={formData.dni}
                    onChange={(e) => setFormData({...formData, dni: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-muted-foreground tracking-widest pl-1">Correo Electrónico</label>
                <Input 
                  type="email"
                  placeholder="usuario@brusben.com" 
                  className="h-12 rounded-2xl bg-secondary/30 border-none focus:ring-2 focus:ring-primary/20 font-bold"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-muted-foreground tracking-widest pl-1">Contraseña</label>
                  <Input 
                    type="password"
                    placeholder={editingUser ? "•••••••• (Opcional)" : "••••••••"}
                    className="h-12 rounded-2xl bg-secondary/30 border-none focus:ring-2 focus:ring-primary/20 font-bold"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required={!editingUser}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-muted-foreground tracking-widest pl-1">Rol Asignado</label>
                  <Select 
                    value={formData.idRol.toString()} 
                    onValueChange={(v) => setFormData({...formData, idRol: parseInt(v)})}
                  >
                    <SelectTrigger className="h-12 rounded-2xl bg-secondary/30 border-none focus:ring-2 focus:ring-primary/20 font-bold">
                      <SelectValue placeholder="Seleccionar Rol" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border/50 shadow-2xl">
                      {ROLES.map(role => (
                        <SelectItem key={role.id} value={role.id.toString()} className="font-bold py-3">
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                <input 
                  type="checkbox" 
                  id="activo" 
                  className="h-5 w-5 rounded-md border-emerald-500/20 bg-white"
                  checked={formData.activo}
                  onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                />
                <label htmlFor="activo" className="text-sm font-bold text-emerald-700 cursor-pointer">
                  Habilitar acceso al usuario (Activo)
                </label>
              </div>
            </div>

            <DialogFooter className="bg-secondary/20 p-8 pt-0">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-12 px-6 font-bold rounded-2xl">
                Cancelar
              </Button>
              <Button type="submit" className="h-12 px-8 font-black rounded-2xl bg-primary shadow-lg shadow-primary/20">
                {editingUser ? "Guardar Cambios" : "Crear Usuario"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

import { cn } from "@/lib/utils"
